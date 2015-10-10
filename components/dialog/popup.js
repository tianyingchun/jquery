require('./popup.less');

var $ = require('jquery');

var pluginName = "ui.popup";

//
// The $popup is $('selector') it's an array.
function moduleInject($popup, options, callback) {

  if ($.isFunction(options)) {
    callback = options;
    options = null;
  }

  // merge options
  var o = $.extend({}, Plugin.DEFAULTS, options);

  // hide scrollbar?
  if (!o.scrollBar) {
    $('html').css('overflow', 'hidden');
  }

  // variables
  var d = $(document),
    w = window,
    $w = $(w),
    wH = windowHeight(),
    wW = windowWidth(),
    prefix = '__b-popup',
    isIOS6X = (/OS 6(_\d)+/i).test(navigator.userAgent), // Used for a temporary fix for ios6 timer bug when using zoom/scroll
    buffer = 200,
    popups = 0,
    id, inside, fixedVPos, fixedHPos, fixedPosStyle, vPos, hPos, height, width, debounce, autoCloseTO;

  //
  // The public methods
  // ----------------------------------------------------------

  $popup.close = function () {
    close();
  };

  $popup.reposition = function (animateSpeed) {
    reposition(animateSpeed);
  };

  return $popup.each(function () {
    // POPUP already exists?
    if ($(this).data(pluginName)) return;
    // initialize popup.
    init();
  });

  //
  // The private helper methods
  // ----------------------------------------------------------

  function init() {
    triggerCall(o.onOpen);
    popups = ($w.data(pluginName) || 0) + 1;
    id = prefix + popups + '__';
    fixedVPos = o.position[1] !== 'auto';
    fixedHPos = o.position[0] !== 'auto';
    fixedPosStyle = o.positionStyle === 'fixed';
    height = $popup.outerHeight(true);
    width = $popup.outerWidth(true);
    o.loadUrl ? createContent() : open();
  };

  function createContent() {
    o.contentContainer = $(o.contentContainer || $popup);
    switch (o.content) {
      case ('iframe'):
        var iframe = $('<iframe class="b-iframe" ' + o.iframeAttr + '></iframe>');
        iframe.appendTo(o.contentContainer);
        height = $popup.outerHeight(true);
        width = $popup.outerWidth(true);

        open();

        iframe.attr('src', o.loadUrl); // setting iframe src after open due IE9 bug
        triggerCall(o.loadCallback);
        break;
      case ('image'):

        open();

        $('<img />').load(function () {
          triggerCall(o.loadCallback);
          recenter($(this));
        }).attr('src', o.loadUrl).hide().appendTo(o.contentContainer);

        break;
      default:
        open();

        $('<div class="b-ajax-wrapper"></div>')
          .load(o.loadUrl, o.loadData, function (response, status, xhr) {
            triggerCall(o.loadCallback, status);
            recenter($(this));
          }).hide().appendTo(o.contentContainer);

        break;
    }
  };

  function open() {
    // MODAL OVERLAY
    if (o.modal) {
      $('<div class="b-modal ' + id + '"></div>')
        .css({
          backgroundColor: o.modalColor,
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          opacity: 0,
          zIndex: o.zIndex + popups
        })
        .appendTo(o.appendTo)
        .fadeTo(o.speed, o.opacity);
    }

    // POPUP
    calcPosition();

    $popup
      .data(pluginName, o).data('id', id)
      .css({
        'left': o.transition == 'slideIn' || o.transition == 'slideBack' ? (o.transition == 'slideBack' ? d.scrollLeft() + wW : (hPos + width) * -1) : getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)),
        'position': o.positionStyle || 'absolute',
        'top': o.transition == 'slideDown' || o.transition == 'slideUp' ? (o.transition == 'slideUp' ? d.scrollTop() + wH : vPos + height * -1) : getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle)),
        'z-index': o.zIndex + popups + 1
      }).each(function () {
        if (o.appending) {
          $(this).appendTo(o.appendTo);
        }
      });

    doTransition(true);
  };

  function close() {
    if (o.modal) {
      $('.b-modal.' + $popup.data('id'))
        .fadeTo(o.speed, 0, function () {
          $(this).remove();
        });
    }
    // Clean up
    unbindEvents();

    clearTimeout(autoCloseTO);

    // Close trasition
    doTransition();

    return false; // Prevent default
  };

  function reposition(animateSpeed) {
    wH = windowHeight();
    wW = windowWidth();
    inside = insideWindow();
    if (inside.x || inside.y) {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        calcPosition();
        animateSpeed = animateSpeed || o.followSpeed;
        var css = {};
        if (inside.x)
          css.left = o.follow[0] ? getLeftPos(true) : 'auto';
        if (inside.y)
          css.top = o.follow[1] ? getTopPos(true) : 'auto';
        $popup.dequeue().each(function () {
          if (fixedPosStyle) {
            $(this).css({
              'left': hPos,
              'top': vPos
            });
          } else {
            $(this).animate(css, animateSpeed, o.followEasing);
          }
        });
      }, 50);
    }
  };

  //Eksperimental
  function recenter(content) {
    var _width = content.width(),
      _height = content.height(),
      css = {};
    o.contentContainer.css({
      height: _height,
      width: _width
    });

    if (_height >= $popup.height()) {
      css.height = $popup.height();
    }
    if (_width >= $popup.width()) {
      css.width = $popup.width();
    }
    height = $popup.outerHeight(true), width = $popup.outerWidth(true);

    calcPosition();

    o.contentContainer.css({
      height: 'auto',
      width: 'auto'
    });

    css.left = getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle));
    css.top = getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle));

    $popup.animate(
      css, 250,
      function () {
        content.show();
        inside = insideWindow();
      }
    );
  };

  function bindEvents() {
    $w.data(pluginName, popups);
    // $popup.delegate('.ui-close, .' + o.closeClass, 'click.' + id, close); // legacy, still supporting the close class bClose
    $popup.on('click.' + id, '.ui-close, .' + o.closeClass, close);
    if (o.modalClose) {
      $('.b-modal.' + id).css('cursor', 'pointer').on('click', close);
    }

    // Temporary disabling scroll/resize events on devices with IOS6+
    // due to a bug where events are dropped after pinch to zoom
    if (!isIOS6X && (o.follow[0] || o.follow[1])) {
      $w.on('scroll.' + id, function () {
        if (inside.x || inside.y) {
          var css = {};
          if (inside.x)
            css.left = o.follow[0] ? getLeftPos(!fixedPosStyle) : 'auto';
          if (inside.y)
            css.top = o.follow[1] ? getTopPos(!fixedPosStyle) : 'auto';
          $popup.dequeue().animate(css, o.followSpeed, o.followEasing);
        }
      }).on('resize.' + id, function () {
        reposition();
      });
    }
    if (o.escClose) {
      d.on('keydown.' + id, function (e) {
        if (e.which == 27) { //escape
          close();
        }
      });
    }
  };

  function unbindEvents() {
    if (!o.scrollBar) {
      $('html').css('overflow', 'auto');
    }
    $('.b-modal.' + id).off('click');
    d.off('keydown.' + id);
    $w.off('.' + id).data(pluginName, ($w.data(pluginName) - 1 > 0) ? $w.data(pluginName) - 1 : null);
    // $popup.undelegate('.ui-close, .' + o.closeClass, 'click.' + id, close).data(pluginName, null);
    $popup.off('click.' + id, '.ui-close, .' + o.closeClass, close).data(pluginName, null);
  };

  function doTransition(open) {
    switch (open ? o.transition : o.transitionClose || o.transition) {
      case "slideIn":
        animate({
          left: open ? getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)) : d.scrollLeft() - (width || $popup.outerWidth(true)) - buffer
        });
        break;
      case "slideBack":
        animate({
          left: open ? getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle)) : d.scrollLeft() + wW + buffer
        });
        break;
      case "slideDown":
        animate({
          top: open ? getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle)) : d.scrollTop() - (height || $popup.outerHeight(true)) - buffer
        });
        break;
      case "slideUp":
        animate({
          top: open ? getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle)) : d.scrollTop() + wH + buffer
        });
        break;
      default:
        //Hardtyping 1 and 0 to ensure opacity 1 and not 0.9999998
        $popup.stop().fadeTo(o.speed, open ? 1 : 0, function () {
          onCompleteCallback(open);
        });
    }

    function animate(css) {
      $popup.css({
        display: 'block',
        opacity: 1
      }).animate(css, o.speed, o.easing, function () {
        onCompleteCallback(open);
      });
    };
  };

  function onCompleteCallback(open) {
    if (open) {
      bindEvents();
      triggerCall(callback);
      if (o.autoClose) {
        autoCloseTO = setTimeout(close, o.autoClose);
      }
    } else {
      $popup.hide();
      triggerCall(o.onClose);
      if (o.loadUrl) {
        o.contentContainer.empty();
        $popup.css({
          height: 'auto',
          width: 'auto'
        });
      }
    }
  };

  function getLeftPos(includeScroll) {
    return includeScroll ? hPos + d.scrollLeft() : hPos;
  };

  function getTopPos(includeScroll) {
    return includeScroll ? vPos + d.scrollTop() : vPos;
  };

  function triggerCall(func, arg) {
    $.isFunction(func) && func.call($popup, arg);
  };

  function calcPosition() {
    vPos = fixedVPos ? o.position[1] : Math.max(0, ((wH - $popup.outerHeight(true)) / 2) - o.amsl), hPos = fixedHPos ? o.position[0] : (wW - $popup.outerWidth(true)) / 2, inside = insideWindow();
  };

  function insideWindow() {
    return {
      x: wW > $popup.outerWidth(true),
      y: wH > $popup.outerHeight(true)
    }
  };

  function windowHeight() {
    return $w.height();
  };

  function windowWidth() {
    return $w.width();
  };
};

