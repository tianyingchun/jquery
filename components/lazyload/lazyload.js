require('./lazyload.less');

// fork from https://github.com/jieyou/lazyload/blob/master/lazyload.js
// https://github.com/tuupola/jquery_lazyload/blob/master/jquery.lazyload.js
//
var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "lazyload";
var lang = require('../../utils/lang');
var w = window;
var $window = $(w);
var emptyFn = lang.noop;

function belowthefold($element, options) {
  var fold;
  if (options._$container == $window) {
    fold = ('innerHeight' in w ? w.innerHeight : $window.height()) + $window.scrollTop();
  } else {
    fold = options._$container.offset().top + options._$container.height();
  }
  return fold <= $element.offset().top - options.threshold;
}

function rightoffold($element, options) {
  var fold;
  if (options._$container == $window) {
    // Zepto do not support `$window.scrollLeft()` yet.
    fold = $window.width() + ($.fn.scrollLeft ? $window.scrollLeft() : w.pageXOffset);
  } else {
    fold = options._$container.offset().left + options._$container.width();
  }
  return fold <= $element.offset().left - options.threshold;
}

function abovethetop($element, options) {
  var fold;
  if (options._$container == $window) {
    fold = $window.scrollTop();
  } else {
    fold = options._$container.offset().top;
  }
  // console.log('abovethetop fold '+ fold)
  // console.log('abovethetop $element.height() '+ $element.height())
  return fold >= $element.offset().top + options.threshold + $element.height();
}

function leftofbegin($element, options) {
  var fold;
  if (options._$container == $window) {
    // Zepto do not support `$window.scrollLeft()` yet.
    fold = $.fn.scrollLeft ? $window.scrollLeft() : w.pageXOffset;
  } else {
    fold = options._$container.offset().left;
  }
  return fold >= $element.offset().left + options.threshold + $element.width();
}

function inviewport(element, options) {
  return !rightoffold(element, options) && !leftofbegin(element, options) && !belowthefold(element, options) && !abovethetop(element, options);
}


function checkAppear($elements, options) {
  var counter = 0;
  $elements.each(function (i, e) {
    var $element = $elements.eq(i);
    if (($element.width() <= 0 && $element.height() <= 0) || $element.css('display') === 'none') {
      return;
    }

    if (options.skip_invisible && !$element.is(":visible")) {
      return;
    }

    function appear() {
      $element.trigger('_lazyload_appear');
      // if we found an image we'll load, reset the counter
      counter = 0;
    }
    // If vertical_only is set to true, only check the vertical to decide appear or not
    // In most situations, page can only scroll vertically, set vertical_only to true will improve performance
    if (options.vertical_only) {
      if (abovethetop($element, options)) {
        // Nothing.
      } else if (!belowthefold($element, options)) {
        appear();
      } else {
        if (++counter > options.failure_limit) {
          return false;
        }
      }
    } else {
      if (abovethetop($element, options) || leftofbegin($element, options)) {
        // Nothing.
      } else if (!belowthefold($element, options) && !rightoffold($element, options)) {
        appear();
      } else {
        if (++counter > options.failure_limit) {
          return false;
        }
      }
    }
  });
}

// Remove image from array so it is not looped next time.
function getUnloadElements($elements) {
  return $elements.filter(function (i, e) {
    return !$elements.eq(i).data('_lazyload_loadStarted');
  });
}

// throttle : https://github.com/component/throttle , MIT License
function throttle(func, wait) {
  var ctx, args, rtn, timeoutID; // caching
  var last = 0;

  return function throttled() {
    ctx = this;
    args = arguments;
    var delta = new Date() - last;
    if (!timeoutID)
      if (delta >= wait) call();
      else timeoutID = setTimeout(call, wait - delta);
    return rtn;
  };

  function call() {
    timeoutID = 0;
    last = +new Date();
    rtn = func.apply(ctx, args);
    ctx = null;
    args = null;
  }
}

/**
 * The Plugin Component
 *
 * @author <tianyingchun@outlook.com>
 * @param {DOMNode} element
 * @param {Object} options
 */
