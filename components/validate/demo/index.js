var $ = require('jquery');
var Validate = require('../index');
var { UI } = require('../../core');
var { template } = require('../../../utils');
var dialog = Validate.dialog;

var docIntroduce =
  '<h1> jQuery form validate 组件 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/validate" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>Validate是一个轻量级jQuery表单验证组件</p>'+
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
    '<form class="form">\n'+
    '  <fieldset>\n'+
    '    <legend>表单标题</legend>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-email-1">邮件</label>\n'+
    '      <input type="email" class="" id="doc-ipt-email-1" placeholder="输入电子邮件">\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-pwd-1">密码</label>\n'+
    '      <input type="password" class="" id="doc-ipt-pwd-1" placeholder="设置个密码吧">\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ipt-file-1">原生文件上传域</label>\n'+
    '      <input type="file" id="doc-ipt-file-1">\n'+
    '      <p class="form-help">请选择要上传的文件...</p>\n'+
    '    </div>\n'+
    '    <div class="form-group form-file">\n'+
    '      <label for="doc-ipt-file-2">文件上传域</label>\n'+
    '      <div>\n'+
    '        <button type="button" class="btn btn-default btn-sm">\n'+
    '          <i class="glyph-icon glyph-twitter3"></i> 选择要上传的文件</button>\n'+
    '      </div>\n'+
    '      <input type="file" id="doc-ipt-file-2">\n'+
    '    </div>\n'+
    '    <div class="checkbox">\n'+
    '      <label>\n'+
    '        <input type="checkbox"> 复选框，选我选我选我\n'+
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
    '        <input type="checkbox" value="option1"> 选我\n'+
    '      </label>\n'+
    '      <label class="checkbox-inline">\n'+
    '        <input type="checkbox" value="option2"> 同时可以选我\n'+
    '      </label>\n'+
    '      <label class="checkbox-inline">\n'+
    '        <input type="checkbox" value="option3"> 还可以选我\n'+
    '      </label>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label class="radio-inline">\n'+
    '        <input type="radio"  value="" name="docInlineRadio"> 每一分\n'+
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
    '      <select id="doc-select-1">\n'+
    '        <option value="option1">选项一...</option>\n'+
    '        <option value="option2">选项二.....</option>\n'+
    '        <option value="option3">选项三........</option>\n'+
    '      </select>\n'+
    '      <span class="form-caret"></span>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-select-2">多选框</label>\n'+
    '      <select multiple class="" id="doc-select-2">\n'+
    '        <option>1</option>\n'+
    '        <option>2</option>\n'+
    '        <option>3</option>\n'+
    '        <option>4</option>\n'+
    '        <option>5</option>\n'+
    '      </select>\n'+
    '    </div>\n'+
    '    <div class="form-group">\n'+
    '      <label for="doc-ta-1">文本域</label>\n'+
    '      <textarea class="" rows="5" id="doc-ta-1"></textarea>\n'+
    '    </div>\n'+
    '    <p><button type="submit" class="btn btn-default">提交</button></p>\n'+
    '  </fieldset>\n'+
    '</form>';
  let scriptCode =
    '';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Validate.getInstanceName());

}
module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }
};
