require('./popup.less');

var $                         = require('jquery');
var { UI, Plugin, Component } = require('../core');
var pluginName                = "popup";
var pluginDataName            = "ui.popup";

// variables
var w  = window;
var $w = $(w);

function windowHeight() {
  return $w.height();
};

function windowWidth() {
  return $w.width();
};

var d       = $(document);
var wH      = windowHeight();
var wW      = windowWidth();
var prefix  = '__popup';
// Used for a temporary fix for ios6 timer bug when using zoom/scroll
var isIOS6X = (/OS 6(_\d)+/i).test(navigator.userAgent);
var buffer  = 200;
var popups  = 0;

var inside, fixedVPos, fixedHPos, fixedPosStyle, vPos, hPos, height, width, debounce, autoCloseTO;

function getLeftPos(includeScroll) {
  return includeScroll ? hPos + d.scrollLeft() : hPos;
};

function getTopPos(includeScroll) {
  return includeScroll ? vPos + d.scrollTop() : vPos;
};

var Popup = Component.extend({
  pluginName: pluginName,
  initialize: function ($element, options) {
    // hide scrollbar?
    if (!options.scrollBar) {
      $('html').css('overflow', 'hidden');
    }
    // initialize.
    this._init();
  },
  destroy: function () {
    console.log('popup.destroy()');
    // destroy() base component.
    this._destroy();
    // unbind events.
    this._unbindEvents();
  },
  _init: function () {
    var o         = this.options;
    var $popup    = this.$element;
    this._triggerCall(o.onOpen);
    // reset current popup counts, how many popups rendered in dom view.
    popups        = ($w.data(pluginName) || 0) + 1;
    this.id       = prefix + popups + '__';
    fixedVPos     = o.position[1] !== 'auto';
    fixedHPos     = o.position[0] !== 'auto';
    fixedPosStyle = o.positionStyle === 'fixed';
    height        = $popup.outerHeight(true);
    width         = $popup.outerWidth(true);
    $w.data(pluginName, popups);
    o.loadUrl ? this.createContent() : this.open();
  },
  _bindEvents: function () {
    var $popup = this.$element;
    var o      = this.options;
    var id     = this.id;

    //bind close button for windows.
    $popup.on('click.' + id, '.close, .' + o.closeClass, this.bind(this.close));
    if (o.modalClose) {
      $('.popup-modal.' + id).css('cursor', 'pointer').on('click', this.bind(this.close));
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
      }).on('resize.' + id, this.bind(this.reposition));
    }
    if (o.escClose) {
      d.on('keydown.' + id, this.bind(function (e) {
        if (e.which == 27) { //escape
          // TODO.if we have multi popup, calculate which popup is best front.
          this.close();
        }
      }));
    }
  },
  _unbindEvents: function () {
    var o      = this.options;
    var $popup = this.$element;
    var id     = this.id;
    if (!o.scrollBar) {
      $('html').css('overflow', 'auto');
    }
    d.off('keydown.' + id);
    $('.popup-modal.' + id).off('click');
    $w.off('.' + id).data(pluginName, ($w.data(pluginName) - 1 > 0) ? $w.data(pluginName) - 1 : null);
    $popup.off('click.' + id, '.close, .' + o.closeClass);
  },

  _triggerCall: function (func, arg) {
    $.isFunction(func) && func.call(this, arg);
  },
  _calcPosition: function () {
    var $popup = this.$element;
    var o      = this.options;
    vPos       = fixedVPos ? o.position[1] : Math.max(0, ((wH - $popup.outerHeight(true)) / 2) - o.amsl), hPos = fixedHPos ? o.position[0] : (wW - $popup.outerWidth(true)) / 2, inside = this._insideWindow();
  },
  _insideWindow: function () {
    var $popup = this.$element;
    return {
      x: wW > $popup.outerWidth(true),
      y: wH > $popup.outerHeight(true)
    };
  },
  createContent: function () {
    var o              = this.options;
    var $popup         = this.$element;
    o.contentContainer = o.contentContainer ? $(o.contentContainer, $popup) : $popup;
    switch (o.content) {
      case ('iframe'):
        var iframe = $('<iframe class="popup-iframe" ' + o.iframeAttr + '></iframe>');
        height     = $popup.outerHeight(true);
        width      = $popup.outerWidth(true);
        iframe.appendTo(o.contentContainer);
        this.open();
        iframe.attr('src', o.loadUrl); // setting iframe src after open due IE9 bug
        this._triggerCall(o.loadCallback);
        break;

      case ('image'):
        this.open();
        $('<img />').load(this.bind(function () {
         this._triggerCall(o.loadCallback);
         this.recenter($(this));
       })).attr('src', o.loadUrl).hide().appendTo(o.contentContainer);
        break;

      default:
        this.open();
        $('<div class="popup-ajax-wrapper"></div>')
          .load(o.loadUrl, o.loadData, this.bind(function (response, status, xhr) {
            this._triggerCall(o.loadCallback, status);
            this.recenter($(this));
          })).hide().appendTo(o.contentContainer);

        break;
    }
  },
  open: function () {
    var o      = this.options;
    var $popup = this.$element;
    var id     = this.id;
    // MODAL OVERLAY
    if (o.modal) {
      $('<div class="popup-modal ' + id + '"></div>')
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
    this._calcPosition();

    $popup
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

    this.doTransition(true);
  },
  close: function () {
    var $popup = this.$element;
    var o      = this.options;
    var id     = this.id;
    if (o.modal) {
      $('.popup-modal.' + id).fadeTo(o.speed, 0, function () {
        $(this).remove();
      });
    }
    // Clean up
    this.destroy();

    clearTimeout(autoCloseTO);

    // Close trasition
    this.doTransition();

    return false; // Prevent default
  },
  reposition: function (animateSpeed) {
    var $popup        = this.$element;
    var o             = this.options;
    var _calcPosition = this.bind(this._calcPosition);
    wH                = windowHeight();
    wW                = windowWidth();
    inside            = this._insideWindow();

    if (inside.x || inside.y) {
      clearTimeout(debounce);
      debounce = setTimeout(function () {
        _calcPosition();
        animateSpeed = animateSpeed || o.followSpeed;
        var css = {};
        if (inside.x){
          css.left = o.follow[0] ? getLeftPos(true) : 'auto';
        }
        if (inside.y){
          css.top = o.follow[1] ? getTopPos(true) : 'auto';
        }
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
  },
  recenter: function (content) {
    var _width  = content.width();
    var _height = content.height();
    var $popup  = this.$element;
    var o       = this.options;
    var css     = {};

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
    height = $popup.outerHeight(true);
    width = $popup.outerWidth(true);

    this._calcPosition();

    o.contentContainer.css({
      height: 'auto',
      width: 'auto'
    });

    css.left = getLeftPos(!(!o.follow[0] && fixedHPos || fixedPosStyle));
    css.top = getTopPos(!(!o.follow[1] && fixedVPos || fixedPosStyle));

    $popup.animate(css, 250,
      this.bind(function () {
        content.show();
        inside = this._insideWindow();
      }));
  },
  doTransition: function (open) {
    var o = this.options;
    var $popup = this.$element;

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
        $popup.stop().fadeTo(o.speed, open ? 1 : 0, this.bind(function () {
          this.onCompleteCallback(open);
        }));
    }
  },
  animate: function (css) {
    var $popup = this.$element;
    var o = this.options;

    $popup.css({
      display: 'block',
      opacity: 1
    }).animate(css, o.speed, o.easing, this.bind(function () {
      this.onCompleteCallback(open);
    }));
  },
  onCompleteCallback: function (open) {
    var $popup = this.$element;
    var o      = this.options;

    if (open) {
      this._bindEvents();
      this._triggerCall();
      if (o.autoClose) {
        autoCloseTO = setTimeout(this.close, o.autoClose);
      }
    } else {
      $popup.hide();
      this._triggerCall(o.onClose);
      if (o.loadUrl) {
        o.contentContainer.empty();
        $popup.css({
          height: 'auto',
          width: 'auto'
        });
      }
    }
  }
});

// The default configurations.
Popup.DEFAULTS = {
  amsl: 50,
  appending: true,
  appendTo: 'body',
  autoClose: false,
  closeClass: 'close',
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

// Registerd plugin.
Plugin(pluginName, Popup);

// DOMReady.
UI.ready(function Popup(context) {
  var $popup = $('[data-popup]', context);

  // auto initialize component via data-api.
  $popup[pluginName]();

}, pluginDataName);

module.exports = Popup;
