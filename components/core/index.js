var UI = require('./ui');
var { createPlugin, createWidget } = require('./plugin');
var { ComponentClass, WidgetClass } = require('./Component');
var position = require('./position');

module.exports = {
  position: position,
  UI: UI,
  createPlugin: createPlugin,
  createWidget: createWidget,
  WidgetClass: WidgetClass,
  ComponentClass: ComponentClass,
};
