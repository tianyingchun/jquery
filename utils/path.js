var jQuery = require('jquery');
var url = require('wurl');
var lang = require('./lang');
var path = {
  /**
   * Normallize url path, note only can handler url path e.g. /workspace/list
   * Dont handle protocol port (http://)
   * @param  {...paths} paths provider path serialized paramter.
   * @return {String}
   */
  normalizePath: function () {
    var result = [];

    jQuery.each(arguments, function (index, path) {
      result.push(path ? path.replace(/^\/+|\/+$/ig, '') : '');
    });
    var path = '/' + result.join('/');

    return path.replace(/^\/+/ig, '/');
  },
  /**
   * Get current base url http://example.com
   * @param  {String} path  the url path '/workspace/list'
   * @param  {Object} query parameters {root:''}
   * @return {String}       the final path
   */
  getUrl: function (path, query) {
    const port = url('port'); // 443, 80.
    const hostname = url('hostname');
    const protocol = url('protocol');
    var finalPath;
    var isHttpUrl = new RegExp('(https|http|ftp)?://');
    if (isHttpUrl.test(path)) {
      finalPath = path;
    } else {
      finalPath = lang.stringFormat('{0}://{1}{2}{3}', protocol, hostname, (port === 443 || port === 80) ? '' : (':' + port), this.normalizePath(path));
    }
    if (lang.isObject(query)) {
      var queryPath = [];
      jQuery.each(query, function (key, value) {
        queryPath.push(key + '=' + value);
      });
      return finalPath + '?' + queryPath.join('&').replace(/^&+/, '');
    } else {
      return finalPath;
    }
  }
};

module.exports = path;
