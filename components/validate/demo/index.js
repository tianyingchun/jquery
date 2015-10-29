var $ = require('jquery');

// require jquery form.
require('../jquery.form')($);

var validatorLib = require('../index');
var { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> jQuery form validate 组件 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/validate" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>Validate是一个轻量级jQuery表单验证组件</p>'+
  '<p>官方文档: http://jqueryvalidation.org/validate/</p>'+
  '<p></p>'+
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
  ' rules: {},\n'+
  ' messages: {},\n'+
  ' submitHandler: function(form) {},\n'+
  ' invalidHandler: function (event, validator) {},\n'+
  ' The more at config at http://jqueryvalidation.org/validate/\n'+
  '}'
  ;

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
  return $(template(sampleTpl, {
    title: title,
    demoCode: data.demoCode,
    scriptCode: data.scriptCode
  }));
}

function renderSample1() {

  let $renderTo = getMountNode();

  let demoCode =
    '<form class="form" id="form" method="post" action="http://localhost:4001/test">\n'+
    '  <fieldset>\n'+
    '    <legend>表单标题</legend>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-email-1">邮件</label>\n'+
    '      <input name="email" type="email" class="form-field" placeholder="输入电子邮件">\n'+
    '     <span class="success">success</span>'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-email-1">手机号码</label>\n'+
    '      <input name="mobile" type="text" class="form-field" placeholder="输入手机号码">\n'+
    '     <span class="success">success</span>'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-email-1">身份证</label>\n'+
    '      <input name="idcard" type="text" class="form-field" placeholder="输入身份证">\n'+
    '     <span class="success">success</span>'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-email-1">银行卡</label>\n'+
    '      <input name="bankcard" type="text" class="form-field" placeholder="输入银行卡">\n'+
    '     <span class="success">success</span>'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-pwd-1">密码</label>\n'+
    '      <input name="password" type="password" class="form-field" id="doc-ipt-pwd-1" placeholder="设置个密码吧">\n'+
    '     <span class="success">success</span>'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-file-1">原生文件上传域</label>\n'+
    '      <input name="fileUpload1" type="file" id="doc-ipt-file-1">\n'+
    '      <p class="form-help">请选择要上传的文件...</p>\n'+
    '    </div>\n'+
    '    <div class="form-group form-file">\n'+
    '      <label for="doc-ipt-file-2">文件上传域</label>\n'+
    '      <div>\n'+
    '        <button type="button" class="btn btn-default btn-sm">\n'+
    '          <i class="glyph-icon glyph-twitter3"></i> 选择要上传的文件</button>\n'+
    '      </div>\n'+
    '      <input type="file" name="fileUpload2" id="doc-ipt-file-2">\n'+
    '    </div>\n'+
    '    <div class="checkbox">\n'+
    '      <label>\n'+
    '        <input name="checkbox1" type="checkbox"> 复选框，选我选我选我\n'+
    '      </label>\n'+
    '    </div>\n'+
    '    <div class="radio">\n'+
    '      <label>\n'+
    '        <input type="radio" name="doc-radio-1" value="option1" checked>\n'+
    '        单选框 - 选项1\n'+
    '      </label>\n'+
    '    </div>\n'+
    '    <div class="radio">\n'+
    '      <label>\n'+
    '        <input type="radio" name="doc-radio-1" value="option2">\n'+
    '        单选框 - 选项2\n'+
    '      </label>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label class="checkbox-inline">\n'+
    '        <input name="checkbox2" type="checkbox" value="option1"> 选我\n'+
    '      </label>\n'+
    '      <label class="checkbox-inline">\n'+
    '        <input name="checkbox3" type="checkbox" value="option2"> 同时可以选我\n'+
    '      </label>\n'+
    '      <label class="checkbox-inline">\n'+
    '        <input name="checkbox4" type="checkbox" value="option3"> 还可以选我\n'+
    '      </label>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label class="radio-inline">\n'+
    '        <input type="radio" value="" name="docInlineRadio"> 每一分\n'+
    '      </label>\n'+
    '      <label class="radio-inline">\n'+
    '        <input type="radio" name="docInlineRadio"> 每一秒\n'+
    '      </label>\n'+
    '      <label class="radio-inline">\n'+
    '        <input type="radio" name="docInlineRadio"> 多好\n'+
    '      </label>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-select-1">下拉多选框</label>\n'+
    '      <select name="drpProvince" id="doc-select-1">\n'+
    '        <option value="">请选择下拉框...</option>\n'+
    '        <option value="option1">选项一...</option>\n'+
    '        <option value="option2">选项二.....</option>\n'+
    '        <option value="option3">选项三........</option>\n'+
    '      </select>\n'+
    '      <span class="form-caret"></span>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-select-2">多选框</label>\n'+
    '      <select name="selectmultiple" multiple class="" id="doc-select-2">\n'+
    '        <option>1</option>\n'+
    '        <option>2</option>\n'+
    '        <option>3</option>\n'+
    '        <option>4</option>\n'+
    '        <option>5</option>\n'+
    '      </select>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ta-1">文本域</label>\n'+
    '      <textarea name="textarea" class="" rows="5" id="doc-ta-1"></textarea>\n'+
    '    </div>\n'+
    '    <p><button type="submit" data-button="{loadingText: \'努力加载中...\'}" class="btn-submit btn btn-default">提交</button></p>\n'+
    '  </fieldset>\n'+
    '</form>';
  let scriptCode =
  'var $submit = $(".btn-submit");\n'+
  'var validateOptions = $.extend({}, validatorLib.DEFAULTS, {\n'+
  '  rules: {\n'+
  '    //  the name-field mapping, the `mobile` is form field name.\n'+
  '    // <input name="mobile" maxlength="11"  required  type="text" placeholder="请填写您的真实手机，方便我们与您取得联系" />\n'+
  '    mobile: \'isMobile\',\n'+
  '    email: {\n'+
  '      required: true,\n'+
  '      email: true\n'+
  '    },\n'+
  '    // <input name="qq" type="text" placeholder="请填写您的QQ号，方便我们与您取得联系" />\n'+
  '    qq: \'isQQ\'\n'+
  '  },\n'+
  '  // Key/value pairs defining custom messages. Key is the name of an element, value the message to display for that element.\n'+
  '  // Instead of a plain message, another map with specific messages for each rule can be used.\n'+
  '  messages: {\n'+
  '    name:"请填写真实姓名",\n'+
  '    email: "请填写正确的邮箱地址",\n'+
  '    mobile: {\n'+
  '      required:"请填写手机号码",\n'+
  '      isMobile: "请填写正确的手机号码"\n'+
  '    },\n'+
  '    smsCode: {\n'+
  '      required:"请填写短信验证码"//验证码错误，请重新输入\n'+
  '    },\n'+
  '    randomCodeInput: {\n'+
  '      required: "请填写图片验证码"//验证码错误，请重新输入\n'+
  '    }\n'+
  '  },\n'+
  '  submitHandler: function(form) {\n'+
  '    // do other things for a valid form\n'+
  '    // http://www.malsup.com/jquery/form/#api\n'+
  '    $(form).ajaxSubmit({\n'+
  '      // pre-submit callback\n'+
  '      beforeSubmit:  function () {\n'+
  '        $submit.button(\'loading\');\n'+
  '        console.log(\'pre-submit callback\');\n'+
  '      },\n'+
  '      // post-submit callback\n'+
  '      success:       function () {\n'+
  '        console.log(\'post-submit callback\');\n'+
  '        $submit.button(\'reset\');\n'+
  '      }\n'+
  '    });\n'+
  '  }\n'+
  '});\n'+
  '//http://jqueryvalidation.org/validate/\n'+
  'var validator = $("#form").validate(validateOptions);\n'+
  '// can use ajaxSubmit instead.\n'+
  '// $submit.on("click", function () {\n'+
  '//   validator.form();\n'+
  '//   if (validator.valid()) {\n'+
  '//     $result.find(\'.output\').html(\'form is valid, you can do something.\');\n'+
  '//   } else {\n'+
  '//     $result.find(\'.output\').html(\'form is invalid\');\n'+
  '//   }\n'+
  '// });';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  var $submit = $(".btn-submit");

  var validateOptions = $.extend({}, validatorLib.DEFAULTS, {
    rules: {
      //  the name-field mapping, the `mobile` is form field name.
      // <input name="mobile" maxlength="11"  required  type="text" placeholder="请填写您的真实手机，方便我们与您取得联系" />
      mobile: 'isMobile',
      drpProvince: {
        required: true
      },
      idcard: {
        required: true,
        idCard: true
      },
      bankcard: {
        required: true,
        bankCard: true
      },
      password: {
        required: true,
        paypwd: true
      },
      email: {
        required: true,
        email: true
      },
      // <input name="qq" type="text" placeholder="请填写您的QQ号，方便我们与您取得联系" />
      qq: 'isQQ'
    },
    // Key/value pairs defining custom messages. Key is the name of an element, value the message to display for that element.
    // Instead of a plain message, another map with specific messages for each rule can be used.
    messages: {
      name:"请填写真实姓名",
      email: "请填写正确的邮箱地址",
      drpProvince: {
        required: "请选择下拉框值"
      },
      idcard: {
        required:"请填写身份证号",
        idCard: "请输入正确的身份证号"
      },
      bankcard: {
        required:"请填写银行卡",
        bankCard: "请输入正确的银行卡"
      },
      password: {
        required: "请输入6-8位密码",
        paypwd: "请输入6-8位密码"
      },
      mobile: {
        required:"请填写手机号码",
        isMobile: "请填写正确的手机号码"
      },
      smsCode: {
        required:"请填写短信验证码"//验证码错误，请重新输入
      },
      randomCodeInput: {
        required: "请填写图片验证码"//验证码错误，请重新输入
      }
    },
    invalidHandler: function (event, validator) {
      // console.log(event, validator);
    },
    submitHandler: function(form) {
      // do other things for a valid form
      // http://www.malsup.com/jquery/form/#api

      $(form).ajaxSubmit({
        // pre-submit callback
        beforeSubmit:  function () {
          $submit.button('loading');
          console.log('pre-submit callback');
        },
        // post-submit callback
        success:       function () {
          console.log('post-submit callback');
          $submit.button('reset');
        }
      });
    }
  });
  //http://jqueryvalidation.org/validate/
  var validator = $("#form").validate(validateOptions);

  // can use ajaxSubmit instead.
  // $submit.on("click", function () {
  //   validator.form();
  //   if (validator.valid()) {
  //     $result.find('.output').html('form is valid, you can do something.');
  //   } else {
  //     $result.find('.output').html('form is invalid');
  //   }
  // });

  UI.run('ui.button');
}
module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();

  }
};
