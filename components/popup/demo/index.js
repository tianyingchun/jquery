var tpl = '';
function PopupDemo(renderToDOMNode) {
  var $renderTo = renderToDOMNode ? $(renderToDOMNode) : $("#right-main");
  $renderTo.html(tpl);
}

module.exports = {
  render: function (mountNode) {
    PopupDemo(mountNode);
  }
};
