require('./otp.less');
var $ = require('jquery');
var {
  UI, createPlugin, ComponentClass
} = require('../core');

var OtpImageSuite = require('./OtpImageSuite');
var OtpService = require('./OtpApi');

var componentName = "otp";

var Otp = ComponentClass.extend({
  componentName: componentName,
  initialize: function ($element, options) {

    this.running = false;

    // cache ui components.
    this.$mobileInput = $element.find(options.mobileInputSelector);
    this.$captchaControl = $element.find(options.captchaControlSelector);
    this.$captchaInput = $element.find(options.captchaInputSelector);
    this.$captchaImage = $element.find(options.captchaImageSelector);
    this.$otpGet = $element.find(options.otpGetSelector);
    this.$otpInput = $element.find(options.otpInputSelector);
    this.$otpTicker = $element.find(options.otpTickerSelector);

    // mrege the lastest options for otpService, and otpImageSuite service.
    this._mergeServiceConfig();

    this._hookEvents();
    this._hookOtpSuiteModule();

    // auto initialization here.
    // if need to show captcha first time.
    if (options.firstShowCaptcha) {
      this.refreshCaptcha();
      this.$captchaControl.css("display", "block");
    }
  },
  _mergeServiceConfig: function () {
    var options = this.options;
    // the configuration for otpImageSuite
    var suiteServiceCfg = {
      trySendOTPServiceName: options.trySendOtpServiceName,
      ignoreMobileValidation: options.ignoreMobileValidation,
      tickerSecond: options.tickerSecond || 60 // 60 second total.
    };
    var otpService = new OtpService();
    // merge otp service configurations.
    $.extend(otpService, options.otpService);
    //The otp image suite instance.
    this.otpImgSuite = new OtpImageSuite(otpService, suiteServiceCfg);
  },
  // otp sending pre handler.
  _OTPSendingHandler: function (event) {
    // do nothing... may be we can show loading spinner here.

  },
  // otp sent success handler.
  _OTPSentSuccessHandler: function (data) {
    // don't hide captcha 控件. we can do this in client. by cfg.otpHasPassedCallback().
    // $captchaControl.css("display", "none");
    this._setMobileCaptchaDisabledStatus(true);
    if (this.options.otpHasPassedCallback) {
      this.options.otpHasPassedCallback(data);
    }
  },
  // set captcha input, mobile input disabled status.
  _setMobileCaptchaDisabledStatus: function (disabled) {
    if (disabled) {
      this.$mobileInput.prop("disabled", true);
      this.$captchaInput.prop("disabled", true);
    } else {
      this.$mobileInput.prop("disabled", false);
      this.$captchaInput.prop("disabled", false);
    }
  },
  // update captcha token value.
  _setCaptchaToken: function (value) {
    this.$element.data(this.options.dataCaptchaToken, value || null);
  },
  // get captcha token value.
  _getCaptchaToken: function () {
    return this.$element.data(this.options.dataCaptchaToken);
  },

  _setCaptchaId: function (value) {
    this.$element.data(this.options.dataCaptchaId, value || null);
  },
  // get captcha id.
  _getCaptchaId: function () {
    return this.$element.data(this.options.dataCaptchaId);
  },
  // return client unique device id.
  _getDeviceId: function () {
    return "";
  },
  // OTP Error handler.
  _OTPErrorHandler: function (event) {
    var error = event.data;
    var code = error.code;
    var message = error.message;
    var otpErrorsCallback = this.options.otpErrorsCallback || function () {};
    switch (code) {
      case "mobile_invalid":
        // Now we do nothing, we need to handler these message in client consumer.
        otpErrorsCallback(code, message);
        break;
      case "captcha_refreshed_failed":
        otpErrorsCallback(code, message);
        break;
      case "token_flushed_failed":
        // captcha token flush failed, clear existed token.
        this._setCaptchaToken(null);
        otpErrorsCallback(code, message);
        break;
      default:
        // for other unhandled exceptions.
        otpErrorsCallback(code, message);
        break;
    }
  },
  // show ticker handler.
  _OTPShowTickerHandler: function (data) {
    this.running = true;
    this.$otpGet.css("display", "none");
    this.$otpTicker.css("display", "block");
    var tickerStr = this.options.leftSecondFormatter.replace(new RegExp('\\{0\\}', "g"), data);
    this.$otpTicker.html(tickerStr);
  },

  // close ticker handler.
  _OTPCloseTickerHandler: function (data) {
    this.running = false;
    this._setMobileCaptchaDisabledStatus(false);
    this.$otpGet.css("display", "block");
    this.$otpTicker.css("display", "none");
    this.$otpTicker.html("");
  },

  // capcha show handler
  _OTPShowCaptchaHandler: function (data) {
    var captcha = data;
    // show captcha control.
    this.$captchaControl.css("display", "block");

    // refresh captch UI
    this._OTPRefreshCaptchaUI(captcha);
  },
  /**
   * While we re-input mobile number, we need to restore OTP Initialize states,
   * and make user has chance to send otp without captcha.
   */
  _restoreOTPInitState: function () {
    this.running = false;
    // tear down ticker now.
    this.otpImgSuite.tearDownTicker();
    this._OTPCloseTickerHandler();
    // need to show captcha first time.
    if (this.options.firstShowCaptcha) {
      this.$captchaControl.css("display", "block");
    } else {
      this.$captchaControl.css("display", "none");
    }
  },
  // refresh captcha
  _OTPRefreshCaptchaUI: function (captcha) {
    // make sure that each url have not cache.
    this.$captchaImage.attr("src", captcha.captchaUrl ? captcha.captchaUrl + "?r=" + Math.random() : "");
    this._setCaptchaId(captcha.captchaId);
  },
  // flush token handler.
  _OTPFlushTokenHandler: function (data) {
    var token = data;
    this._setCaptchaToken(token);
    // $this.find(options.otpGetSelector).prop("disabled", false);
    if (this.options.autoSendOtp) {
      // try to resend otp request.
      this._trySendOtp();
    }
  },
  // 注册UI DOM 事件处理器
  _hookEvents: function () {
    var _this = this;
    // 监听 发送短信按钮click 事件
    this.$otpGet.on("click", function (e) {
      _this._trySendOtp();
    });
    // 监听 图片验证码输入框 change事件，发送CMMAND 去验证图片码
    this.$captchaInput.on("input", function (e) {
      var val = $.trim($(this).val());
      if (val && val.length >= 4) {
        _this.otpImgSuite.verifyCaptcha({
          captchaInput: val,
          captchaId: getCaptchaId()
        });
      }
    });
    // 监听 图片随机码的刷新事件
    this.$captchaImage.on("click", function () {
      _this.refreshCaptcha();
    });
  },
  // 注册OtpImageSuite 模块事件
  _hookOtpSuiteModule: function () {
    var options = this.options;
    var _this = this;
    this.otpImgSuite.addReceiver(function (event) {
      var type = event.type;
      var data = event.data;
      // always invoke event listener to passed components current states.
      if (options.eventListener) {
        options.eventListener(event);
      }
      switch (type) {
        case "OTPSending":
          _this._OTPSendingHandler(event);
          break;
        case "OTPSentSuccess":
          _this._OTPSentSuccessHandler(data);
          break;
        case "error":
          _this._OTPErrorHandler(event);
          break;
        case "showTicker":
          _this._OTPShowTickerHandler(data);
          break;
        case "closeTicker":
          _this._OTPCloseTickerHandler(data);
          break;
        case "captchaShow":
          _this._OTPShowCaptchaHandler(data);
          break;
        case "captchaRefreshed":
          _this._OTPRefreshCaptchaUI(data);
          break;
        case "tokenFlushed":
          _this._OTPFlushTokenHandler(data);
          break;
      }
    });
  },
  //
  // OTP 相关业务方法
  // ---------------------------------------------------

  // OtpImageSuite 发短信业务方法
  //

  _trySendOtp: function () {
    var preSendValidateResult = this.options.onPreSendValidate();
    if (typeof preSendValidateResult != 'undefined' && preSendValidateResult === false) {
      console.log("trySendOtp()->", "preSendValidate failed.");
      this.otpImgSuite.fireError("pre_send_validation_failed", false);
      return;
    }
    var phone = this.$mobileInput.val();
    var token = this._getCaptchaToken();
    var deviceId = this._getDeviceId() || "";
    // 提供额外的数据注入到具体的OTP发短信业务
    var extraData = $.extend({}, this.options.getExtraData() || {});

    // try send OTP. need to clone new object, and pass into otpImageSuite. it is security.
    this.otpImgSuite.trySendOTP(phone, token, deviceId, extraData);
  },

  //@override parent.setOptions.
  setOptions: function (options) {
    this.options = $.extend(this.options, options);

    // remerge service options.
    this._mergeServiceConfig();

    // re hook otp suite module.
    this._hookOtpSuiteModule();
  },
  // @public
  start: function () {
    this._trySendOtp();
  },
  // @public
  reset: function () {
    this._restoreOTPInitState();
  },
  // @public
  // OtpImageSuite 刷新图片验证码方法
  refreshCaptcha: function () {
    if (!this.running) {
      this.otpImgSuite.refreshCaptcha();
    }
  },
  destroy: function () {
    this._destroy();
    this.$otpGet.off('click');
    this.$captchaInput.off('input');
    this.$captchaImage.off('click');
  }
});

