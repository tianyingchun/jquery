require('./lazyload.less');

var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "lazyload";

/**
 * The Plugin Component
 *
 * @author <tianyingchun@outlook.com>
 * @param {DOMNode} element
 * @param {Object} options
 */
var Lazyload = ComponentClass.extend({
  componentName: componentName,

  /** @override */
  initialize: function ($element, options) {

  },

  destroy: function () {
    // destory related resource of base component.
    this._destroy();
  }
});

Lazyload.DEFAULTS = {
  threshold       : 0,
  failure_limit   : 0,
  event           : "scroll",
  effect          : "show",
  container       : window,
  data_attribute  : "original",
  skip_invisible  : false,
  appear          : null,
  load            : null,
  placeholder     : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC"
};


// Register plugin.
createPlugin(componentName, Lazyload);

UI.ready(function dropdown(context) {
  var $lazyload = $('[data-lazyload]', context);
  // auto initialize component via data-api.
  $lazyload[componentName]();
}, Lazyload.getInstanceName());

module.exports = Lazyload;
