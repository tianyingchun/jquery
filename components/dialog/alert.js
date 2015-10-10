var $ = require("jquery");
var template = require("../../utils/template");
var popup = require("./popup");

var dialogTpl =
  '<div id="ui-popup" class="ui-popup <%=dialogClass%>">' +
  ' <div class="ui-popup-dialog">' +
  '   <% if(header) { %>  ' +
  '     <div class="ui-popup-hd">' +
  '     <%=header.html %>' +
  '     <% if(header.showClose) { %>  ' +
  '       <span class="ui-close"><i></i>X</span>' +
  '     <% }%>  ' +
  '   </div>' +
  '   <% }%>  ' +
  '     <div class="ui-popup-bd">' +
  '         <%=body %>' +
  '     </div>' +
  '   <% if(footer) { %>  ' +
  '     <div class="ui-popup-footer">' +
  '         <%:= footer.html%>' +
  '     </div>' +
  '   <% } %> ' +
  ' </div>' +
  '</div>';

var template = template(dialogTpl);

//
// Normally we should not need to pass popupElm, except your speical requirement.
function Alert(popupElm, options) {
  if (arguments.length == 1) {
    options = popupElm;
    popupElm = null;
  }
  var o = $.extend({}, Alert.DEFAULTS, options);
  var $popup = popupElm && $(popupElm) || null;
  // maybe sometimes we need  to customized dialog popup element.
  if (!$popup || !$popup.size()) {
    var $body = $("body");
    var $popup = $body.find("#ui-popup");

    if (!$popup.size()) {
      $popup = $(template(o)).appendTo($body);
    }
  }

  function triggerCall(func, arg) {
    $.isFunction(func) && func.call($popup, arg);
  };
  var popupOpts = {
    onOpen: o.onOpen,
    onClose: function () {
      // unbind some events.
      this.off("click");
      triggerCall(o.onClose);
    },
    modalClose: o.modalClose,
    scrollBar: false
  };
  // show popup. and delegate click event for all child element with class '.trigger'
  return $popup.popup(popupOpts).on("click", "[data-trigger]", function () {
    // capture all .trigger click events.
    triggerCall(o.onBtnClicked, $(this).data("trigger"));
  });
};
Alert.DEFAULTS = {
  onOpen: false,
  onClose: false,
  onBtnClicked: false,
  autoClose: false,
  modalClose: false,
  dialogClass: "dialog-alert",
  // if equals false, don't show header.
  header: {
    showClose: true,
    html: "Your sHeader"
  },
  body: "Your dialog body",
  // if equals false, don't show footer.
  footer: {
    html: '<button class="ui-popup-btn" data-trigger="ok">确定</button>'
  }
};

module.exports = Alert;
