var $ = require("jquery");
var template = require("../../utils/template");
var {
  UI, createPlugin, ComponentClass
} = require('../core');
var Popup = require("./popup");

var componentName = 'alert';
var alertTpl =
  '<div class="popup popup-alert <%=classes%>">' +
  ' <div class="popup-dialog">' +
  '   <% if(header) { %>  ' +
  '     <div class="popup-hd">' +
  '     <%=header.html %>' +
  '     <% if(header.showClose) { %>  ' +
  '       <span class="close"><i></i>X</span>' +
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

var Alert = ComponentClass.extend({
  componentName: componentName,

  initialize: function () {
    this.$element = $(template(alertTpl, this.options));
    this.$popup = new Popup(this.$element, this.getPopupOptions());
    this._bindEvents();
  },

  destroy: function () {
    this._destroy();
    this._unbindEvents();
    this.$popup = null;
    this.$element.remove();
  },

  getPopupOptions: function () {
    var o = this.options;
    var popupOpts = {
      onOpen: this.bind(function () {
        this._triggerCall(o.onOpen)
      }),
      onClose: this.bind(function () {
        this._triggerCall(o.onClose);
        this.destroy();
      }),
      modal: o.modal,
      modalClose: o.modalClose,
      autoClose: o.autoClose,
      scrollBar: false
    };
    return popupOpts;
  },

  show: function () {
    if (this.$popup) {
      this.$popup.show();
    }
  },
  close: function () {
    if (this.$popup) {
      this.$popup.close();
      this.destroy();
    }
  },

  _triggerCall: function (func, arg) {
    $.isFunction(func) && func.call(this.$popup, arg);
  },

  _bindEvents: function () {
    var options = this.options;
    var triggerCall = this.bind(this._triggerCall);
    this.$element.on('click', '[data-trigger]', function (e) {
      triggerCall(options.onActionClicked, $(this));
    });
  },

  _unbindEvents: function () {
    this.$element.off('click');
  }
});

Alert.DEFAULTS = {
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

function alert(options) {
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

  var o = $.extend({}, DEFAULTS, options);

  var $element = $(template(alertTpl, o));

  // the options of popup.
  var popupOptions = {
    onOpen: function () {
      triggerCall(o.onOpen);
      bindEvent(this);
    },
    onClose: function () {
      triggerCall(o.onClose);
      unbindEvents(this);
    },
    modal: o.modal,
    modalClose: o.modalClose,
    autoClose: o.autoClose,
    scrollBar: false
  };

  var popupInstance = new Popup($element, popupOptions).show();

  function triggerCall(func, arg) {
    $.isFunction(func) && func.call(popupInstance, arg);
  };

  function bindEvent(popup) {
    popup.$element.on('click', '[data-trigger]', function (e) {
      triggerCall(o.onActionClicked, $(this));
    });
  }

  function unbindEvents(popup) {
    popup.$element.off('click');
  }

}

module.exports = function (options) {
  // show popup and return instance.
  alert(options);
};
