var $ = require('jquery');
var validator = require('./jquery.validate');

//
// all regex rules const definition
// --------------------------------------------------------------------------
var regexRuleConst = {
  "postcode": /^[1-9][0-9]{5}$/, //邮政编码
  "idcard": /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, //身份证号码验证表达式
  "chCode": /[^\u4e00-\u9fa5\s+]/ig, //所有字符必须为中文字符
  "enCode": /^[a-zA-Z\s]+$/, // 所有的英文字符
  ///^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/
  "mobile": /^1[3-9][0-9]\d{8}$/, //验证手机号码/^1[3|4|5|8][0-9]\d{4,8}$/
  "empty": /^\s+|\s+$/ig, // 移除字符串空字符串
  "url": /^https?:\/\//,
  "bankcard": /^\d{12,}$/,
  "captchaInput": /^.{4}$/,//TOP 图片验证码的验证表达式
  "paypwd": /^[a-zA-Z0-9]{6,8}$///
};

// extends validator methods.
validator.addMethod('isMobile', function (value, element) {
  var length = value.length;
  var mobile = regexRuleConst.mobile;
  return (length == 11 && mobile.exec(value)) ? true : false;
}, "请填写正确的手机号码");

// QQ 号
validator.addMethod('isQQ', function (value, element) {
  var qq = /^\d+$/;
  if (!value) return true;
  return qq.exec(value) ? true : false;
}, "请填写正确的QQ号码");

// 银行卡号
validator.addMethod('bankCard', function (value, element) {
  var bankCard = regexRuleConst.bankcard;
  if (!value) return true;
  return bankCard.exec(value) ? true : false;
}, "请填写正确的银行卡号");

// 身份证号
validator.addMethod('idCard', function (value, element) {
  var idcard = regexRuleConst.idcard;
  if (!value) return true;
  return idcard.exec(value) ? true : false;
}, "请填写正确的身份证号");

// 支付密码
validator.addMethod('paypwd', function (value, element) {
  var paypwd = regexRuleConst.paypwd;
  if (!value) return true;
  return paypwd.exec(value) ? true : false;
}, "请填写6-8位支付密码");


// override validator messages.
$.extend(validator.messages, {
  required: "必选项",
  remote: "请修正该选项",
  email: "请输入正确格式的电子邮件",
  url: "请输入合法的网址",
  date: "请输入合法的日期",
  dateISO: "请输入合法的日期 (ISO).",
  number: "请输入合法的数字",
  digits: "只能输入整数",
  creditcard: "请输入合法的信用卡号",
  equalTo: "请再次输入相同的值",
  accept: "请输入拥有合法后缀名的字符串",
  maxlength: $.validator.format("请输入一个 长度最多是 {0} 的字符串"),
  minlength: $.validator.format("请输入一个 长度最少是 {0} 的字符串"),
  rangelength: $.validator.format("请输入 一个长度介于 {0} 和 {1} 之间的字符串"),
  range: $.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
  max: $.validator.format("请输入一个最大为{0} 的值"),
  min: $.validator.format("请输入一个最小为{0} 的值")
});

var formErrorClass = 'form-error';
var formValidClass = 'form-success';
//http://jqueryvalidation.org/validate/
validator.DEFAULTS = {
  ignore: ".ignore",
  errorClass: "error",
  validClass: "success",
  errorElement: 'span',
  errorPlacement: function(error, element) {
    element.parent('.form-group').addClass('form-error').append(error);
  },
  highlight: function(element, errorClass, validClass) {
    // console.log('highlight', element, errorClass, validClass)
    $(element).parent('.form-group').addClass(formErrorClass).removeClass(formValidClass);
    // $(element.form).find("label[for=" + element.id + "]").addClass(errorClass);
  },
  unhighlight: function(element, errorClass, validClass) {
    // console.log('unhighlight',element, errorClass, validClass)

    $(element).parent('.form-group').removeClass(formErrorClass).addClass(formValidClass);
    // $(element.form).find("label[for=" + element.id + "]").removeClass(errorClass);
  }
}
module.exports = validator;


