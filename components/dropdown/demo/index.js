var $ = require('jquery');
var Dropdown = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 下拉菜单Dropdown <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/dropdown" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>当页面上的操作命令过多时，用此组件可以收纳操作元素。点击或移入触点，会出现一个下拉菜单。可在列表中进行选择，并执行相应的命令。</p>'+
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
  '  launcherSelector: \".dropdown-toggle\",\n'+
  '  launcherTargetContainerSelector: ".dropdown-content",\n'+
  '  menuItemSelector: "li",\n'+
  '  closeOthers: true,\n'+
  '  my_position: "left top",\n'+
  '  at_position: "left bottom",\n'+
  '  // while click toggle button, assign launcherClass to togger button.\n'+
  '  toggleLauncher: true,\n'+
  '  launchOnMouseEnter: false,\n'+
  '  // The value indicates if auto close menu container while click any of menu items.\n'+
  '  menuAlwaysOpen: false,\n'+
  '  onSelect: $.noop\n'+
  '}'
  ;

  $renderTo.append($(template(docIntroduce, {
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
    '<div class="dropdown plugin-dropdown" data-dropdown=\'{"menuAlwaysOpen": true,"my_position":"left+10 top+10"}\'>\n' +
    '  <div class="launcher-container">\n' +
    '    <button class="btn btn-primary dropdown-toggle">Select another</button>\n' +
    '  </div>\n' +
    '  <ul class="dropdown-content" style="display: none; top: 41px; left: 10px;">\n' +
    '    <li data-value="opt_2.1"><a href="javascript:void(0);">Option-2.1</a></li>\n' +
    '    <li data-value="opt_2.2"><a href="javascript:void(0);">Option-2.2</a></li>\n' +
    '    <li class="divider"></li>\n' +
    '    <li data-value="opt_2.3"><a href="javascript:void(0);">Option-2.3</a></li>\n' +
    '  </ul>\n' +
    '</div>\n';

  let scriptCode =
    'require(\'../shared/jquery/components/dropdown\');\n\n' +
    '// 正常情况只需要上面的引入组件模块就已经可以了，如果还想要以编程方式访问组件public 的方法\n'+
    'var $dropdown = $result.find(\'[data-dropdown]\');\n' +
    '// we can get component instance via below code\n' +
    'var instance = $dropdown.getInstance();\n' +
    '// set dropdown configuration paramters dynamicly\n' +
    'instance.setOptions($.extend($dropdown.data(\'dropdown\'), {\n'+
    '  onSelect: function (e, data) {\n'+
    '    $result.find(\'.output\').html(JSON.stringify(data));\n'+
    '  }\n'+
    '}))';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Dropdown.getInstanceName());

  var $dropdown = $result.find('[data-dropdown]');
  var instance = $dropdown.getInstance();
  instance.setOptions($.extend($dropdown.data('dropdown'), {
    onSelect: function (e, data) {
      $result.find('.output').html(JSON.stringify(data));
    }
  }));
}

module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();

    // render sample2.

    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }
};
