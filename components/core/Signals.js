var $ = require('jquery');
// http://api.jquery.com/jQuery.Callbacks/
// cache all topics.
var topics = {};

/**
 * Provider signals (PUB-SUB) to communicate with multi modules.
 * @example
 *   - For subscribers
 *     Signals.get('mailArrived').subscribe(callback);
 *     Signals.get('mailArrived').subscribe(callback1);
 *     Signals.get('mailSent').subscribe(callback1);
 *
 *   - For publisher
 *     Signals.get('mailArrived').broadcast('hello world~');
 *     Signals.get('mailSent').broadcast('woo! mail!');
 *
 *   -Subscribe to the mailArrived notification
 *    Signals.get("mailArrived" ).subscribe( fn1 );
 *
 *    // Create a new instance of Deferreds
 *    var dfd = $.Deferred();
 *
 *    // Define a new topic (without directly publishing)
 *    var topic = Signals.get("mailArrived");
 *
 *    // When the deferred has been resolved, publish a notification to subscribers
 *    dfd.done( topic.publish );
 *
 *    dfd.resolve( "it's been published!" );
 *
 * @param  {string} id the topic name, usually it is module topicName (signalName)
 * @return {object}    the topic
 */
module.exports = {
  /**
   * Define a new topic
   * @param  {String} id the topic id
   * @return {Object}    the defined topic.
   */
  get: function (id) {
    var topic = id && topics[id];
    if (!topic) {
      var callbacks = $.Callbacks();
      topic = {
        broadcast: callbacks.fire,
        subscribe: callbacks.add,
        unsubscribe: callbacks.remove
      };
      if (id) {
        topics[id] = topic;
      }
    }
    return topic;
  }
};
