var $ = require('jquery');

// Attach UI to $.ui.
$.ui = $.ui || {};

var UI = $.ui;
var $html = $('html');
var $body = $('body');
var doc = window.document;

// Provider some fn helpers for Custom jquery components.
// -----------------------------------------------------
$.extend($.fn, {
  /**
   * Get the component instance of current dom plguin.
   * @param  {String} pluginName the current `Component`,`Widget` plugin name.
   *                             e.g. 'dropdown','popup'.
   * @return {Object}            the instance of `Component`
   */
  getInstance: function (pluginName) {
    var $this = $(this);
    if (pluginName) {
      return $this.data('__ui.' + pluginName);
    } else {
      var data = $this.data();
      var instances = [];

      if (data) {
        $.each(data, function (key, value) {
          if (key && key.indexOf('__ui.') === 0) {
            instances.push(value);
          }
        });
      }

      // maybe widget, maybe plugin.
      if (instances.length == 1) {
        return instances[0];
      } else if(instances.length > 1){
        console.warn('you have bind multi plugin behaviors must provider `<pluginName>` formatter: `ui.<pluginName>`');
        return instances;
      } else {
        return null;
      }
    }
  }
});

UI.support = {};

UI.support.transition = (function() {
  var transitionEnd = (function() {
    // https://developer.mozilla.org/en-US/docs/Web/Events/transitionend#Browser_compatibility
    var element = doc.body || doc.documentElement;
    var transEndEventNames = {
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
      transition: 'transitionend'
    };

    for (var name in transEndEventNames) {
      if (element.style[name] !== undefined) {
        return transEndEventNames[name];
      }
    }
  })();

  return transitionEnd && {end: transitionEnd};
})();

UI.support.animation = (function() {
  var animationEnd = (function() {
    var element = doc.body || doc.documentElement;
    var animEndEventNames = {
      WebkitAnimation: 'webkitAnimationEnd',
      MozAnimation: 'animationend',
      OAnimation: 'oAnimationEnd oanimationend',
      animation: 'animationend'
    };

    for (var name in animEndEventNames) {
      if (element.style[name] !== undefined) {
        return animEndEventNames[name];
      }
    }
  })();

  return animationEnd && {end: animationEnd};
})();


// Dom mutation watchers
UI.DOMWatchers = [];
UI.DOMReady = false;

function findWatcher(key) {
  var specificedWatcher = null;
  $.each(UI.DOMWatchers, function (i, watcher) {
    if (watcher.key === key) {
      specificedWatcher = watcher;
      return false;
    }
  });
  return specificedWatcher;
}
/**
 * Add dom watchers to cache list with cache key
 * @author tianyingchun
 * @date   2015-10-12
 * @param  {Function} callback the callback will be invoked while domready
 * @param  {String}   key      the cache key
 * @return {void}
 */
UI.ready = function (callback, key) {
  var existed = findWatcher(key);
  if (existed) {
    console.warn('has existed dom watcher `' + key + '` UI.ready()');
  } else {
    // cache all watchers without duplicated.
    UI.DOMWatchers.push({
      callback: callback,
      key: key
    });
  }
  if (UI.DOMReady) {
    console.log('UI Ready call');
    callback(document);
  }
};

// provider method to re run all DOMWatcher attached in domready.
UI.run = function (keys) {
  if (typeof keys === 'string') {
    keys = [keys];
  }
  if (keys && keys.length) {
    $.each(keys, function (idx, key) {
      var specificedWatcher = findWatcher(key);
      console.log('UI.run()', specificedWatcher);
      specificedWatcher && specificedWatcher.callback(document);
    });
  } else {
    // Run default init
    $.each(UI.DOMWatchers, function (i, watcher) {
      watcher.callback(document);
    });
  }
};

$(function () {

  UI.DOMReady = true;

  // Run default init
  $.each(UI.DOMWatchers, function (i, watcher) {
    watcher.callback(document);
  });

  // $html.removeClass('no-js').addClass('js');

});

module.exports = UI;
