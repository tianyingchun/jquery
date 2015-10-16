var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "button";

var Button = ComponentClass.extend({
  componentName: componentName,

  initialize: function ($element, options) {
    this.isLoading = false;
    this.hasSpinner = false;
  },
  setState: function (state, stateText) {
    var $element = this.$element;
    var disabled = 'disabled';
    var data = $element.data();
    var options = this.options;
    var val = $element.is('input') ? 'val' : 'html';
    var stateClassName = 'btn-' + state + ' ' + options.disabledClassName;

    state += 'Text';

    if (!options.resetText) {
      options.resetText = $element[val]();
    }

    stateText = stateText ||
      (data[state] === undefined ? options[state] : data[state]);

    $element[val](stateText);

    // push to event loop to allow forms to submit
    setTimeout(this.bind(function () {
      // TODO: add stateClass for other states
      if (state === 'loadingText') {
        $element.addClass(stateClassName).attr(disabled, disabled);
        this.isLoading = true;
      } else if (this.isLoading) {
        $element.removeClass(stateClassName).removeAttr(disabled);
        this.isLoading = false;
      }
    }), 0);
  },
  toggle: function () {
    var changed = true;
    var $element = this.$element;
    var $parent = $element.parent('[class*="btn-group"]');
    if ($parent.length) {
      var $input = $element.find('input');

      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && $element.hasClass('active')) {
          changed = false;
        } else {
          $parent.find('.active').removeClass('active');
        }
      }

      if (changed) {
        $input.prop('checked', !$element.hasClass('active')).trigger('change');
      }
    }

    if (changed) {
      $element.toggleClass('active');
      if (!$element.hasClass('active')) {
        $element.blur();
      }
    }
  },
  destroy: function () {
    // destory related resource of base component.
    this._destroy();
  }
});

Button.DEFAULTS = {
  loadingText: 'loading...',
  resetText: '',
  disabledClassName: 'disabled',
  spinner: undefined
};

createPlugin(componentName, Button, {
  methodCall: function (args, instance) {
    if (args[0] === 'toggle') {
      instance.toggle();
    } else if (typeof args[0] === 'string') {
      instance.setState.apply(instance, args);
    }
  }
});

// Init code
$(document).on('click.button.data-api', '[data-button]', function (e) {
  e.preventDefault();
  var $btn = $(e.target);

  if (!$btn.hasClass('btn')) {
    $btn = $btn.closest('.btn');
  }

  $btn.button('toggle');
});

UI.ready(function (context) {
  $('[data-button]', context).button();
}, ComponentClass.getPluginInstanceName(componentName));


module.exports = Button;
