var $ = require('jquery');
var Tasb = require('../index');
var  { UI } = require('../../core');
var { template } = require('../../../utils');

var docIntroduce =
  '<h1> 栏目切换Tasb <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/tabs" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
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
  '  autoRotate: true,\n'+
  '  rotateDelay: 2000,\n'+
  '  activeIndex: 0,\n'+
  '  headerItemSelector: ".tabs-nav > li",\n'+
  '  contentItemSelector: ".tabs-bd >.tab-panel",\n'+
  '  launchOnMouseEnter: true\n'+
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
  '<div class="tabs" data-tabs=\'{"autoRotate": false, "launchOnMouseEnter": false}\'>'+
    '<ul class="tabs-nav nav nav-tabs">\n'+
    '  <li class="active"><a href="#tab1">Gallery</a></li>\n'+
    '  <li><a href="#tab2">Submit</a></li>\n'+
    '  <li><a href="#tab3">Resources</a></li>\n'+
    '  <li><a href="#tab4">Contact</a></li>\n'+
    '</ul>\n'+
    '<div class="tabs-bd">\n'+
    '  <div id="tab1" class="tab-panel active">\n'+
    '    <h2>Gallery</h2>\n'+
    '    <h3><a href="#">www.htmldrive.net</a></h3>\n'+
    '    <p>Saw polecat than took bankrupt good hillbilly stew, crazy, fancy and hillbilly heap rodeo, pappy. Thar range saw me him sherrif nothi shotgun driveway. Promenade catfight fart fiddle jiggly gonna tarnation, fence, what quarrel dirty, if. Pot grandma crop kinfolk jezebel diesel coonskin hoosegow wirey fixinndlord. </p>\n'+
    '    <p>Smokin driveway wrestlingo darn truck moonshine wirey cow grandpa saw, coonskin bull, java, huntin. </p>\n'+
    '    <p>Stinky yonder pigs in, rustle kinfolk gonna marshal sittin wagon, grandpa. Ya them firewood buffalo, tobaccee cabin.</p>\n'+
    '  </div>\n'+
    '  <div id="tab2" class="tab-panel">\n'+
    '    <h2>Submit</h2>\n'+
    '    <h3><a href="#">www.htmldrive.net</a></h3>\n'+
    '    <p>Grandma been has bankrupt said hospitality fence everlastinwrestlin rodeo redblooded chitlins marshal. Boobtube soap her hootch lordy cow, rattler. </p>\n'+
    '    <p>Rottgut havin ignorant go, hee-haw shiney jail fetched hillbilly havin. Bacon no cowpoke tobaccee horse water rightly trailer tools git hillbilly. </p>\n'+
    '    <p>Jezebel had whiskey snakeoil, askin weren, skanky aunt townfolk fetched. Fit tractor, the</p>\n'+
    '  </div>\n'+
    '  <div id="tab3" class="tab-panel">\n'+
    '    <h2>Resources</h2>\n'+
    '    <h3><a href="#">www.htmldrive.net</a></h3>\n'+
    '    <p>Dirt tools thar, pot buffalo put jehosephat rent, ya pot promenade. Come pickled far greasy fightin wirey, it poor  ou  dogs backwoods, city-slickers me afford boxcar fat, dumb sittindrive rustle slap, tornado. Fuss stinky knickers whomcity-slickers sherrif darn ignorant tobaccee round-up old buckshot that. </p>\n'+
    '    <p>Deep-fried over shootin work cowpoke poor, wuz, whiskey got wirey that. Shot beer, broke hot gritts. Drunk, em moonshine his commenci e. Fer tonic boxcar li.</p>\n'+
    '  </div>\n'+
    '  <div id="tab4" class="tab-panel">\n'+
    '    <h2>Contact</h2>\n'+
    '    <h3><a href="#">www.htmldrive.net</a></h3>\n'+
    '    <p>Grandma been has bankrupt said hospitality fence everlast rodeo redblooded chitlins marshal. Boobtube soap her hootch lordy cow, rattler. </p>\n'+
    '    <p>Rottgut havi gnorant go, hee-haw shiney jail fetched hillbilly h Bacon no cowpoke tobaccee horse water rightly trailer tools git hillbilly. </p>\n'+
    '    <p>Jezebel had whiskey snakeoil, a , skanky aunt townfolk fetched. Fit tractor, them broke aski  rattler fell heffer, been tax-collectors buffalo. Quarrel confounded fence wagon trailer, moonshine wuz, city-sl  </p>\n'+
    '  </div>\n'+
    '</div>\n'+
  '</div>';

  let scriptCode = ''


  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Tasb.getInstanceName());

}

module.exports = {
  render: function () {

    // render introductions.
    renderIntroductions();

    // render sample1.
    renderSample1();
  }
};
