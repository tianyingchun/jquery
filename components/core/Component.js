var extend = require('./extend');

/**
 * Design jquery component plugin system.
 * @author tianyingchun
 * @date {{date }}
 * @this {Component}
 * @param {DOMNode|String} element the dom selector or dom object or jquery object
 * @param {Object} options the plugin configuration.
 */
function Component(element, options) {
  this.$element = $(element).addClass(this.pluginName);
  this.options = $.extend({}, this.constructor.DEFAULTS, options);
  this._initialize.call(this, this.$element, this.options);
}

Component.prototype = {
  constructor: Component,

  //@private
  _initialize: function ($element, options) {
    if (!this.pluginName) {
      throw Error('you must provider `pluginName` property for your Component!');
    }
    var _pluginDataName = this.getPluginDataName();
    if ($element.data(_pluginDataName)) {
      return;
    } else {
      $element.data(_pluginDataName, this);
    }
    console.log('component `' + this.pluginName + '`initialize()....', $element, options);

    // invoke child component initialize methods.
    this.initialize($element, options);
  },
  // @public
  setOptions: function (options) {
    this.options = $.extend(this.options, options);
  },
  //@override.
  initialize: function ($element, options) {
    throw new Error('the initialize() should be implemented!');
  },
  //@override.
  destroy: function () {
    throw new Error('the destroy() should be implemented!');
  },
  //@public
  // get plugin
  getPluginDataName: function () {
    return 'ui.' + this.pluginName;
  }
};

Component.extend = extend;

module.exports = Component;
