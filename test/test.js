/**
 * test
 */
define(function(require, exports, module){
    require('qunit');
    require('sinon');

    var _ = require('underscore');
    var $ = require('jquery');

    // QUit样式
    // 默认样式
    require('test/qunit/1.10.0/qunit.css');
    // 新主题
    //require('test/themes/ninja.css');

    // 读取当前目录下的case.json
    $.ajax({
        url : "/Zonda/test/case.json",
        dataType : "JSON",
        success : function ( caseList ) {
            _.each( caseList, function( cell ) {
                require.async( cell.path );
            });

        }
    }); // END ajax

});