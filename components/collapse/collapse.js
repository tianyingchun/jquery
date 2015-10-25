require('./collapse.less');
var $ = require('jquery');
//https://github.com/danielstocks/jQuery-Collapse
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "collapse";
var CollapseStorage = require('./collapseStorage');

// Section constructor
function Section($el, parent) {

  if (!parent.options.clickQuery) $el.wrapInner('<a href="#"/>');

  $.extend(this, {
    isOpen: false,
    $summary: $el.attr("data-collapse-summary", ""),
    $details: $el.next(),
    options: parent.options,
    parent: parent
  });
  parent.sections.push(this);

  // Check current state of section
  var state = parent.states[this._index()];

  if (state === 0) {
    this.close(true);
  } else if (this.$summary.is(".open") || state === 1) {
    this.open(true);
  } else {
    this.close(true);
  }
}

Section.prototype = {
  toggle: function () {
    this.isOpen ? this.close() : this.open();
  },
  close: function (bypass) {
    this._changeState("close", bypass);
  },
  open: function (bypass) {
    var _this = this;
    if (_this.options.accordion && !bypass) {
      $.each(_this.parent.sections, function (i, section) {
        section.close();
      });
    }
    _this._changeState("open", bypass);
  },
  _index: function () {
    return $.inArray(this, this.parent.sections);
  },
  _changeState: function (state, bypass) {

    var _this = this;
    _this.isOpen = state == "open";
    if ($.isFunction(_this.options[state]) && !bypass) {
      _this.options[state].apply(_this.$details);
    } else {
      _this.$details[_this.isOpen ? "show" : "hide"]();
    }

    _this.$summary.toggleClass("open", state !== "close");
    _this.$details.attr("aria-hidden", state === "close");
    _this.$summary.attr("aria-expanded", state === "open");
    _this.$summary.trigger(state === "open" ? "opened" : "closed", _this);
    if (_this.parent.db) {
      _this.parent.db.write(_this._index(), _this.isOpen);
    }
  }
};


var Collapse = ComponentClass.extend({
  componentName: componentName,
  initialize: function ($element, options) {
    var _this = this;
    $.extend(_this, {
      $el: $element,
      sections: [],
      isAccordion: options.accordion || false,
      db: options.persist ? CollapseStorage($element.get(0).id) : false
    });
    // Figure out what sections are open if storage is used
    _this.states = _this.db ? _this.db.read() : [];

    // For every pair of elements in given
    // element, create a section
    $element.find(options.query).each(function () {
      new Section($(this), _this);
    });

    this._bindEvents();
  },
  handleClick: function (e, state) {
    e.preventDefault();
    state = state || "toggle";
    var sections = this.sections,
      l = sections.length;
    while (l--) {
      if ($.contains(sections[l].$summary[0], e.target)) {
        sections[l][state]();
        break;
      }
    }
  },
  handleEvent: function (e) {
    if (e.target == this.$el.get(0)) return this[e.type]();
    this.handleClick(e, e.type);
  },
  open: function (eq) {
    this._change("open", eq);
  },
  close: function (eq) {
    this._change("close", eq);
  },
  toggle: function (eq) {
    this._change("toggle", eq);
  },
  _bindEvents: function () {
    // Capute ALL the clicks!
    // this.$el.on("click", "[data-collapse-summary] " + (this.options.clickQuery || ""), this.bind(this.handleEvent));

    // this.$el.bind("toggle close open", this.bind(this.handleEvent));
    var _this = this;
    // Capute ALL the clicks!
      _this.$el.on("click", "[data-collapse-summary] " + (_this.options.clickQuery || ""),
        $.proxy(_this.handleClick, _this));

      _this.$el.bind("toggle close open",
        $.proxy(_this.handleEvent, _this));

  },
  _unBindEvents: function () {
    this.$el.off("click");
    this.$el.unbind("toggle close open");
  },
  _change: function (action, eq) {
    if (isFinite(eq)) return this.sections[eq][action]();
    $.each(this.sections, function (i, section) {
      section[action]();
    });
  },
  destroy: function () {
    this._destroy();
    this._unBindEvents();
  }
});

Collapse.DEFAULTS = {

  query: "> :even",

  // Enable accordion behaviour by setting this option to 'true'
  accordion: false,

  //Enable persistence between page loads by setting this option to 'true'
  persist: false,

  clickQuery: '',

  // Custom function for opening section (default: function(){ this.show() })
  open: false,

  // Custom function for collapsing section (default: function(){ this.hide() })
  close: false, // function () { this == $details}
}

createPlugin(componentName, Collapse);


UI.ready(function (context) {
  $('[data-collapse]', context).collapse();
}, Collapse.getInstanceName(componentName));


module.exports = Collapse;
