require('./tabs.less');

var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "tabs";

var Tabs = ComponentClass.extend({
  componentName: componentName,
  initialize: function ($element, options) {

    this.$tabHeaders = $element.find(options.headerItemSelector);
    var $tabContents = this.$tabContents = $element.find(options.contentItemSelector);
    this.totalItems = this.$tabHeaders.size();
    this.$tabHeaders.each(function (index, item) {
      $(item).attr('data-index', index);
      $tabContents.eq(index).attr('data-index', index);
    });

    this._paused = false;

    // binding event bahavior.
    this._bindEvents();

    this.active(options.activeIndex || 0);

    this.rotate();
  },
  rotate: function () {
    var options = this.options;
    var activeIndex = this.activeIndex + 1;
    if (activeIndex > this.totalItems - 1) {
      activeIndex = 0;
    }
    console.log(activeIndex);
    if (options.autoRotate) {
      this.timeoutid = setTimeout(this.bind(function () {
        if (!this._paused) {
          this.active(activeIndex);
        }
        this.rotate();
      }), options.rotateDelay);
    }
  },
  active: function (index) {
    var options = this.options;
    var $activeHeader = this.$tabHeaders.eq(index);
    var $activeContent = this.$tabContents.eq(index);
    this.activeIndex = index;

    $activeHeader.addClass('active').show().siblings(options.headerItemSelector).removeClass('active');
    $activeContent.addClass('active').show().siblings(options.contentItemSelector).removeClass('active').hide();
    // call active customized callback()
    options.onActive.call(this, index, $activeHeader, $activeContent);
  },

  _bindEvents: function () {

    var _this = this;
    var $element = this.$element;
    var options = this.options;

    var clearTabItemsHoverId = function ($element) {
      var _tabHoverTimeId = $element.data("tabHoverTimeId");
      if (_tabHoverTimeId) {
        clearTimeout(_tabHoverTimeId);
        $element.data("tabHoverTimeId", 0);
      }
    }

    $element
      .on('click', options.headerItemSelector, function (e) {
        var $this = $(this);
        _this.active(parseInt($this.attr('data-index')));
        e.preventDefault();
      })
      .on('mouseenter', options.headerItemSelector, function (e) {
        _this._paused = true;
        clearTimeout(_this.timeoutid);
        var $this = $(this);
        $this.addClass("hover");
        if (options.launchOnMouseEnter) {
          $element.data("tabHoverTimeId", setTimeout(function () {
            $this.trigger("click");
            clearTabItemsHoverId($element); // mouse move so fast bug.
          }, 500));
        }
        e.preventDefault();
      })
      .on('mouseleave', options.headerItemSelector, function (e) {
        var $this = $(this);
        $this.removeClass("hover");
        _this._paused = false;
        _this.rotate();

        clearTabItemsHoverId($element);
        e.preventDefault();
      });

    $element.on("mouseenter", options.contentItemSelector, function (e) {
      _this._paused = true;
      clearTimeout(_this.timeoutid);

    }).on('mouseleave', options.contentItemSelector, function (e) {
      _this._paused = false;
      _this.rotate();
    });
  },
  destroy: function () {
    this._destroy();
    this.$element.off('mouseenter').off('mouseleave').off('click');
  }
});

Tabs.DEFAULTS = {
  autoRotate: true,
  rotateDelay: 2000,
  activeIndex: 0,
  // provider callback while the tab item has been actived.
  onActive: $.noop,
  headerItemSelector: ".tabs-nav > li",
  contentItemSelector: ".tabs-bd >.tab-panel",
  launchOnMouseEnter: true
}

// Register plugin.
createPlugin(componentName, Tabs);

UI.ready(function tabs(context) {

  var $tabs = $('[data-tabs]', context);

  // auto initialize component via data-api.
  $tabs[componentName]();

}, Tabs.getInstanceName());

module.exports = Tabs;
