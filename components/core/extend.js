var $ = require('jquery');
var ObjProto = Object.prototype;
var hasOwnProperty = ObjProto.hasOwnProperty;
var nativeCreate = Object.create;
var Ctor = function () {};

var has = function (obj, key) {
  return obj != null && hasOwnProperty.call(obj, key);
};
// Is a given variable an object?
var isObject = function (obj) {
  var type = typeof obj;
  return type === 'function' || type === 'object' && !!obj;
};

// An internal function for creating a new object that inherits from another.
var baseCreate = function (prototype) {
  if (!isObject(prototype)) return {};
  if (nativeCreate) return nativeCreate(prototype);
  Ctor.prototype = prototype;
  var result = new Ctor;
  Ctor.prototype = null;
  return result;
};

var create = function (prototype, props) {
  var result = baseCreate(prototype);
  if (props) $.extend(result, props);
  return result;
};

// Helper function to correctly set up the prototype chain for subclasses.
// Similar to `goog.inherits`, but uses a hash of prototype properties and
// class properties to be extended.
var extend = function (protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent constructor.
  if (protoProps && has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function () {
      return parent.apply(this, arguments);
    };
  }

  // Add static properties to the constructor function, if supplied.
  $.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function and add the prototype properties.
  child.prototype = create(parent.prototype, protoProps);
  child.prototype.constructor = child;

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;

  return child;
};

module.exports = extend;
