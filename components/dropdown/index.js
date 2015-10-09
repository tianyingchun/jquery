require('./dropdown.less');

var $ = require('jquery');
var pluginName = "ui-dropdown";
var pluginClassName = ".ui-dropdown";

var Dropdown = function (element, options) {
  this.options = options = $.extend({}, Plugin.DEFAULTS, options);
  this.element = element;
  this.$element = $(element).addClass(pluginName).addClass(options.containerClass);

  // initialize.
  this._init();
};
// export public method.
$.extend(Dropdown.prototype, {
  //@private.
  _init: function () {
    var options = this.options;

    this.destroy();
    var $element = this.$element;
    var $launcher = this.$launcher = $(options.launcherSelector);
    var $launcherContainer = $(options.launcherContainerSelector);

    var $menuContainer = this.$menuContainer = $(options.menuSelector);


    // The launcher class.
    $launcher.removeClass(options.launcherClass).addClass(options.launcherClass);
    // The launcher container class.
    $launcherContainer.addClass(options.launcherContainerClass)

    // The launcher target items container class.
    $menuContainer.addClass(options.menuClass);

    $element.off("onSelect").on("onSelect", options.onSelect);

    // delegate menu item click event to menu container.
    $menuContainer.off('click', options.menuItemSelector).on('click', options.menuItemSelector, function (evt) {
      $element.triggerHandler('onSelect', {
        index: parseInt($menuContainer.find(options.menuItemSelector).index($(this))) + 1,
        value: $(this).data("value")
      });
      if (options.menuAlwaysOpen) {
        // if clicked target is current menu items?
        evt.preventDefault();
        evt.stopPropagation();
      }
    });

    $element.off('click', options.launcherSelector).on('click', options.launcherSelector, function () {

      if (options.toggleLauncher) {
        $launcher.addClass(options.launcherSelectedClass);
      }

      // show menu container.
      $menuContainer.show().position({
        my: options.my_position,
        at: options.at_position,
        of: $launcherContainer
      });

      $(document).one("click", function () {
        $menuContainer.hide();
        if (options.toggleLauncher) {
          $launcher.removeClass(options.launcherSelectedClass);
        }
      });

      return false;
    });

    $element.off('mouseenter', options.launcherSelector).on('mouseenter', options.launcherSelector, function () {
      if (options.launchOnMouseEnter) {
        $launcher.trigger('click');
      }
    });

    $element.off('mouseleave', options.menuSelector).on('mouseleave', options.menuSelector, function () {
      if (!options.menuAlwaysOpen) {
        $menuContainer.hide();
      }
    });
  },
  destroy: function () {
    this.$element.removeData(pluginName);
  }
});

function Plugin(options, data) {
  var args = Array.prototype.slice.call(arguments, 1);
  return this.each(function () {
    var $this = $(this);
    if (typeof options == "string") {
      var dropdown = $this.data(pluginName);
      dropdown[options].apply(dropdown, args);
      // INIT with optional options
    } else if (!$this.is(pluginClassName)) {
      // store dropdown plugin name to current dom node.
      $this.data(pluginName, new Dropdown(this, options));
    }
  });
}

Plugin.DEFAULTS = {
  containerClass: "containerClass",
  launcherContainerClass: 'ui-launcher-container',
  launcherClass: 'launcherClass',
  launcherSelectedClass: 'launcher-selected ui-widget-header ui-corner-all',
  menuClass: 'ui-menu-container',

  launcherSelector: "#launcher",
  launcherContainerSelector: "#launcher-container",

  menuSelector: "#menu",
  menuItemSelector: "li",

  my_position: 'left top',
  at_position: 'left bottom',

  // while click toggle button, assign launcherClass to togger button.
  toggleLauncher: false,
  launchOnMouseEnter: false,
  // The value indicates if auto close menu container while click any of menu items.
  menuAlwaysOpen: false,
  onSelect: function () {}
};

// Expose plugin to $.fn.prototype.
$.fn.extend({
  dropdown: Plugin
});

module.exports = {
  run: function (options, element) {
    $(element).dropdown(options);
  }
};
