var extend = require('../../utils/extend');

/**
 * Design jquery component plugin system.
 * The Plugin should be as an individual common web component hehaviors.
 * @author tianyingchun
 * @this {Component}
 * @param {DOMNode|String} element the dom selector or dom object or jquery object
 * @param {Object} options the plugin configuration.
 */
function Component(element, options) {
  this.$element = $(element).addClass(this.getComponentBasicClassNames());
  this.options = $.extend({}, this.constructor.DEFAULTS, options);
  // internal initialize component.
  this._initialize.call(this, this.$element, this.options);
}

Component.prototype = {
  constructor: Component,

  //@private
  _initialize: function ($element, options) {
    if (!this.componentName) {
      throw Error('you must provider `componentName` property for your Component!');
    }
    var _pluginDataName = this.getPluginInstanceName();

    if (!$element.data(_pluginDataName)) {
      $element.data(_pluginDataName, this);
      console.log('component `' + this.componentName + '`initialize()....', $element, options);
      // invoke child component initialize methods.
      this.initialize($element, options);
    }
  },
  //@override.
  initialize: function ($element, options) {
    throw new Error('the initialize() should be implemented!');
  },
  _destroy: function () {
    this.$element.data(this.getPluginInstanceName(), null);
    this.$element.data(this.componentName, null);
  },
  //@override.
  destroy: function () {
    this._destroy();
    throw new Error('the destroy() should be implemented!');
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
  //@public
  // get plugin data name that used to stored plugin component instance.
  getPluginInstanceName: function () {
    return this.constructor.getPluginInstanceName(this.componentName);
  },
  getComponentBasicClassNames: function () {
    return this.componentName +' plugin-' + this.componentName;
  }
};

Component.extend = extend;
// static methods.
Component.getPluginInstanceName = function (componentName) {
  if (componentName) {
    return 'ui.' + componentName;
  } else {
    console.error('the missed `compnentName` is required!');
  }
};

/**
 * The widget should be as an site module can be composed from multiple components.
 * @this Widget
 *
 */
var Widget = Component.extend({
  getComponentBasicClassNames: function () {
    return this.componentName + ' widget-' + this.componentName;
  }
});

// static methods.
Widget.getPluginInstanceName = function (componentName) {
  if (componentName) {
    return 'ui.widget.' + componentName;
  } else {
    console.error('the missed `compnentName` is required!');
  }
};


module.exports = {
  ComponentClass:Component,
  WidgetClass: Widget
};
