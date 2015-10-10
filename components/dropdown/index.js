require('./dropdown.less');

var $ = require('jquery');
var {
  UI, Plugin, Component
} = require('../core');
var pluginName = "dropdown";
var pluginDataName = "ui.dropdown";
/**
 * The Plugin Component
 *
 * @author <tianyingchun@outlook.com>
 * @param {DOMNode} element
 * @param {Object} options
 */
var Dropdown = Component.extend({
  pluginName: pluginName,

  /** @override */
  initialize: function ($element, options) {
    var options = this.options;
    var $launcher = this.$launcher = $element.find(options.launcherSelector);
    var $launcherTarget = this.$launcherTarget = $element.find(options.launcherTargetContainerSelector).hide();

    $element.on("onSelect", function () {
      options.onSelect.apply(this, arguments);
    });

    // delegate menu item click event to menu container.
    $launcherTarget.on('click', options.menuItemSelector, function (evt) {

      var $menuItem = $(this);
      $element.triggerHandler('onSelect', {
        index: parseInt($launcherTarget.find(options.menuItemSelector).index($menuItem)) + 1,
        value: $menuItem.data("value")
      });
      $menuItem.addClass('active').siblings(options.menuItemSelector).removeClass('active');
      if (options.menuAlwaysOpen) {
        // if clicked target is current menu items?
        evt.preventDefault();
        evt.stopPropagation();
      }
    });

    $launcher
      .on('click', $.proxy(this.open, this))
      .on('mouseenter', function () {
        if (options.launchOnMouseEnter) {
          clearTimeout($launcher.data('timeoutId'));
          $launcher.trigger('click');
        }
      })
      .on('mouseleave', this.bind(function (event) {
        if (options.launchOnMouseEnter) {
          $launcher.data('timeoutId', setTimeout(this.bind(this.close), 200));
        }
      }));
    $launcherTarget
      .on('mouseenter', function () {
        clearTimeout($launcher.data('timeoutId'));
      })
      .on('mouseleave', options.menuSelector, this.bind(function () {
        if (options.launchOnMouseEnter && options.toggleLauncher) {
          $launcher.removeClass('active');
        }
        if (!options.menuAlwaysOpen || options.launchOnMouseEnter) {
          $launcher.data('timeoutId', setTimeout(this.bind(this.close), 200));
        }
      }));
  },
  open: function () {
    var self = this;
    var options = self.options;
    if (options.toggleLauncher) {
      self.$launcher.addClass('active');
    }

    // show menu container.
    self.$launcherTarget.show().position({
      my: options.my_position,
      at: options.at_position,
      of: self.$launcher
    });

    $(document).one("click", function () {
      self.close();
    });

    return false;
  },
  close: function () {
    this.$launcherTarget.hide();
    this.$launcher.removeClass('active');
  },
  destroy: function () {
    this.$launcher.off('click').off('mouseenter').off('mouseleave');
    this.$launcherTarget.off('click').off('mouseenter').off('mouseleave').off('onSelect');
    this.$element.removeData(pluginDataName);
  }
});

Dropdown.DEFAULTS = {

  launcherSelector: ".dropdown-toggle",
  launcherTargetContainerSelector: ".dropdown-content",
  menuItemSelector: "li",

  my_position: 'left top',
  at_position: 'left bottom',

  // while click toggle button, assign launcherClass to togger button.
  toggleLauncher: true,

  launchOnMouseEnter: false,

  // The value indicates if auto close menu container while click any of menu items.
  menuAlwaysOpen: false,

  onSelect: $.noop
};


// Register plugin.
Plugin(pluginName, Dropdown);

// Init code
// $(document).on('click.dropdown.data-api', '[data-dropdown]', function (e) {
//   var $dropdown = $(e.target);
//   if (!$dropdown.hasClass('dropdown')) {
//     $dropdown = $dropdown.closest('.dropdown');
//   }
//   $dropdown[pluginName]('open');
// });

UI.ready(function dropdown(context) {
  var $dropdown = $('[data-dropdown]', context);
  // auto initialize component via data-api.
  $dropdown[pluginName]();
}, pluginDataName);

module.exports = Dropdown;
