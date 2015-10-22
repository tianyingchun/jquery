var $ = require('jquery');
var Pagination = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 分页组件Pagination <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/pagination" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>采用分页形式分隔长列表，每次只加载一个页面</p>'+
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
  return  $(template(sampleTpl, {
    title: title,
    demoCode: data.demoCode,
    scriptCode: data.scriptCode
  }));
}

function renderSample1() {

  let $renderTo = getMountNode();

  let demoCode =
    '';

  let scriptCode =
    '';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  var $pagination = $result.find('[data-pagination]');

  UI.run(Pagination.getInstanceName());

}

module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();

    // render sample2.
  }
};
