var $ = require('jquery');
var Button = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 按钮Button JS 交互 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/button" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>Button 及 Button group 与 JS 交互。</p>'+
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
    ' loadingText: \'loading...\',\n'+
    ' resetText: \'\',\n'+
    ' disabledClassName: \'disabled\',\n'+
    ' spinner: undefined\n'+
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

function renderSample1() {

  let $renderTo = getMountNode();

  let demoCode =
    ' <button type="button" data-button=\'{"loadingText":"加载中...", "spinner":"spinner2"}\'\n' +
    '   class="btn btn-primary btn-loading-example">Submit - Button</button>\n'+
    '   &nbsp;&nbsp;&nbsp;&nbsp;\n'+
    ' <input type="button" class="btn btn-secondary btn-loading-example" value="按钮 - input 元素"\n'+
    '   data-button="{loadingText: \'努力加载中...\'}" />';

  let scriptCode =
    'var $button = $result.find(\'[data-button]\');\n'+
    'var instance = $button.getInstance();\n'+
    '$button.on("click", function () {\n'+
    '  // loading and disable button, avoid duplicated submit!\n'+
    '  $button.button(\'loading\');\n'+
    '  setTimeout(function () {\n'+
    '    // reset button status.\n'+
    '    $button.button(\'reset\');\n'+
    '  }, 2000);\n'+
    '});\n';

  let $result = getSampleTemplate('按钮 loading 状态', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Button.getInstanceName());

  $result.find('[data-button]').on("click", function () {
    var $button = $(this);
    $button.button('loading');
    setTimeout(function () {
      $button.button('reset');
    }, 5000);
  });
}

function renderSample2() {
  let $renderTo = getMountNode();

  let demoCode =
    '<div class="btn-group" data-button=\'{"preventDefault": true}\'>\n'+
    '  <label class="btn btn-primary">\n'+
    '    <input type="checkbox" name="doc-js-btn" value="苹果"> 苹果\n'+
    '  </label>\n'+
    '  <label class="btn btn-primary">\n'+
    '    <input type="checkbox" name="doc-js-btn" value="橘子"> 橘子\n'+
    '  </label>\n'+
    '  <label class="btn btn-primary" >\n'+
    '    <input type="checkbox" name="doc-js-btn" value="香蕉"> 香蕉\n'+
    '  </label>\n'+
    '</div>';

  let scriptCode =
    'var $cb = $result.find(\'[name="doc-js-btn"]\');\n'+
    '$cb.on(\'change\', function() {\n'+
    '  var checked = [];\n'+
    '  $cb.filter(\':checked\').each(function() {\n'+
    '    checked.push(this.value);\n'+
    '  });\n'+
    '  $result.find(\'.output\').html(\'复选框选中的是：\', checked.join(\' | \'));\n'+
    '});';

  let $result = getSampleTemplate('复选框', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Button.getInstanceName());

  var $cb = $result.find('[name="doc-js-btn"]');
  $cb.on('change', function() {
    var checked = [];
    $cb.filter(':checked').each(function() {
      checked.push(this.value);
    });
    $result.find('.output').html('复选框选中的是：' + checked.join(' | '));
  });

}

module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();

    // render sample2.
    renderSample2();
  }
};
