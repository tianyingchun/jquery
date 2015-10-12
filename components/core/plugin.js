var $ = require('jquery');
var UI = require('./ui');

var PLUGINS = UI.plugins = UI.plugins || {};
var WIDGETS = UI.widgets = UI.widgets|| {};

function baseToString (value) {
  return value == null ? '' : (value + '');
}

function capitalize (str) {
  str = baseToString(str);
  return str && (str.charAt(0).toUpperCase() + str.slice(1));
}
/**
 * Plugin Component Pattern for jQuery
 *
 * @param {String} type - component type: widget|plugin
 * @param {String} name - plugin name
 * @param {Function} Component - plugin constructor
 * @param {Object} [pluginOption]
 * @param {String} pluginOption.dataOptionName default is 'pluginName' in dom should be 'data-pluginName'
 * @param {Function} pluginOption.methodCall(args, instance) - custom method call
 * @param {Function} pluginOption.before(args, instance)
 * @param {Function} pluginOption.after(args, instance)
 */
function UIComponent(type, name, Component, pluginOption) {

  pluginOption = pluginOption || {};

  var old = $.fn[name];
  if (old) {
    console.warn('The `' + type + '` name `' + name + '` has been taken!');
  }

  $.fn[name] = function (option) {
    var allArgs = Array.prototype.slice.call(arguments, 0);
    var args = allArgs.slice(1);

    // get plugin data name that used to stored plugin component instance.
    var componentInstanceName = (type === 'widget' ? 'ui.widget.' : 'ui.') + name;

    // default data store via data-pluginName='{"":""}'
    var dataOptionName = pluginOption.dataOptionName || name;
    var propReturn;
    var $set = this.each(function () {

      var $this = $(this);
      var instance = $this.data(componentInstanceName);

      // <div data-pluginName='{"name":"value"}'></div>
      var attrDataOption = $this.data(dataOptionName);
      var options = $.extend({}, typeof attrDataOption === 'object' && attrDataOption, typeof option === 'object' && option);
      if (!instance && option === 'destroy') return;

      if (!instance) {
        // Component plugin API: constructor(element, options);
        $this.data(componentInstanceName, (instance = new Component(this, options)));
      }

      // custom method call while instance has been ready.
      if (pluginOption.methodCall) {
        pluginOption.methodCall.call($this, allArgs, instance);
      } else {
        // before method call
        pluginOption.before && pluginOption.before.call($this, allArgs, instance);

        if (typeof option === 'string') {
          propReturn = typeof instance[option] === 'function' ? instance[option].apply(instance, args) : instance[option];
        }

        // after method call
        pluginOption.after && pluginOption.after.call($this, allArgs, instance);
      }
    });

    return (propReturn === undefined) ? $set : propReturn;
  };

  // expose component to plguin `Constructor`
  $.fn[name].Constructor = Component;

  // no conflict
  $.fn[name].noConflict = function () {
    $.fn[name] = old;
    return this;
  };

  // assign plugin name to Component.name
  Component.displayName = capitalize(name);

  if (type === 'plugin') {
    PLUGINS[name] = Component;
  } else {
    WIDGETS[name] = Component;
  }

};

module.exports = {
  createPlugin: function plugin(name, Component, pluginOption) {
    return UIComponent('plugin', name, Component, pluginOption);
  },
  createWidget: function widget(name, Component, pluginOption) {
    return UIComponent('widget', name, Component, pluginOption);
  }
};