var Lazyload = ComponentClass.extend({
  componentName: componentName,

  /** @override */
  initialize: function ($element, options) {

    var $lazyElements = this.$lazyImages = $element.find(options.lazy_item_selector);

    // option converter.
    this._parseOptions(options);

    var isScrollEvent = this.isScrollEvent = options.event == 'scroll';

    // isScrollTypeEvent cantains custom scrollEvent . Such as 'scrollstart' & 'scrollstop'
    // https://github.com/search?utf8=%E2%9C%93&q=scrollstart
    this.isScrollTypeEvent = isScrollEvent || options.event == 'scrollstart' || options.event == 'scrollstop';

    var throttleCheckAppear = this.throttleCheckAppear = this._throttleCheckAppear(options);

    // lazyload pictures.
    this.doLazyLoading();

    // Check if something appears when window is resized.
    // Force initial check if images should appear when window is onload.
    $window.on('resize load', function () {
      throttleCheckAppear($lazyElements, options);
    });

    // Force initial check if images should appear.
    $(function () {
      throttleCheckAppear($lazyElements, options);
    });
  },
  // @private
  _throttleCheckAppear: function (options) {
    var throttleCheckAppear =
      options.check_appear_throttle_time == 0
      ? checkAppear
      : throttle(checkAppear, options.check_appear_throttle_time);
      return throttleCheckAppear;
  },
  // @public
  refreshAreaLazy: function(context) {
    var $context = context || this.$element;
    var options = this.options;
    var $lazyElements = $context.find(options.lazy_item_selector);
    var throttleCheckAppear = this._throttleCheckAppear(options);

    // manully refresh lazy elements within specificed area container.
    throttleCheckAppear($lazyElements, options);
  },
  // @public
  doLazyLoading: function () {
    var $elements = this.$lazyImages;
    var isScrollTypeEvent = this.isScrollTypeEvent;
    var isScrollEvent = this.isScrollEvent;
    var throttleCheckAppear = this.throttleCheckAppear;
    var options = this.options;

    $elements.each(function (i, e) {
      var element = this;
      var $element = $elements.eq(i);
      var placeholderSrc = $element.attr('src');
      var originalSrcInAttr = $element.attr('data-' + options.data_attribute); // `data-original` attribute value
      var originalSrc = options.url_rewriter_fn == emptyFn ?
          originalSrcInAttr :
          options.url_rewriter_fn.call(element, $element, originalSrcInAttr);

      var originalSrcset = $element.attr('data-' + options.data_srcset_attribute);
      var isImg = $element.is('img');

      // console.log('$element.data("_lazyload_loadStarted")', $element.data('_lazyload_loadStarted'));

      if ($element.data('_lazyload_loadStarted') == true || placeholderSrc == originalSrc) {
        $element.data('_lazyload_loadStarted', true);
        $elements = getUnloadElements($elements);
        return;
      }
      $element.data('_lazyload_loadStarted', false);

      // If element is an img and no src attribute given, use placeholder.
      if (isImg && !placeholderSrc) {
        // For browsers that do not support data image.
        $element.one('error', function () { // `on` -> `one` : IE6 triggered twice error event sometimes
          $element.attr('src', options.placeholder_real_img);
        }).attr('src', options.placeholder_data_img);
      }

      // When appear is triggered load original image.
      $element.one('_lazyload_appear', function () {
        var effectParamsIsArray = $.isArray(options.effect_params);
        var effectIsNotImmediacyShow;

        function loadFunc() {
          // In most situations, the effect is immediacy show, at this time there is no need to hide element first
          // Hide this element may cause css reflow, call it as less as possible
          if (effectIsNotImmediacyShow) {
            // todo: opacity:0 for fadeIn effect
            $element.hide();
          }
          if (isImg) {
            // attr srcset first
            if (originalSrcset) {
              $element.attr('srcset', originalSrcset);
            }
            if (originalSrc) {
              $element.attr('src', originalSrc);
            }
          } else {
            $element.css('background-image', 'url("' + originalSrc + '")');
          }
          if (effectIsNotImmediacyShow) {
            $element[options.effect].apply($element, effectParamsIsArray ? options.effect_params : []);
          }
          $elements = getUnloadElements($elements);

          console.debug('lazyload elements: ', $elements.length);
        }
        if (!$element.data('_lazyload_loadStarted')) {
          effectIsNotImmediacyShow = (options.effect != 'show' && $.fn[options.effect] && (!options.effect_params || (effectParamsIsArray && options.effect_params.length == 0)));
          if (options.appear != emptyFn) {
            options.appear.call(element, $element, $elements.length, options);
          }
          $element.data('_lazyload_loadStarted', true);
          if (options.no_fake_img_loader || originalSrcset) {
            if (options.load != emptyFn) {
              $element.one('load', function () {
                options.load.call(element, $element, $elements.length, options);
              });
            }
            loadFunc();
          } else {
            $('<img />').one('load', function () { // `on` -> `one` : IE6 triggered twice load event sometimes
              loadFunc();
              if (options.load != emptyFn) {
                options.load.call(element, $element, $elements.length, options);
              }
            }).attr('src', originalSrc);
          }
        }
      });
      // When wanted event is triggered load original image
      // by triggering appear.
      if (!isScrollTypeEvent) {
        $element.off(options.event).on(options.event, function () {
          if (!$element.data('_lazyload_loadStarted')) {
            $element.trigger('_lazyload_appear');
          }
        });
      }
    });
    // Fire one scroll event per scroll. Not one scroll event per image.
    if (isScrollTypeEvent) {
      options._$container.off(options.event).on(options.event, function () {
        throttleCheckAppear($elements, options);
      });
    }

    return this;
  },
  // @override
  setOptions: function (options) {
    this.options = $.extend(this.options, options);
    this._parseOptions(this.options);
  },
  // @private
  _parseOptions: function (options) {
    $.each(options, function (k, v) {
      if ($.inArray(k, ['threshold', 'failure_limit', 'check_appear_throttle_time']) != -1) { // these params can be a string
        if (lang.isString(options[k])) {
          options[k] = parseInt(options[k], 10);
        } else {
          options[k] = v;
        }
      } else if (k == 'container') { // options.container can be a seletor string \ dom \ jQuery object
        if (options.hasOwnProperty(k)) {
          if (options[k] == w || options[k] == document) {
            options._$container = $window;
          } else {
            options._$container = $(options[k]);
          }
        } else {
          options._$container = $window;
        }
        delete options.container;
      }
    });
  },

  destroy: function () {
    // destory related resource of base component.
    this._destroy();
  }
});

