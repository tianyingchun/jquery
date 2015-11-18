var $ = require('jquery');
// uniform data converter
var ajaxDataFilter = function(data) {

  var _resp = {},
    _rawResult = $.extend({}, data);

  // first find result["data"].
  var _rawData = _rawResult.data || _rawResult;
  var _rawCode = _rawResult.code || "0000"; // 0000 表示业务逻辑成功
  var _rawMessage = _rawResult.message || "";

  _resp = {
    code: _rawCode || status,
    message: _rawMessage,
    data: _rawData
  };
  if (_resp.code == "0000") {
    _resp.code = "000000";
  }
  // $log.debug(data, status, headers, config);
  return _resp;
};
// DTO for trySendOTP().
var ajaxTrySendOTPDataFilter = function(data) {

  // base DTO.
  var result = ajaxDataFilter.call(this, data);

  if (result.code == "000000") {
    // send successfully!.
    // now return all data values.
    // result.data = {
    //     maskedMobile: result.data.maskedMobile,
    //     retrySeconds: result.data.retrySeconds,
    //     // it's optional, otp id number.
    //     otpId: result.data.otpId
    // };
  } else if (result.code != "000000" && result.code == "1184") {
    // alwasy use 0000001 to ask captcha code.
    result.code = "000001";
    // send failed, return us captcha entity.
    // return new captcha.
    result.data = {
      captcha: {
        captchaId: result.data.captchaId,
        captchaUrl: result.data.captchaUrl
      }
    };
  }
  return result;
};
//DTO for refreshCaptcha().
var ajaxRefreshCaptchaDataFilter = function(data) {
  var result = ajaxDataFilter.call(this, data);
  if (result.code == "000000") {
    // return new captcha.
    result.data = {
      captcha: {
        captchaId: result.data.captchaId,
        captchaUrl: result.data.captchaUrl
      }
    };
  }
  return result;
};
//DTO for verifyCaptcha().
var ajaxVerifyCaptchaDataFilter = function(data) {
  var result = ajaxDataFilter.call(this, data);
  if (result.code == "000000") {
    // return new captchaToken property.
    result.data = {
      captchaToken: result.data
    };
  }
  return result;
};

function getRequestUrl(url) {

  // if we providered an api url with "http|s" prefix omit it.
  if (!/^((ftp|http|https):\/\/|\/\/)[^ "]+$/.test(url)) {
    url = this.apiRoot + url;
  }
  return url;
}

function OtpAPI() {
  //"http://192.168.11.10:8080";
  this.apiRoot = "http://localhost:4001/api";
  // we can customized sendOTP http request api name.
  this.trySendOTPApi = "";
}

$.extend(OtpAPI.prototype, {

  getRequestUrl: getRequestUrl,

  // expose some dto for otp apis.
  // Note. we can override dtos via pass as options to otp.otpService
  dtos: {
    baseAjaxDto: ajaxDataFilter,
    baseAjaxTrySendOTPDto: ajaxTrySendOTPDataFilter,
    baseAjaxRefreshCaptchaDto: ajaxRefreshCaptchaDataFilter,
    baseAjaxVerifyCaptchaDto: ajaxVerifyCaptchaDataFilter
  },
  /**
   * trySendOTP API
   * @method trySendOTP
   * @param  {number}         phone mobile phone number.
   * @param  {Function} cb    callback
   * callback (result)
   * if result.code=="000000"
   *     {maskedMobile,retrySeconds}
   * else
   *     {captchaId, captchaUrl}
   */
  trySendOTP: function(phone, captchaToken, deviceId, extraData, cb) {
    var data = {
      phone: phone,
    };
    // optional. token. first time captchaToken is null.
    if (captchaToken) {
      data.captchaToken = captchaToken;
    }
    // optional
    if (deviceId) {
      data.deviceId = deviceId;
    }

    $.extend(data, extraData);
    // we can defined api name to route specificed api path.
    var _sendOTPApiUrl = this.trySendOTPApi || "/otp/sendOtp";
    var _this = this;
    $.ajax({
      url: getRequestUrl.call(this, _sendOTPApiUrl),
      contentType: "application/json",
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      processData: false
    }).then(function(data) {
      if (cb) cb(_this.dtos.baseAjaxTrySendOTPDto.call(_this, data));
    }, function(data) {
      // give error message here maybe!
      // if (cb) cb(ajaxDataFilter(data));
      throw new Error("status code:" + data.status);
    });
  },
  /**
   * refresh captcha API
   * @method refreshCaptcha
   * @param  {Function} cb    callback
   */
  refreshCaptcha: function(extraData, cb) {
    var data = {};
    $.extend(data, extraData);
    var _this = this;

    $.ajax({
      url: getRequestUrl.call(this, "/otp/refreshCaptcha"),
      contentType: "application/json",
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(data),
      processData: false
    }).then(function(data) {
      if (cb) cb(_this.dtos.baseAjaxRefreshCaptchaDto.call(_this, data));
    }, function(data) {
      // give error message here maybe!
      // if (cb) cb(ajaxDataFilter(data));
      throw new Error("status code:" + data.status);
    });
  },
  /**
   * verifyCaptcha API
   * @method verifyCaptcha
   * @param  {object}       captcha, {captchaId:"", captchaInput:""}
   * @param  {object}       extraData: {} anything.
   * @param  {Function} cb  callback (captchaToken)
   */
  verifyCaptcha: function(captcha, extraData, cb) {
    $.extend(captcha, extraData);
    var _this = this;

    $.ajax({
      url: getRequestUrl.call(this, "/otp/verifyCaptcha"),
      contentType: "application/json",
      type: 'POST',
      dataType: 'json',
      data: JSON.stringify(captcha),
      processData: false
    }).then(function(data) {
      if (cb) cb(_this.dtos.baseAjaxVerifyCaptchaDto.call(_this, data));
    }, function(data) {
      // give error message here maybe!
      // if (cb) cb(ajaxDataFilter(data));
      throw new Error("status code:" + data.status);
    });
  }
});

// expose it to windows object.
module.exports = OtpAPI;
