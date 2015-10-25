var $ = require('jquery');
var Collapse = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 折叠面板Collapse JS 交互 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/collapse" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>折叠面板常用 交互。</p>'+
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
    '   query: "> :even",\n'+
    '   accordion: false,\n'+
    '   persist: false,\n'+
    '   clickQuery: "",\n'+
    '   open: false, // function () { this == $details}\n'+
    '   close: false, // function () { this == $details}\n'+
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
    '<h2>Default Example</h2>\n'+
    '<div class="panel-group" id="default-example" data-collapse=\'{"query":".panel>.panel-hd"}\'>\n'+
    ' <div class="panel panel-default">\n'+
    '   <div class="panel-hd open">Fruits</div>\n'+
    '   <div class="panel-collapse collapse">\n'+
    '     <div class="panel-bd">I like fruits. This <a href="#work">link should work</a></div>\n'+
    '   </div>\n'+
    ' </div>\n'+
    ' <div class="panel panel-default">\n'+
    '   <div class="panel-hd">Info</div>\n'+
    '   <div class="panel-collapse collapse">\n'+
    '     <div class="panel-bd">This is some information</div>\n'+
    '   </div>\n'+
    ' </div>\n'+
    '</div>\n';

  let scriptCode = '// no javascript need!';

  let $result = getSampleTemplate('默认的折叠效果', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Collapse.getInstanceName());
}
function renderSample2() {

  let $renderTo = getMountNode();

  let demoCode =
  '<div class="panel-group sample-animation" data-collapse=\'{"accordion":true, "query":"div .panel-hd"}\'>\n'+
    '<div class="panel panel-default">\n'+
    '  <div class="panel-hd">Hello</div>\n'+
    '  <div class="panel-collapse collapse">\n'+
    '     <div class="panel-bd">\n'+
    '       <div class="content">\n'+
    '         <p>This example simply sets a class attribute to the details and let\n'+
    '         external stylesheet toggle the collapsed state.</p>\n'+
    '         <p>Hello Sir.</p>\n'+
    '         <p>Im sliding</p>\n'+
    '       </div>\n'+
    '     </div>\n'+
    '  </div>\n'+
    '</div>\n'+
    '<div class="panel panel-default">\n'+
    '  <div class="panel-hd open">Friend</div>\n'+
    '  <div class="panel-collapse collapse">\n'+
    '     <div class="panel-bd">\n'+
    '       <div class="content">\n'+
    '         <p>This example simply sets a class attribute to the details and let\n'+
    '         external stylesheet toggle the collapsed state.</p>\n'+
    '         <p>Hello Sir.</p>\n'+
    '       </div>\n'+
    '     </div>\n'+
    '   </div>\n'+
    '</div>\n'+
    '<div class="panel panel-default">\n'+
    '  <div class="panel-hd">Foe</div>\n'+
    '  <div class="panel-collapse collapse">\n'+
    '     <div class="panel-bd">\n'+
    '       <div class="content">\n'+
    '         <p>This example simply sets a class attribute to the details and let\n'+
    '         external stylesheet toggle the collapsed state.</p>\n'+
    '       </div>\n'+
    '     </div>\n'+
    '   </div>\n'+
    '</div>\n'+
  '</div>';

  let scriptCode =
  'var $collapseAnims = $(".sample-animation");\n'+
  'var collapseInstance = $collapseAnims.getInstance();\n'+
  '// if is accordion, each $summery will be invoke once.\n'+
  '$collapseAnims.bind("opened", function(e, section) {\n'+
  '  console.log(section.$summary.text(), " was opened");\n'+
  '});\n'+
  '$collapseAnims.bind("closed", function(e, section) {\n'+
  '  console.log(section.$summary.text(), " was closed");\n'+
  '});\n'+
  'collapseInstance.setOptions({\n'+
  '  open: function () {\n'+
  '    this.slideDown(200);\n'+
  '  },\n'+
  '  close: function () {\n'+
  '    this.slideUp(200);\n'+
  '  }\n'+
  '})\n';

  let $result = getSampleTemplate('默认的折叠效果2带动画 WITH custom events `opened`, `closed`', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Collapse.getInstanceName());

  var $collapseAnims = $(".sample-animation");
  var collapseInstance = $collapseAnims.getInstance();

  // if is accordion, each $summery will be invoke once.
  $collapseAnims.bind("opened", function(e, section) {
    console.log(section.$summary.text(), " was opened");
  });

  $collapseAnims.bind("closed", function(e, section) {
    console.log(section.$summary.text(), " was closed");
  });

  collapseInstance.setOptions({
    open: function () {
      this.slideDown(200);
    },
    close: function () {
      this.slideUp(200);
    }
  })
}

function renderSample3() {

  let $renderTo = getMountNode();

  let demoCode =
  '<div data-collapse=\'{"clickQuery":"button.btn"}\'>\n'+
  '  <div><button class="btn btn-primary">Menu <i class="glyph-icon glyph-bars"></i></button></div>\n'+
  '  <nav>\n'+
  '    <ul id="collapse-nav" class="nav collapse">\n'+
  '      <li><a href="">开始使用</a></li>\n'+
  '      <li><a href="">CSS 介绍</a></li>\n'+
  '      <li class="active"><a href="">JS 介绍</a></li>\n'+
  '      <li><a href="">功能定制</a></li>\n'+
  '    </ul>\n'+
  '  </nav>\n'+
  '</div>';

  let scriptCode = '//no javascript need';

  let $result = getSampleTemplate('自定义Trigger', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Collapse.getInstanceName());


}
module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();

    renderSample2();

    renderSample3();
  }
};