//Normally we only trigger dialog from specificed element
function Plugin(options, callback) {
  return moduleInject(this, options, callback);
};

// DEFAULTS
Plugin.DEFAULTS = {
  amsl: 50,
  appending: true,
  appendTo: 'body',
  autoClose: false,
  closeClass: 'ui-close',
  content: 'ajax', // ajax, iframe or image
  contentContainer: false,
  easing: 'swing',
  escClose: true,
  follow: [true, true], // x, y
  followEasing: 'swing',
  followSpeed: 500,
  iframeAttr: 'scrolling="no" frameborder="0"',
  loadCallback: false,
  loadData: false,
  loadUrl: false,
  modal: true,
  modalClose: true,
  modalColor: '#000',
  onClose: false,
  onOpen: false,
  opacity: 0.7,
  position: ['auto', 'auto'], // x, y,
  positionStyle: 'absolute', // absolute or fixed
  scrollBar: true,
  speed: 250, // open & close speed
  transition: 'fadeIn', //transitions: fadeIn, slideDown, slideIn, slideBack
  transitionClose: false,
  zIndex: 9997 // popup gets z-index 9999, modal overlay 9998
};

// Expose plugin to $.fn.prototype.
$.fn.extend({
  popup: Plugin
});

module.exports = Plugin;

