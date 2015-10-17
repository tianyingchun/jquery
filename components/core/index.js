var UI = require('./ui');
var { createPlugin, createWidget } = require('./plugin');
var { ComponentClass, WidgetClass } = require('./Component');
var position = require('./position');

module.exports = {
  UI: UI,
  position: position,

  // For atomic components.
  createPlugin: createPlugin,
  ComponentClass: ComponentClass,

  // For biz widgets.
  createWidget: createWidget,
  WidgetClass: WidgetClass
};
