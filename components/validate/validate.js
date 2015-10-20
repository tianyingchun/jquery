var $ = require('jquery');
var {
  UI, createPlugin, ComponentClass
} = require('../core');
var componentName = "validate";


var Validate = ComponentClass.extend({
  componentName: componentName,

  initialize: function ($element, options) {

  },

  destroy: function () {
    // destroy() base component.
    this._destroy();
  }

});

Validate.DEFAULTS = {

};

// Registerd plugin.
createPlugin(componentName, Validate);

// DOMReady.
UI.ready(function Validate(context) {
  var $validate = $('[data-validate]', context);

  // auto initialize component via data-api.
  $validate[componentName]();

}, Validate.getInstanceName(componentName));

module.exports = Validate;

