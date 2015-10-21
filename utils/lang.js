var jQuery = require('jquery');
var ObjProto = Object.prototype;
var toString = ObjProto.toString;
var hasOwnProperty = ObjProto.hasOwnProperty;
var nativeIsArray = Array.isArray;
var nativeCreate = Object.create;

// extract some undercore utilities here.
var _ = {
  isArray: nativeIsArray || function (obj) {
    return toString.call(obj) === '[object Array]';
  },
  isUndefined: function (obj) {
    return obj === void 0;
  },
  now: Date.now || function () {
    return new Date().getTime();
  },
  isObject: function (obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  }
};

// Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
jQuery.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function (idx, name) {
  _['is' + name] = function (obj) {
    return toString.call(obj) === '[object ' + name + ']';
  };
});

jQuery.extend(_, {

  // simple check property has existed.
  has: function (obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  },

  trim: function (s) {
    return s ? s.replace(/^\s+|\s+$/g, "") : "";
  },

  // empty function.
  noop: function noop() {},

  /**
   * string formatter, _.stringFormat('my name is {0}{1}', 'yingchun', 'tian')
   * @param  {...[string]} args
   * @return {String}      the formatted string.
   */
  stringFormat: function () {

    var args = Array.prototype.slice.call(arguments, 0);
    // use this string as the format,Note {x},x start from 0,1,2
    // walk through each argument passed in
    var fmt = args[0];

    for (var ndx = 1; ndx < args.length; ++ndx) {
      // replace {1} with argument[1], {2} with argument[2], etc.
      var argVal = _.isObject(args[ndx]) ? JSON.stringify(args[ndx]) : args[ndx];
      fmt = fmt.replace(new RegExp('\\{' + (ndx - 1) + '\\}', "g"), argVal);
    }
    // return the formatted string
    return fmt;
  }

});

module.exports = _;
