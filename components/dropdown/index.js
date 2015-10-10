require('./dropdown.less');

var $ = require('jquery');
var { UI, Plugin } = require('../core');

var pluginName = "dropdown";
var pluginDataName = "ui.dropdown";
/**
 * The Plugin Component
 * @param {DOMNode} element
 * @param {Object} options
 */
var Dropdown = function (element, options) {
  this.options = $.extend({}, Dropdown.DEFAULTS, options);
  this.$element = $(element).addClass(pluginName);;
  // initialize.
  this._init();
};

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

  onSelect: function () {}
};

// export public method.
$.extend(Dropdown.prototype, {
  //@private.
  _init: function () {
    console.log('initial....');

    var options = this.options;
    var $element = this.$element;

    if ($element.data(pluginDataName)) {
      return;
    }

    var $launcher = this.$launcher = $element.find(options.launcherSelector);
    var $launcherTarget = this.$launcherTarget = $element.find(options.launcherTargetContainerSelector).hide();

    $element.off("onSelect").on("onSelect", options.onSelect);

    // delegate menu item click event to menu container.
    $launcherTarget.on('click', options.menuItemSelector, function (evt) {
      $element.triggerHandler('onSelect', {
        index: parseInt($launcherTarget.find(options.menuItemSelector).index($(this))) + 1,
        value: $(this).data("value")
      });
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
          $launcher.trigger('click');
        }
      });
    $element.on('mouseleave', options.menuSelector, function () {
      if (options.toggleLauncher) {
        $launcher.removeClass('active');
      }
      if (!options.menuAlwaysOpen) {
        $launcherTarget.hide();
      }
    });
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
      self.$launcherTarget.hide();
      if (options.toggleLauncher) {
        self.$launcher.removeClass('active');
      }
    });

    return false;
  },
  close: function () {

  },
  destroy: function () {
    this.$element.removeData(pluginDataName);
  }
});

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
