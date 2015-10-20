var $ = require('jquery');
var validator = require('./jquery.validate');

// extends validator methods.
validator.addMethod('isMobile', function(value, element) {
  var length = value.length;
  var mobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
  return (length == 11 && mobile.exec(value)) ? true : false;
}, "请填写正确的手机号码");

validator.addMethod('isQQ', function (value, element) {
  var qq = /^\d+$/;
  if (!value) return true;
  return qq.exec(value) ? true : false;
}, "请填写正确的QQ号码");


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

module.exports = validator;


