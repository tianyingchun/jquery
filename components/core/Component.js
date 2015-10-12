var extend = require('../../utils/extend');

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
    var _pluginDataName = this.getPluginInstanceName();

    if (!$element.data(_pluginDataName)) {
      $element.data(_pluginDataName, this);
      console.log('component `' + this.pluginName + '`initialize()....', $element, options);
      // invoke child component initialize methods.
      this.initialize($element, options);
    }
  },
  // @public
  setOptions: function (options) {
    this.options = $.extend(this.options, options);
  },
  // @public
  // bind callback to specificed context.
  bind: function (fn, context /*, additionalArguments */ ) {
    var args = [fn, context || this].concat(Array.prototype.slice.call(arguments, 2));
    return $.proxy.apply($.proxy, args);
  },
  //@override.
  initialize: function ($element, options) {
    throw new Error('the initialize() should be implemented!');
  },
  _destroy: function () {
    this.$element.data(this.getPluginInstanceName(), null);
    this.$element.data(this.pluginName, null);
  },
  //@override.
  destroy: function () {
    this._destroy();
    throw new Error('the destroy() should be implemented!');
  },
  //@public
  // get plugin data name that used to stored plugin component instance.
  getPluginInstanceName: function () {
    return 'ui.' + this.pluginName;
  }
};

Component.extend = extend;

module.exports = Component;
