var $ = require('jquery');
var CitySelect = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 省市区 JS 交互 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/cityselect" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>citySelect</p>'+
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
    '  province: {\n'+
    '    selector: ".drp_province",\n'+
    '    value: "",\n'+
    '    text: "",\n'+
    '    // if == empty, default 显示 "请选择"\n'+
    '    defaultValue: ""\n'+
    '  },\n'+
    '  city: {\n'+
    '    selector: ".drp_city",\n'+
    '    value: "",\n'+
    '    text: "",\n'+
    '    defaultValue: ""\n'+
    '  },\n'+
    '  country: {\n'+
    '    selector: ".drp_country",\n'+
    '    value: "",\n'+
    '    text: "",\n'+
    '    defaultValue: ""\n'+
    '  },\n'+
    '  onSelectInitialized: $.noop\n'+
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
  return  $(template(sampleTpl, {
    title: title,
    demoCode: data.demoCode,
    scriptCode: data.scriptCode
  }));
}

function renderSample() {

  let $renderTo = getMountNode();

  let demoCode =
    ' <button type="button" data-button=\'{"loadingText":"加载中...", "spinner":"spinner2"}\'\n' +
    '   class="btn btn-primary btn-loading-example">Submit - Button</button>\n'+
    '   &nbsp;&nbsp;&nbsp;&nbsp;\n'+
    ' <input type="button" class="btn btn-secondary btn-loading-example" value="按钮 - input 元素"\n'+
    '   data-button="{loadingText: \'努力加载中...\'}" />';

  let scriptCode =
    '';

  let $result = getSampleTemplate('按钮 loading 状态', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(CitySelect.getInstanceName());

}

module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample.
    renderSample();
  }
};
