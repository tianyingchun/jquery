var $ = require('jquery');
var Otp = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 按钮Otp JS 交互 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/otp" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>Otp JS 交互。</p>'+
  '<hr />'+
  '<p>配置参数：<pre><code class="javascript"><%=options%></code></pre></p>'+
  '<h2>组件演示 Demos</h2>'
  ;

function getMountNode () {
  let $renderTo = $(".right-main .doc-content");
  return $renderTo;
}

function renderIntroductions() {
  let $renderTo = getMountNode();
  var options =
'{\n'+
      '  // allow us customized otp service.\n'+
      '  otpService: {\n'+
      '    apiRoot: "http://localhost:4001",\n'+
      '    trySendOTPApi: "" // `/otp/changeSendOtp`\n'+
      '  },\n'+
      '  // The value indicates if we need to auto send otp message while captcha varify success!\n'+
      '  autoSendOtp: false,\n'+
      '  // default show captcha\n'+
      '  firstShowCaptcha: false,\n'+
      '  // ticket second formatter.\n'+
      '  leftSecondFormatter: "{0}s",\n'+
      '  // data-* save captchaId come from server side.\n'+
      '  // $.data("captchaId","otp_id_get_from_server")\n'+
      '  dataCaptchaId: "captchaId",\n'+
      '  // $.data("captchaToken","save_validated_captcha_token")\n'+
      '  dataCaptchaToken: "captchaToken",\n'+
      '  // $("手机号输入框")\n'+
      '  mobileInputSelector: ".mobile-input",\n'+
      '  //$("图片验证码控件外层")\n'+
      '  captchaControlSelector: "captcha-control",\n'+
      '  // $("图片验证码输入框")\n'+
      '  captchaInputSelector: ".captcha-input",\n'+
      '  // $("图片Img对象")\n'+
      '  captchaImageSelector: ".captcha-image",\n'+
      '  // $("发送按钮")\n'+
      '  otpGetSelector: ".btn-sendotp",\n'+
      '  // $("短信验证码输入框")\n'+
      '  otpInputSelector: ".otp-input",\n'+
      '  // $("计时器")\n'+
      '  otpTickerSelector: ".ticker",// 默认事件侦听器\n'+
      '  eventListener: function (event) {},\n'+
      '  // 允许OTP 发送成功回调客户端指定的函数\n'+
      '  otpHasPassedCallback: function (result) {},\n'+
      '  // 允许OTP 发送失败回调客户端指定的函数(code, message)\n'+
      '  otpErrorsCallback: function (event) {},\n'+
      '  // 允许我们动态按需从客户端拿自定义的数据，针对不同的OTP 业务需求\n'+
      '  getExtraData: function () {\n'+
      '    return null;\n'+
      '  }\n'+
    '}';

  $renderTo.html('').append($(template(docIntroduce, {
    options:options
  })));

}

function getSampleTemplate(title, data) {
  var sampleTpl =
    '<h3><%= title%></h3>'+
    '<div class="mount-node"><%:= demoCode%><span class="output"></span></div>'+
    '<div class="doc-code demo-highlight">'+
    '  <strong> DOM</strong>'+
    '  <pre>'+
    '     <code class="html"><%= demoCode %></code>'+
    '  </pre>'+
    '  <strong> Javascript</strong>'+
    '  <pre>'+
    '     <code class="javscript"><%= scriptCode %></code>'+
    '  </pre>'+
    '</div>'+
    '<hr />';
  return  $(template(sampleTpl, {
    title: title,
    demoCode: data.demoCode,
    scriptCode: data.scriptCode
  }));
}

function renderSample1() {

  let $renderTo = getMountNode();

  let demoCode =
  '<form class="form-horizontal" data-otp>\n'+
  '  <div class="form-group">\n'+
  '    <input type="hidden" value="18521757209" class="form-field mobile-input" placeholder="手机号码">\n'+
  '    <input type="text" class="form-field fl" placeholder="短信验证码">\n'+
  '    <button type="button" class="fl btn btn-default btn-sendotp">发送短信</button>\n'+
  '    <span class="btn btn-default fl ticker"></span>\n'+
  '  </div>\n'+
  '</form>\n'+
  '<button type="button" class="btn btn-default btn-manully-send">自定义发送短信按钮</button>&nbsp;&nbsp;\n'+
  '<button type="button" class="btn btn-default btn-manully-stoped">自定义终止短信按钮</button>\n';

  let scriptCode =
    'var $otpControl = $("[data-otp]");\n'+
    'var instance = $otpControl.getInstance();\n'+
    '$result.on("click", ".btn-manully-send", function () {\n'+
    '  $otpControl.otp("start");\n'+
    '});\n'+
    '$result.on("click", ".btn-manully-stoped", function () {\n'+
    '  instance.reset();\n'+
    '});';

  let $result = getSampleTemplate('OTP sample', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Otp.getInstanceName());

  var $otpControl = $("[data-otp]");
  var instance = $otpControl.getInstance();

  $result.on("click", ".btn-manully-send", function () {
    $otpControl.otp('start');
  });

  $result.on("click", ".btn-manully-stoped", function () {
    instance.reset();
  });

}

module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();
  }
};
