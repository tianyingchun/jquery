require('./pagination.less');
var $ = require('jquery');
var KEYCODE = require('./KeyCode');
var template = require('../../utils/template');
var { UI, createPlugin, ComponentClass } = require('../core');
var componentName = "pagination";
var Options = require('./Options');

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
    this.rootPrefixCls = 'pagination';
    this.props = this.options;
    this.state = {
      current: options.current,
      _current: options.current,
      pageSize: options.pageSize,
    };
    $.each([
      'render',
      '_handleChange',
      '_handleKeyUp',
      '_handleKeyDown',
      '_changePageSize',
      '_isValid',
      '_prev',
      '_next',
      '_hasPrev',
      '_hasNext',
      '_jumpPrev',
      '_jumpNext',
    ], this.bind(function (index, method) {
      this[method] = this.bind(this[method]);
    }));

    this.render();

    if (options.simple) {
      // bind simple mode pagination events.
      this._bindSimplePaginationEvents();
    } else {
      // bind other events.
    }
  },
  setState: function (state) {
    $.extend(this.state, state);
  },

  renderSimpleMode: function () {
    var props = this.options;
    var prefixCls = props.prefixCls;
    var allPages = this._calcPage();

    var simpleCls = `${prefixCls} ${prefixCls}-simple`;
    var prevSimpleCls = (this._hasPrev() ? '' : `${prefixCls}-disabled `) + `${prefixCls}-prev`;
    var currentSimpleTitle = `Page ${this.state.current} of ${allPages}`;
    var currentSimpleCls = `${prefixCls}-simple-pager`;
    var simpleValue = this.state._current;
    var simpleSlashCls = `${prefixCls}-slash`;
    var simpleNextCls = (this._hasNext() ? '' : `${prefixCls}-disabled `) + `${prefixCls}-next`;
    var simplePaginationHtml = (
      '<ul class="<%= simpleCls%>">' +
      '  <li title="Previous Page" class="simple-page-prev <%= prevSimpleCls%>">' +
      '    <a></a>' +
      '  </li>' +
      '  <div title="<%=currentSimpleTitle%>" class="<%= currentSimpleCls%>">' +
      '    <input type="text" class="simple-input-page-number" value="<%=simpleValue%>"/>' +
      '    <span class="<%= simpleSlashCls%>">／</span>' +
      '    <%= allPages%>' +
      '  </div>' +
      '  <li title="Next Page" class="simple-page-next <%=simpleNextCls%>">' +
      '    <a></a>' +
      '  </li>' +
      '</ul>'
    );
    return template(simplePaginationHtml, {
      allPages: allPages,
      simpleCls: simpleCls,
      prevSimpleCls: prevSimpleCls,
      currentSimpleTitle: currentSimpleTitle,
      currentSimpleCls: currentSimpleCls,
      simpleValue: simpleValue,
      simpleSlashCls: simpleSlashCls,
      simpleNextCls: simpleNextCls
    });

  },
  // @private bind events for pagination with `simple` mode
  _bindSimplePaginationEvents: function () {
    this.$element
      .on("keydown", ".simple-input-page-number", this._handleKeyDown)
      .on("keyup", ".simple-input-page-number", this._handleKeyUp)
      .on("change", ".simple-input-page-number", this._handleKeyUp)
      .on("click", ".simple-page-prev", this._prev)
      .on("click", ".simple-page-next", this._next);

  },
  render: function () {
    var props = this.options;

    var prefixCls = props.prefixCls;
    var allPages = this._calcPage();
    var pagerList = [];
    var jumpPrev = null;
    var jumpNext = null;
    var firstPager = null;
    var lastPager = null;

    if (props.simple) {
      // render more complex feature.
      this.$element.html(this.renderSimpleMode());
    } else {
      // ...
    }
  },
  /**
   * Render each pager item
   * @param  {Object} pagerInfo pager information
   * pagerInfo: { page: 0, active: true, last: false }
   *
   * @return {String}           The html strings
   */
  renderPager: function (pagerInfo) {
    var {
      page, active, last
    } = pagerInfo;
    var title;
    var prefixCls = this.rootPrefixCls + '-item';

    var cls = `${prefixCls} ${prefixCls}-${page}`;

    if (active) {
      cls = `${cls} ${prefixCls}-active`;
    }
    if (page === 1) {
      title = 'First Page';
    } else if (last) {
      title = ('Last Page: ' + page);
    } else {
      title = ('Page ' + page);
    }
    return (
      '<li title="<%= title%>" className="<%= cls %>">' +
      '  <a>{props.page}</a>' +
      '</li>'
    );
  },
  destroy: function () {
    this._destroy();
  },
  // private methods
  _calcPage: function (p) {
    var pageSize = p;
    if (typeof pageSize === 'undefined') {
      pageSize = this.state.pageSize;
    }
    return Math.floor((this.options.total - 1) / pageSize) + 1;
  },
  _isValid: function (page) {
    return typeof page === 'number' && page >= 1 && page !== this.state.current;
  },

  _handleKeyDown: function (evt) {
    if (evt.keyCode === KEYCODE.ARROW_UP || evt.keyCode === KEYCODE.ARROW_DOWN) {
      evt.preventDefault();
    }
  },

  _handleKeyUp: function (evt) {
    var $input = $(evt.target);
    const _val = $input.val();
    let val;

    if (_val === '') {
      val = _val;
    } else if (isNaN(Number(_val))) {
      val = this.state._current;
    } else {
      val = Number(_val);
    }

    this.setState({
      _current: val,
    });

    if (evt.keyCode === KEYCODE.ENTER) {
      this._handleChange(val);
    } else if (evt.keyCode === KEYCODE.ARROW_UP) {
      this._handleChange(val - 1);
    } else if (evt.keyCode === KEYCODE.ARROW_DOWN) {
      this._handleChange(val + 1);
    }
    // always refetch dom and focus input.
    this.$element.find(".simple-input-page-number").focus();
  },

  _changePageSize: function (size) {
    if (typeof size === 'number') {
      let current = this.state.current;

      this.setState({
        pageSize: size,
      });

      if (this.state.current > this._calcPage(size)) {
        current = this._calcPage(size);
        this.setState({
          current: current,
          _current: current,
        });
      }

      this.props.onShowSizeChange(current, size);
    }
  },

  _handleChange: function (p) {
    let page = p;
    if (this._isValid(page)) {
      if (page > this._calcPage()) {
        page = this._calcPage();
      }
      this.setState({
        current: page,
        _current: page,
      });
      this.props.onChange(page);

      console.log('pagination is rendering..');
      // re rendering..
      this.render();

      return page;
    }
    return this.state.current;
  },

  _prev: function () {
    if (this._hasPrev()) {
      this._handleChange(this.state.current - 1);
    }
  },

  _next: function () {
    if (this._hasNext()) {
      this._handleChange(this.state.current + 1);
    }
  },

  _jumpPrev: function () {
    this._handleChange(Math.max(1, this.state.current - 5));
  },

  _jumpNext: function () {
    this._handleChange(Math.min(this._calcPage(), this.state.current + 5));
  },

  _hasPrev: function () {
    return this.state.current > 1;
  },

  _hasNext: function () {
    return this.state.current < this._calcPage();
  }
});


Pagination.DEFAULTS = {
  total: 0, // total record, default is 0.
  current: 1, // default is page 1
  pageSize: 10,
  prefixCls: 'pagination', // the root prefix class.
  showSizeChanger: false,
  className: '', // if is 'min' it's smallest pagination size button
  onShowSizeChange: $.noop, // pageSize property changed callback
  onChange: $.noop, // page number changed callback
  showQuickJumper: false, // The value indicates if we can quick jump to pageNumber
  simple: '' //if have value of this property, display simple pagination.
};


// Register plugin.
createPlugin(componentName, Pagination);

UI.ready(function dropdown(context) {
  var $pagination = $('[data-pagination]', context);
  // auto initialize component via data-api.
  $pagination[componentName]();

}, Pagination.getInstanceName(componentName));

module.exports = Pagination;
