var $ = require('jquery');

// Attach UI to $.ui.
$.ui = $.ui || {};

var UI = $.ui;
var $html = $('html');
var $body = $('body');

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
UI.run = function (key) {
  if (key) {
    var specificedWatcher = findWatcher(key);
    console.log('UI.run()', specificedWatcher);
    specificedWatcher && specificedWatcher.callback(document);
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

  $html.removeClass('no-js').addClass('js');

});

module.exports = UI;