var $ = require('jquery');
var Popup = require('../index');
var { UI } = require('../../core');
var { template } = require('../../../utils');
var dialog = Popup.dialog;

var docIntroduce =
  '<h1> 轻量级的Popup弹窗框组件 <a target="_blank" href="https://github.com/tianyingchun/jquery/tree/master/components/popup" title="查看组件源码"><i class="glyph-icon glyph-github2"></i></a></h1>'+
  '<p>Popup是一个轻量级jQuery模态弹出组件</p>'+
  '<p>它不会创建或风格弹出但为您提供所有的逻辑定心、模态叠加、事件等等。它给你很多机会来定制它会满足您的需要</p>'+
  '<hr />'+
  '<h2>组件演示 Demos</h2>'
  ;

function getMountNode () {
  let $renderTo = $(".right-main .doc-content");
  return $renderTo;
}

function renderIntroductions() {
  let $renderTo = getMountNode();
  $renderTo.html('').append($(docIntroduce));
}

function getSampleTemplate(title, data) {
  var sampleTpl =
    '<h3><%= title%></h3>'+
    '<div class="mount-node"><%:= demoCode%><span class="output"></span></div>'+
    '<div class="doc-code demo-highlight">'+
    '  <strong> Configuration</strong>'+
    '  <pre>'+
    '     <code class="javascript"><%= config %></code>'+
    '  </pre>'+
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
    config: data.config || '',
    demoCode: data.demoCode,
    scriptCode: data.scriptCode
  }));
}

