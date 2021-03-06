var jQuery = require('jquery');
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
  getQueryString: function (name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  },
  isHttpUrl: function (url) {
    url = url || '';
    var httpUrlPattern = new RegExp('(https|http|ftp)?://');
    // match //www.baidu.com pattern
    return url.indexOf("//") === 0 || httpUrlPattern.test(url);
  },
  /**
   * Get current base url http://example.com
   * @param  {String} path  the url path '/workspace/list'
   * @param  {Object} query parameters {root:''}
   * @return {String}       the final path
   */
  getUrl: function (path, query) {
    var location = window.location;
    var port = parseInt(location.port || 80); // 443, 80.
    var protocol = location.protocol.replace(':', '');
    var hostname = location.hostname;
    var finalPath;
    var isHttpUrl = new RegExp('(https|http|ftp)?://');
    if (this.isHttpUrl(path)) {
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
