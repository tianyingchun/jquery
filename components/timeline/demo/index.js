var $ = require('jquery');
var Timeline = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 时间轴Timeline <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/timeline" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>垂直展示的事件流信息，纯CSS 组件库</p>'+
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
  var options ='no js need';

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
  '<ul class="timeline">\n'+
  '  <li class="timeline-item">\n'+
  '    <div style="display:block;" class="timeline-item-tail"></div>\n'+
  '    <div class="timeline-item-head default"></div>\n'+
  '    <div class="timeline-item-content">创建服务现场 2015-09-01</div>\n'+
  '  </li>\n'+
  '  <li class="timeline-item">\n'+
  '    <div style="display:block;" class="timeline-item-tail"></div>\n'+
  '    <div class="timeline-item-head primary"></div>\n'+
  '    <div class="timeline-item-content">创建服务现场 2015-09-01</div>\n'+
  '  </li>\n'+
  '  <li class="timeline-item">\n'+
  '    <div style="display:block;" class="timeline-item-tail"></div>\n'+
  '    <div class="timeline-item-head success"></div>\n'+
  '    <div class="timeline-item-content">\n'+
  '      <p>初步排除网络异常1</p>\n'+
  '      <p>初步排除网络异常2</p>\n'+
  '      <p>初步排除网络异常3 2015-09-01</p>\n'+
  '    </div>\n'+
  '  </li>\n'+
  '  <li class="timeline-item">\n'+
  '    <div style="display:block;" class="timeline-item-tail"></div>\n'+
  '    <div class="timeline-item-head warning"></div>\n'+
  '    <div class="timeline-item-content">\n'+
  '      <p>技术测试异常1</p>\n'+
  '      <p>技术测试异常2</p>\n'+
  '      <p>技术测试异常3 2015-09-01</p>\n'+
  '    </div>\n'+
  '  </li>\n'+
  '  <li class="timeline-item">\n'+
  '    <div style="display:block;" class="timeline-item-tail"></div>\n'+
  '    <div class="timeline-item-head danger"></div>\n'+
  '    <div class="timeline-item-content">\n'+
  '      <p>技术测试异常1</p>\n'+
  '      <p>技术测试异常2</p>\n'+
  '      <p>技术测试异常3 2015-09-01</p>\n'+
  '    </div>\n'+
  '  </li>\n'+
  '  <li class="timeline-item">\n'+
  '    <div style="display:none;" class="timeline-item-tail"></div>\n'+
  '    <div class="timeline-item-head info"></div>\n'+
  '    <div class="timeline-item-content">\n'+
  '      <p>技术测试异常1</p>\n'+
  '      <p>技术测试异常2</p>\n'+
  '      <p>技术测试异常3 2015-09-01</p>\n'+
  '    </div>\n'+
  '  </li>\n'+
  '</ul>\n';

  let scriptCode ='no js dependancy';

  let $result = getSampleTemplate('纯CSS UI DOM 结构', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

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
