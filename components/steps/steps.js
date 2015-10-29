require('./steps.less');
var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "steps";

var Steps = ComponentClass.extend({
  componentName: componentName,

  initialize: function ($element, options) {

  },
  destroy: function () {
    // destory related resource of base component.
    this._destroy();
  }
});

Steps.DEFAULTS = {
  size: 'default', //small
  current: 0,
  direction: '' // default is horizontal vertical
};

createPlugin(componentName, Steps);

UI.ready(function (context) {
  $('[data-steps]', context).button();
}, Steps.getInstanceName(componentName));

module.exports = Steps;
