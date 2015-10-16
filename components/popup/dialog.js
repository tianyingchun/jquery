var $ = require("jquery");
var template = require("../../utils/template");
var { UI, createPlugin, ComponentClass } = require('../core');
var Popup = require("./popup");

var componentName = 'alert';

var alertTpl =
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
  '         <%=body %>' +
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
  classes: "",
  // if equals false, don't show header.
  header: {
    showClose: true,
    html: "Your Header"
  },
  body: "Your dialog body",
  // if equals false, don't show footer.
  footer: {
    html: '<button class="popup-btn" data-trigger="ok">确定</button>'
  }
};

var DEFAULTS_CONFIRM = {
  footer: {
    html: '<span class="popup-btn" data-trigger="cancel">取消</span><span class="popup-btn" data-trigger="confirm">确定</span>'
  },
  onActionClicked: function ($target) {
    if ($target.data('trigger') === "confirm") {
      triggerCall.call(this, this.options.onConfirm, $target);
    } else {
      triggerCall.call(this, this.options.onCancel, $target);
    }
  }
};

function triggerCall(func, arg) {
  $.isFunction(func) && func.call(this, arg);
};

function dialog(type, options) {

  var o = $.extend({type: type}, DEFAULTS, options);

  var $element = $(type);
  if (!$element.size()) {
    $element = $(template(alertTpl, o)).appendTo($("body"));
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
    // for confirm dialog box.
    onConfirm: o.onConfirm,
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
    dialog('popup-alert', options);
  },
  confirm: function (options) {
    // show confirm popup and return instance.
    dialog('popup-confirm', $.extend({}, DEFAULTS_CONFIRM, options));
  }
};
