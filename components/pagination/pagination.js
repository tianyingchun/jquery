require('./pagination.less');

var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "pagination";

/**
 * The Plugin Component
 *
 * @author <tianyingchun@outlook.com>
 * @param {DOMNode} element
 * @param {Object} options
 */
var Pagination = ComponentClass.extend({
  componentName: componentName,

  initialize: function ($element, options) {

  },
  destroy: function () {
    this._destroy();
  }
});


Pagination.DEFAULTS = {

};


// Register plugin.
createPlugin(componentName, Pagination);

UI.ready(function dropdown(context) {
  var $pagination = $('[data-pagination]', context);
  // auto initialize component via data-api.
  $pagination[componentName]();

}, Pagination.getInstanceName(componentName));

module.exports = Pagination;
