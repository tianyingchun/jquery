var $ = require("jquery");
var template = require("../../utils/template");
var { UI, createPlugin, ComponentClass } = require('../core');
var Popup = require("./popup");

var componentName = 'alert';

var popupTpl =
  '<div class="popup <%=type%> <%=classes%>">' +
  ' <div class="popup-dialog">' +
  '   <% if(header) { %>  ' +
  '     <div class="popup-hd">' +
  '     <%=header.html %>' +
  '     <% if(header.showClose) { %>  ' +
  '       <span class="close">×</span>' +
  '     <% }%>  ' +
  '   </div>' +
  '   <% }%>  ' +
  '     <div class="popup-bd">' +
  '         <%:=body %>' +
  '     </div>' +
  '   <% if(footer) { %>  ' +
  '     <div class="popup-footer">' +
  '         <%:= footer.html%>' +
  '     </div>' +
  '   <% } %> ' +
  ' </div>' +
  '</div>';

var DEFAULTS = {
  onOpen: false,
  onClose: false,
  onActionClicked: false,
  autoClose: false,
  modal: true,
  modalClose: false,
  modalColor: '#000',
  opacity: 0.7,
  appendTo: 'body',
  classes: "",
  // if equals false, don't show header.
  header: {
    showClose: true,
    html: "Your Header"
  },
  body: "Your dialog body",
  // if equals false, don't show footer.
  footer: {
    html: '<button class="btn btn-primary btn-sm btn-popup" data-trigger="ok">确定</button>'
  }
};

var DEFAULTS_CONFIRM = {
  footer: {
    html: '<span class="btn btn-primary btn-sm btn-popup" data-trigger="cancel">取消</span>&nbsp;&nbsp;<span class="btn btn-primary btn-sm btn-popup" data-trigger="confirm">确定</span>'
  },
  onActionClicked: function ($target) {
    if ($target.data('trigger') === "confirm") {
      triggerCall.call(this, this.options.onConfirm, $target);
    } else {
      triggerCall.call(this, this.options.onCancel, $target);
    }
  }
};

var DEFAULTS_SPINNER = {
  header:null,
  footer: null,
  body: 'loading...',
  appendTo: 'body',
  onOpen: false,
  onClose: false
};

function triggerCall(func, arg) {
  $.isFunction(func) && func.call(this, arg);
};

function dialog(type, options) {

  var containerClass = '.' + type;

  var o = $.extend({type: type}, DEFAULTS, options);
  var $context = $(o.appendTo);
  var $element = $(containerClass, $context);
  if (!$element.size()) {
    $element = $(template(popupTpl, o)).appendTo($context);
  }

  // the options of popup.
  var popupOptions = {
    onOpen: function () {
      triggerCall.call(this, o.onOpen);
      bindEvent(this);
    },
    onClose: function () {
      triggerCall.call(this, o.onClose);
      unbindEvents(this);
    },
    autoDestroy: true,
    appendTo: o.appendTo,
    appending: true,
    // for confirm dialog box.
    onConfirm: o.onConfirm,
    modalColor: o.modalColor,
    opacity: o.opacity,
    // for cancel dialog box.
    onCancel: o.onCancel,
    modal: o.modal,
    modalClose: o.modalClose,
    autoClose: o.autoClose,
    scrollBar: false
  };

  var popupInstance = new Popup($element, popupOptions).show();

  function bindEvent(popup) {
    popup.$element.on('click', '[data-trigger]', function (e) {
      triggerCall.call(popup, o.onActionClicked, $(this));
    });
  }

  function unbindEvents(popup) {
    popup.$element.off('click');
  }

  return popupInstance;
}

module.exports = {
  alert: function (options) {
    // show alert popup and return instance.
    return dialog('popup-alert', options);
  },
  confirm: function (options) {
    // show confirm popup and return instance.
    return dialog('popup-confirm', $.extend({}, DEFAULTS_CONFIRM, options));
  },
  // message is required, container is optional
  // {
  //   body: message,
  //   appendTo: container || 'body',
  //   onOpen: onOpen,
  //   onClose: onClose,
  //   modalColor: o.modalColor,
  //   opacity: o.opacity,
  // }
  // {message, container, onOpen, onClose}
  spinner: function (options) {
    var _options = $.extend({}, DEFAULTS_SPINNER, options);
    var body = _options.body;
    _options.body = '<span class="glyph-icon glyph-spin glyph-spinner"></span> '+ body;

    return dialog('popup-spinner', _options);
  }
};