Otp.DEFAULTS = {
  // allow us customized otp service.
  otpService: {
    apiRoot: "http://localhost:4001/api",
    trySendOTPApi: "" // `/otp/changeSendOtp`
  },
  // provider pre sent validation if return false, don't invoke trySentOtp.
  onPreSendValidate: function () {},
  // The value indicates if we need to auto send otp message while captcha varify success!
  autoSendOtp: false,
  // default show captcha
  firstShowCaptcha: false,
  // ticket second formatter.
  leftSecondFormatter: "{0}s",
  // data-* save captchaId come from server side.
  // $.data("captchaId","otp_id_get_from_server")
  dataCaptchaId: "captchaId",
  // $.data("captchaToken","save_validated_captcha_token")
  dataCaptchaToken: "captchaToken",
  // $("手机号输入框")
  mobileInputSelector: ".mobile-input",
  //$("图片验证码控件外层")
  captchaControlSelector: "captcha-control",
  // $("图片验证码输入框")
  captchaInputSelector: ".captcha-input",
  // $("图片Img对象")
  captchaImageSelector: ".captcha-image",
  // $("发送按钮")
  otpGetSelector: ".btn-sendotp",
  // $("短信验证码输入框")
  otpInputSelector: ".otp-input",
  // $("计时器")
  otpTickerSelector: ".ticker",

  // 默认事件侦听器
  eventListener: function (event) {

  },
  // 允许OTP 发送成功回调客户端指定的函数
  otpHasPassedCallback: function (result) {

  },
  // 允许OTP 发送失败回调客户端指定的函数(code, message)
  otpErrorsCallback: function (event) {

  },
  // 允许我们动态按需从客户端拿自定义的数据，针对不同的OTP 业务需求
  getExtraData: function () {
    return null;
  }
};

createPlugin(componentName, Otp);

// hook domReady().
UI.ready(function (context) {

  $('[data-otp]', context).otp();

}, Otp.getInstanceName(componentName));


module.exports = Otp;
