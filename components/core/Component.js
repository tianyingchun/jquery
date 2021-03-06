var extend = require('../../utils/extend');
var signals = require('../../utils/signals');
/**
 * Design jquery component plugin system.
 * The Plugin should be as an individual common web component hehaviors.
 * @author tianyingchun
 * @this {Component}
 * @param {DOMNode|String} element the dom selector or dom object or jquery object
 * @param {Object} options the plugin configuration.
 */
function Component (element, options) {
  if (!element) {
    throw Error('you must provider `element` parameter for Component `' + this.componentName + '`!');
  }
  this.options = $.extend({}, this.constructor.DEFAULTS, options);
  this.$element = $(element).addClass(this.getComponentClassNames());
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
    var _pluginDataName = this._getInternalInstanceName();

    // allow us directly new Componnet($element, options) instead using
    if (!$element.data(_pluginDataName)) {
      $element.data(_pluginDataName, this);
      console.debug('component `' + this.componentName + '`initialize()....', $element, options);
      // invoke child component initialize methods.
      this.initialize($element, options);
    }
  },
  //@override.
  initialize: function ($element, options) {
    throw new Error('the initialize() should be implemented!');
  },
  _destroy: function (clearAll) {
    this.$element.data(this._getInternalInstanceName(), null);
    if (clearAll === true) {
      // cause of we store data api configuration in dom Node, if we force destroy data('componentName')
      // we can't restore the initialized config data if we want to re instance this plugin.
      this.$element.data(this.componentName, null);
    }
  },
  //@override.
  destroy: function (clearAll) {
    this._destroy(clearAll);
    throw new Error('the destroy() should be implemented!');
  },
  // @public
  setOptions: function (options) {
    this.options = $.extend(this.options, options);
    return this;
  },
  //@public
  getOption: function (key) {
    return (this.options || {})[key];
  },
  // @public
  // bind callback to specificed context.
  bind: function (fn, context /*, additionalArguments */ ) {
    var args = [fn, context || this].concat(Array.prototype.slice.call(arguments, 2));
    return $.proxy.apply($.proxy, args);
  },

  // @private e.g. __ui.dropdown, __ui.widget.header. .....
  _getInternalInstanceName: function () {
    return '__' + this.getInstanceName();
  },
  // @public
  // get plugin data name that used to stored plugin component instance.
  getInstanceName: function () {
    return this.constructor.getInstanceName(this.componentName);
  },

  // @public
  // get component basic classnames used to flat the component name, component type(plugin, widget).
  getComponentClassNames: function () {
    return this.componentName +' plugin-' + this.componentName;
  }
};

// static method: provider extend method to Component
Component.extend = extend;

// static method: get the `name` that used to cache component instance to dom.data('name')
Component.getInstanceName = function (componentName) {
  componentName = componentName || this.prototype.componentName;
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
  getComponentClassNames: function () {
    return this.componentName + ' widget-' + this.componentName;
  },
  /**
   * Broadcast message to other modules.
   * @param  {object} message the message requrired : {type:'eventName', data: {}};
   */
  broadcast: function (message) {
    var topicName = this.getInstanceName();
    console.debug('[broadcast]: topicName: `%s`, message: ', topicName, message);
    signals.get(topicName).broadcast(message);
  }
});

// static methods.
Widget.getInstanceName = function (componentName) {
  componentName = componentName || this.prototype.componentName;
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