function renderSample1() {

  let $renderTo = getMountNode();

  let demoCode =
    '<button class="popup-open btn btn-primary">Open Popup</button>\n'+
    '<div id="popup1" data-popup=\'{"modalClose": true, "domReadyShow": false}\' class="popup">\n' +
    '   <div class="popup-dialog">\n' +
    '       <div class="popup-hd">\n' +
    '           <span class="close"><i>X</i></span>\n' +
    '       </div>\n' +
    '       <div class="popup-bd">\n' +
    '           <div class="content">111</div>\n' +
    '       </div>\n' +
    '   </div>\n' +
    '</div>';

  let scriptCode =
    '$result.on(\'click\', \'.popup-open\', function () {\n'+
    '  var $popup = $(\'#popup1\');\n'+
    '  var popupInstance = $popup.getInstance();\n'+
    '  popupInstance.show();\n'+
    '});';

  var config =
  '{\n'+
    ' amsl: 50,\n'+
    ' // the value indicate if we auto open popup dialog while DOMReady.\n'+
    ' domReadyShow: false,\n'+
    ' appending: true,\n'+
    ' appendTo: \'body\',\n'+
    ' autoClose: false,\n'+
    ' closeClass: \'close\',\n'+
    ' content: \'ajax\', // ajax, iframe or image\n'+
    ' contentContainer: false,\n'+
    ' easing: \'swing\',\n'+
    ' escClose: true,\n'+
    ' follow: [true, true], // x, y\n'+
    ' followEasing: \'swing\',\n'+
    ' followSpeed: 500,\n'+
    ' iframeAttr: \'scrolling="no" frameborder="0"\',\n'+
    ' loadCallback: false,\n'+
    ' loadData: false,\n'+
    ' loadUrl: false,\n'+
    ' modal: true,\n'+
    ' modalClose: true,\n'+
    ' modalColor: \'#000\',\n'+
    ' onClose: false,\n'+
    ' onOpen: false,\n'+
    ' opacity: 0.7,\n'+
    ' position: [\'auto\', \'auto\'], // x, y,\n'+
    ' positionStyle: \'absolute\', // absolute or fixed\n'+
    ' scrollBar: true,\n'+
    ' speed: 250, // open & close speed\n'+
    ' transition: \'fadeIn\', //transitions: fadeIn, slideDown, slideIn, slideBack\n'+
    ' transitionClose: false,\n'+
    ' zIndex: 9997 // popup gets z-index 9999, modal overlay 9998\n'+
  '}';
  let $result = getSampleTemplate('直接dom data api', {
    demoCode: demoCode,
    config: config,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Popup.getInstanceName());

  $result.on('click', '.popup-open', function () {
    var $popup = $('#popup1');
    var popupInstance = $popup.getInstance();
    popupInstance.show();
  });

}

function renderSample2() {

  let $renderTo = getMountNode();

  let demoCode =
    '<button class="alert-open btn btn-primary">Dialog Alert</button>\n'
    ;
  let scriptCode =
    '// dialog alert open \n'+
    '$result.on(\'click\', \'.alert-open\', function () {\n'+
    '  dialog.alert({\n'+
    '    onOpen: function () {\n'+
    '      $result.find(\'.output\').html(\'on open..\');\n'+
    '    },\n'+
    '    onClose: function () {\n'+
    '      $result.find(\'.output\').html(\'on close..\');\n'+
    '    },\n'+
    '    onActionClicked: function ($btn) {\n'+
    '      $result.find(\'.output\').html($btn.data(\'trigger\'));\n'+
    '      // clicked close dialog.\n'+
    '      this.close();\n'+
    '    }\n'+
    '  });\n'+
    '});\n';

  // render dialog configuration.
  var config =
    '{\n'+
    '  onOpen: false,\n'+
    '  onClose: false,\n'+
    '  onActionClicked: false,\n'+
    '  autoClose: false,\n'+
    '  modal: true,\n'+
    '  modalClose: false,\n'+
    '  classes: "",\n'+
    '  // if equals false, don\'t show header.\n'+
    '  header: {\n'+
    '    showClose: true,\n'+
    '    html: "Your Header"\n'+
    '  },\n'+
    '  body: "Your dialog body",\n'+
    '  // if equals false, don\'t show footer.\n'+
    '  footer: {\n'+
    '    html: \'<button class="btn btn-primary btn-sm btn-popup" data-trigger="ok">确定</button>\'\n'+
    '  }\n'+
    '}';

  let $result = getSampleTemplate('Dialog alert', {
    demoCode: demoCode,
    config: config,
    scriptCode: scriptCode
  });


  $renderTo.append($result);

  UI.run(Popup.getInstanceName());

  $result.on('click', '.alert-open', function () {
    dialog.alert({
      onOpen: function () {
        $result.find('.output').html('on open..');
      },
      onClose: function () {
        $result.find('.output').html('on close..');
      },
      onActionClicked: function ($btn) {
        $result.find('.output').html($btn.data('trigger'));

        // clicked close dialog.
        this.close();
      }
    });
  });

}

function renderSample3() {

  let $renderTo = getMountNode();

  let demoCode =
    '<button class="confirm-open btn btn-primary">Dialog Confirm</button>'
    ;
  let scriptCode =
    '// for dalog confirm....\n'+
    '$result.on(\'click\', \'.confirm-open\', function () {\n'+
    '  dialog.confirm({\n'+
    '    onOpen: function () {\n'+
    '      $result.find(\'.output\').html(\'on open..\');\n'+
    '    },\n'+
    '    onClose: function () {\n'+
    '      $result.find(\'.output\').html(\'on close..\');\n'+
    '    },\n'+
    '    onConfirm: function ($target) {\n'+
    '      $result.find(\'.output\').html(\'on confirm()...\' + $target.data("trigger"));\n'+
    '      // clicked close dialog.\n'+
    '      this.close();\n'+
    '    },\n'+
    '    onCancel: function ($target) {\n'+
    '      $result.find(\'.output\').html(\'on onCancel()...\' + $target.data("trigger"));\n'+
    '      this.close();\n'+
    '    }\n'+
    '  });\n'+
    '});';

  var config =
  '{\n'+
    '  onOpen: false,\n'+
    '  onClose: false,\n'+
    '  onConfirm: false,\n'+
    '  onCancel: false,\n'+
    '  onActionClicked: false,\n'+
    '  autoClose: false,\n'+
    '  modal: true,\n'+
    '  modalClose: false,\n'+
    '  classes: "",\n'+
    '  // if equals false, don\'t show header.\n'+
    '  header: {\n'+
    '    showClose: true,\n'+
    '    html: "Your Header"\n'+
    '  },\n'+
    '  body: "Your dialog body",\n'+
    '  // if equals false, don\'t show footer.\n'+
    '  footer: {\n'+
    '    html: \'<button class="btn btn-primary btn-sm btn-popup" data-trigger="ok">确定</button>\'\n'+
    '  }\n'+
    '}';
  let $result = getSampleTemplate('Dialog confirm', {
    demoCode: demoCode,
    config: config,
    scriptCode: scriptCode
  });

  $renderTo.append($result);

  UI.run(Popup.getInstanceName());

  // for dialog confirm
  $result.on('click', '.confirm-open', function () {
    dialog.confirm({
      onOpen: function () {
        $result.find('.output').html('on open..');
      },
      onClose: function () {
        $result.find('.output').html('on close..');
      },
      onConfirm: function ($target) {
        $result.find('.output').html('on confirm()...' + $target.data("trigger"));

        // clicked close dialog.
        this.close();
      },
      onCancel: function ($target) {
        $result.find('.output').html('on onCancel()...' + $target.data("trigger"));
        this.close();
      }
    });
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

    renderSample3();

  }
};
