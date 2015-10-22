var $ = require('jquery');
var KEYCODE = require('./KeyCode');
var Dropdown = require('../dropdown');
/**
 * @param {Objects} props
 * {
 *   changeSize: func,
 *   quickGo: func,
 *   selectOptionEnabled: false,
 *   current: number,
 *   rootPrefixCls: 'pagination'
 * }
 */
function Options($mountNode, props) {
  this.props = props;
  this.$element = $mountNode;
  this.state = {
    current: props.current,
    _current: props.current
  };
  $.each([
    'render',
    '_handleChange',
    '_changeSize',
    '_go'
  ], this.bind(function (index, method) {
    this[method] = this.bind(this[method]);
  }));
}

$.extend(Options.prototype, {
  _handleChange: function (evt) {
    var _val = evt.target.value;

    this.setState({
      _current: _val,
    });
  },
  _changeSize: function (value) {
    this.props.changeSize(Number(value));
  },
  _go: function (e) {
    const _val = e.target.value;
    if (_val === '') {
      return;
    }
    let val = Number(this.state._current);
    if (isNaN(val)) {
      val = this.state.current;
    }
    if (e.keyCode === KEYCODE.ENTER) {
      const c = this.props.quickGo(val);
      this.setState({
        _current: c,
        current: c,
      });
    }
  },
  setState: function (state) {
    $.extend(this.state, state);
    // dispacher?
    //
  },
  destroy: function () {
    this.unBindEvents();
  },
  bindEvents: function () {
    this.$element
      .on("change", "input.complex-input-page-number", this._handleChange)
      .on("keyup", "input.complex-input-page-number", this._go);
  },
  unBindEvents: function () {
    this.$element
      .off("change", "input.complex-input-page-number")
      .off("keyup", "input.complex-input-page-number");
  },
  render: function () {
    var props = this.props;
    var state = this.state;
    var prefixCls = props.rootPrefixCls + '-options';
    var changeSize = props.changeSize;
    var quickGo = props.quickGo;
    var selectOptionEnabled = props.selectOptionEnabled;

    var changeSelectHtml = '';
    var goInputHtml = '';

    if (!(changeSize || quickGo)) {
      return null;
    }

    if (changeSize && selectOptionEnabled) {

      var selectCls = prefixCls + '-select';
      var selectTriggerCls = prefixCls + '-size-changer';
      changeSelectHtml = (
        '<div class="<%= selectCls%>" data-dropdown=\'{"my_position":"lef top"}\'>' +
        '  <button class="<%= selectTriggerCls%>">10 条/页</button>' +
        '  <ul class="select-options-content">' +
        '    <li data-value="10">10 条/页</li>' +
        '    <li data-value="20">20 条/页</li>' +
        '    <li data-value="30">30 条/页</li>' +
        '    <li data-value="40">40 条/页</li>' +
        '  </ul>' +
        '</div>'
      );
      changeSelectHtml = template(changeSelectHtml, {
        selectCls: selectCls,
        selectTriggerCls: selectTriggerCls
      });
    }

    if (quickGo) {
      var jumperCls = prefixCls + '-quick-jumper';
      var current = state._current;

      goInputHtml = (
        '<div title="Quick jump to page" class="<%= jumperCls%>">' +
        '  跳至' +
        '  <input type="text" class="complex-input-page-number" value="<%= current%>" />' +
        '  页' +
        '</div>'
      );
      goInputHtml = template(goInputHtml, {
        jumperCls: jumperCls,
        current: current
      });
    }
    // render dom.
    this.$element.append($('<div class="<%= prefixCls%>">' + changeSelectHtml + goInputHtml + '</div>'));
  }
});

module.exports = Options;
