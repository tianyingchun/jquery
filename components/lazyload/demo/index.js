var $ = require('jquery');
var Lazyload = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 图片延迟加载Lazyload <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/lazyLoad" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>该插件在较长的页面中延迟加载图片。视窗外的图片会延迟加载，直到它们由于用户滚动而出现到视窗中。可以将它看做图像预加载技术的反向运用。</p>'+
  '<p>在包含很多大图片且较长页面中使用延迟加载，能使页面载入更快。浏览器在只加载可见区域的图片后就达到绪状态。在某些情况下，它也能帮助减少服务器端的负载。</p>'+
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
  '  // number \n'+
  ' threshold: 0,\n'+
  ' // the lazy item selector\n'+
  ' lazy_item_selector: \'.lazy\',\n'+
  ' // number\n'+
  ' failure_limit: 0,\n'+
  ' event: \'scroll\',\n'+
  ' effect: \'show\',\n'+
  ' effect_params: null,\n'+
  ' container: w,\n'+
  ' data_attribute: \'original\',\n'+
  ' data_srcset_attribute: \'original-srcset\',\n'+
  ' skip_invisible: true,\n'+
  ' appear: emptyFn,\n'+
  ' load: emptyFn,\n'+
  ' vertical_only: false,\n'+
  ' // number\n'+
  ' check_appear_throttle_time: 300,\n'+
  ' url_rewriter_fn: emptyFn,\n'+
  ' no_fake_img_loader: false,\n'+
  ' placeholder_data_img: \'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC\',\n'+
  ' // for IE6,7 that does not support data image\n'+
  ' placeholder_real_img: \'http://ditu.baidu.cn/yyfm/lazyload/0.0.1/img/placeholder.png\'\n'+
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
    '<div class="container" data-lazyload=\'{"threshold": 30}\' id="image-lazyload">\n'+
    '  <img class="lazy img-responsive" data-original="http://img0.bdstatic.com/img/image/shouye/mingxing1019.jpg" width="400" height="200" alt="BMW M1 Hood"><br/>\n'+
    '  <img class="lazy img-responsive" data-original="img/bmw_m1_side.jpg" width="400" height="200" alt="BMW M1 Side"><br/>\n'+
    '  <img class="lazy img-responsive" data-original="img/viper_1.jpg" width="400" height="200" alt="Viper 1"><br/>\n'+
    '  <img class="lazy img-responsive" data-original="img/viper_corner.jpg" width="400" height="200" alt="Viper Corner"><br/>\n'+
    '  <img class="lazy img-responsive" data-original="img/bmw_m3_gt.jpg" width="400" height="200" alt="BMW M3 GT"><br/>\n'+
    '  <img class="lazy img-responsive" data-original="img/corvette_pitstop.jpg" width="400" height="200" alt="Corvette Pitstop"><br/>\n'+
    '</div>';

  let scriptCode ='';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  var $lazyload = $result.find('[data-lazyload]');

  UI.run(Lazyload.getInstanceName());

  var instance = $lazyload.getInstance();

  instance.setOptions({
    load: function ($element) {
      console.log($element);
    }
  });
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
