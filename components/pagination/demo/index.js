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
  '  total: 0, // total record, default is 0.\n'+
  '  current: 1, // default is page 1\n'+
  '  pageSize: 10,\n'+
  '  prefixCls: \'pagination\', // the root prefix class.\n'+
  '  className: \'\', // if is \'min\' it\'s smallest pagination size button\n'+
  '  onChange: $.noop, // page number changed callback\n'+
  '  showQuickJumper: false, // The value indicates if we can quick jump to pageNumber\n'+
  '  simple: \'\' //if have value of this property, display simple pagination.\n'+
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
    '<div data-pagination=\'{"simple": true, "current": 5, "pageSize": 10, "total": 100}\'>....</div>';

  let scriptCode =
   '// dynamic set onChange callback, method 1\n'+
   'var paginationInstance = $pagination.getInstance();\n'+
   'paginationInstance.setOptions({\n'+
   '  onChange: function (page) {\n'+
   '    console.log(\'current page: \', page);\n'+
   '  }\n'+
   '})';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  var $pagination = $result.find('[data-pagination]');

  UI.run(Pagination.getInstanceName());

  //dynamic set onChange callback, method 1

  var paginationInstance = $pagination.getInstance();
  paginationInstance.setOptions({
    onChange: function (page) {
      console.log('current page: ', page);
    }
  })

}

function renderSample2() {

  let $renderTo = getMountNode();

  let demoCode =
    '<div data-pagination=\'{"simple": false, "current": 5, "pageSize": 10, "total": 100, "showQuickJumper": true, "showSizeChanger": true}\'>....</div>';

  let scriptCode =
   '// dynamic set onChange callback, method 1\n'+
   '$pagination.pagination(\'setOptions\', {\n'+
   '  onChange: function (page) {\n'+
   '    console.log(\'current page: \', page);\n'+
   '  }\n'+
   '});\n';

  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  var $pagination = $result.find('[data-pagination]');

  UI.run(Pagination.getInstanceName());

  // dynamic set onChange callback, method 1
  $pagination.pagination('setOptions', {
    onChange: function (page) {
      console.log('current page: ', page);
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
    renderSample2();

  }
};
