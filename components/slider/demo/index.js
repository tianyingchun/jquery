var $ = require('jquery');
var NivoSlider = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');
// loading dark theme.
require('../themes/dark/dark.css');
var docIntroduce =
  '<h1> NivoSlider JS 交互 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/slider" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>Doc: http://docs.dev7studios.com/jquery-plugins/nivo-slider</p>'+
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
    '  effect: \'random\',                 // Specify sets like: \'fold,fade,sliceDown\'\n'+
    '  slices: 15,                     // For slice animations\n'+
    '  boxCols: 8,                     // For box animations\n'+
    '  boxRows: 4,                     // For box animations\n'+
    '  animSpeed: 500,                 // Slide transition speed\n'+
    '  pauseTime: 3000,                 // How long each slide will show\n'+
    '  startSlide: 0,                     // Set starting Slide (0 index)\n'+
    '  directionNav: true,             // Next & Prev navigation\n'+
    '  controlNav: true,                 // 1,2,3... navigation\n'+
    '  controlNavThumbs: false,         // Use thumbnails for Control Nav\n'+
    '  pauseOnHover: true,             // Stop animation while hovering\n'+
    '  manualAdvance: false,             // Force manual transitions\n'+
    '  prevText: \'Prev\',                 // Prev directionNav text\n'+
    '  nextText: \'Next\',                 // Next directionNav text\n'+
    '  randomStart: false,             // Start on a random slide\n'+
    '  beforeChange: function(){},     // Triggers before a slide transition\n'+
    '  afterChange: function(){},         // Triggers after a slide transition\n'+
    '  slideshowEnd: function(){},     // Triggers after all slides have been shown\n'+
    '  lastSlide: function(){},         // Triggers when last slide is shown\n'+
    '  afterLoad: function(){}         // Triggers when slider has loaded\n'+
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
   '<div style="width: 80%" class="slider-wrapper theme-default">\n'+
   '    <div id="slider" data-slider class="nivoSlider">\n'+
   '        <img src="http://localhost:4001/public/assets/slider/toystory.jpg" data-thumb="http://localhost:4001/public/assets/slider/toystory.jpg" alt="" />\n'+
   '        <a href="http://dev7studios.com"><img src="http://localhost:4001/public/assets/slider/up.jpg" data-thumb="http://localhost:4001/public/assets/slider/up.jpg" alt="" title="This is an example of a caption" /></a>\n'+
   '        <img src="http://localhost:4001/public/assets/slider/walle.jpg" data-thumb="http://localhost:4001/public/assets/slider/walle.jpg" alt="" data-transition="slideInLeft" />\n'+
   '        <img src="http://localhost:4001/public/assets/slider/nemo.jpg" data-thumb="http://localhost:4001/public/assets/slider/nemo.jpg" alt="" title="#htmlcaption" />\n'+
   '    </div>\n'+
   '    <div id="htmlcaption" class="nivo-html-caption">\n'+
   '        <strong>This</strong> is an example of a <em>HTML</em> caption with <a href="#">a link</a>.\n'+
   '    </div>\n'+
   '</div>';

  let scriptCode = '// nothing'

  let $result = getSampleTemplate('默认皮肤theme-default ', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(NivoSlider.getInstanceName());

}

function renderSample2() {
  let $renderTo = getMountNode();

  let demoCode =
    '<div style="width: 80%" class="slider-wrapper theme-dark">\n'+
   '    <div id="slider" data-slider=\'{"controlNavThumbs":true, "directionNav": false, "manualAdvance": true}\' class="nivoSlider">\n'+
   '        <img src="http://localhost:4001/public/assets/slider/toystory.jpg" data-thumb="http://localhost:4001/public/assets/slider/toystory.jpg" alt="" />\n'+
   '        <a href="http://dev7studios.com"><img src="http://localhost:4001/public/assets/slider/up.jpg" data-thumb="http://localhost:4001/public/assets/slider/up.jpg" alt="" title="This is an example of a caption" /></a>\n'+
   '        <img src="http://localhost:4001/public/assets/slider/walle.jpg" data-thumb="http://localhost:4001/public/assets/slider/walle.jpg" alt="" data-transition="slideInLeft" />\n'+
   '        <img src="http://localhost:4001/public/assets/slider/nemo.jpg" data-thumb="http://localhost:4001/public/assets/slider/nemo.jpg" alt="" title="#htmlcaption" />\n'+
   '    </div>\n'+
   '    <div id="htmlcaption" class="nivo-html-caption">\n'+
   '        <strong>This</strong> is an example of a <em>HTML</em> caption with <a href="#">a link</a>.\n'+
   '    </div>\n'+
   '</div>';

  let scriptCode =
   ''

  let $result = getSampleTemplate('黑色皮肤theme-dark', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(NivoSlider.getInstanceName());


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
