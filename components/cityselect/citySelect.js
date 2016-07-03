var $ = require('jquery');
var { UI, createPlugin, ComponentClass } = require('../core');
var { iosProvinces, iosCites, iosCountries } = require('./data');

var componentName = "citySelect";

var CitySelect = ComponentClass.extend({
  componentName: componentName,

  initialize: function ($element, options) {
    this.$province = $element.find(options.province.selector);
    this.$city = $element.find(options.city.selector);
    this.$country = $element.find(options.country.selector);

    console.log('city select ....');

  },
  setProvinceData: function (data) {
    if (data) {
      ths._setData('province', data);
    } else {
      throw new Error('the data is must be an object!');
    }
  },
  setCityData: function (data) {
    if (data) {
      ths._setData('city', data);
    } else {
      throw new Error('the data is must be an object!');
    }
  },
  setCountryData: function (data) {
    if (data) {
      ths._setData('country', data);
    } else {
      throw new Error('the data is must be an object!');
    }
  },
  _setData: function (type, data) {
    switch (type) {
      case 'province':
        this._renderProvince(data);
        this._resetCity();
        this.$country.css('visibility', true);
        break;
      case 'city':
        this._renderCity(data);
        this._resetCountry();
        break;
      case 'country':
        this._renderCountry(data);
        break;
    }
  },
  destroy: function () {
    // destory related resource of base component.
    this._destroy();
  }
});

CitySelect.DEFAULTS = {
  province: {
    selector: '.drp_province',
    value: '',
    text: '',
    // if == empty, default 显示 '请选择'
    defaultValue: ''
  },
  city: {
    selector: '.drp_city',
    value: '',
    text: '',
    defaultValue: ''
  },
  country: {
    selector: '.drp_country',
    value: '',
    text: '',
    defaultValue: ''
  },
  onSelectInitialized: $.noop
};

createPlugin(componentName, CitySelect);

UI.ready(function (context) {
  $('[data-cityselect]', context).citySelect();
}, CitySelect.getInstanceName(componentName));


module.exports = CitySelect;