Lazyload.DEFAULTS = {

  // number
  threshold: 0,

  // the lazy item selector
  lazy_item_selector: '.lazy',
  // number
  failure_limit: 0,
  event: 'scroll',
  effect: 'show',
  effect_params: null,
  container: window,
  data_attribute: 'original',
  data_srcset_attribute: 'original-srcset',
  skip_invisible: true,
  appear: emptyFn,
  load: emptyFn,
  vertical_only: false,

  // number
  check_appear_throttle_time: 300,
  url_rewriter_fn: emptyFn,
  no_fake_img_loader: false,
  placeholder_data_img: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC',
  // for IE6\7 that does not support data image
  placeholder_real_img: 'http://ditu.baidu.cn/yyfm/lazyload/0.0.1/img/placeholder.png'
  // todo : 将某些属性用global来配置，而不是每次在$(selector).lazyload({})内配置
};


// Register plugin.
createPlugin(componentName, Lazyload);

UI.ready(function lazyload(context) {

  // Note. for performance issue, we only attach data-lazyload="{}" to root DOMNode that contains all lazyload image with attribute data-original="the real image url"
  var $lazyload = $('[data-lazyload]', context);

  // auto initialize component via data-api.
  $lazyload[componentName]();

}, Lazyload.getInstanceName());

module.exports = Lazyload;
