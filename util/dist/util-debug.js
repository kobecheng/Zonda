// route.module.js
// ---------------
// DOM 路由器
// 但是对于路由来说，加载是一个自动的的过程，需要使用变量
// 于是使用 eval('require("' + a + '")') 实现
// 性能会受到很大的影响，先实现，再优化，或者再废弃这种方式
//
// 兼容Niko的方案，采用回调函数的形式执行
// 代码示例如下:
/**
Util.route({
	'#index' : function(){
		require.async('../app/index/-debug');
	},
	'#header' : function(){
		require.async('../app/header/-debug');
	}
});
*/

define("#util/0.1.1/route/route-debug", ["#jquery/1.8.2/jquery-debug", "#underscore/1.4.2/underscore-debug"], function ( require, exports, module) {
    return function ( ruler ) {
        var $ = require('#jquery/1.8.2/jquery-debug');
        var _ = require('#underscore/1.4.2/underscore-debug');

        _.each( ruler, function ( action, selector ) {
            // 传入callback形式
            if ( $(selector)[0] && _.isFunction(action) ) {
                action();
            // 传入字符串，将在app目录下寻找文件，异步加载
            } else if ( $(selector)[0] && _.isString(action) ) {
                require.async( '../app/' + action );
            } // END if
        });

    }; // END return

});

/**
 * cookie模块
 * author: niko.yerya
 * ******************************************************************************
 * 代码示例
 *
 * var cookie = require('path/cookie.module-debug');
 *	
 * 设置cookie 还可跟其他参数，请详见方法注释
 * cookie.setCookie("name","yerya");
 *
 * 读取cookie
 * cookie.getCookie("name");
 *
 * 删除cookie
 * cookie.removeCookie("name");
 * 
 * 删除所有cookie
 * cookie.removeAll();
 *
 * ******************************************************************************
 *
 */

define("#util/0.1.1/cookie/cookie-debug", [], function ( require, exports, module ) {

	var dom = document;

	//除去空白的工具函数
	function trim ( cookie ) {
		return cookie.replace(/^[\s]+|[\s]+$|(;)[\s]+|(=)[\s]+/,'$1');
	}

	//获取cookie值
	function getCookie ( name ) {

		//通过在docuemnt.cookie返回的所有cookie中以indexOf方法获取参数名称对应的值
		//其中 encodeURIComponent 在每次setCookie的时候都编码了，所以这里也需要编码查找
		var	cookieName = encodeURIComponent( name ) + "=",
			cookieStart = dom.cookie.indexOf( cookieName ),
			cookieValue = null;

			if ( cookieStart > -1 ) {
				var cookieEnd = dom.cookie.indexOf( ";", cookieStart );
				if ( cookieEnd == -1 ) {
					cookieEnd = dom.cookie.length;
				}
				cookieValue = decodeURIComponent( dom.cookie.substring( cookieStart + cookieName.length, cookieEnd ) );
			}

			return cookieValue;

	}//end getCookie

	//设置cookie( 名称 值 期限 URL路径 可选的域 布尔是否添加secure ),头两个参数必须
	function setCookie ( name, value, expires, path, domain, secure ) {

		var cookieText = encodeURIComponent( name ) + "=" + encodeURIComponent( value );

		if ( expires instanceof Date ) {
			cookieText += "; expires=" + expires.toGMTString();
		}

		if ( path ) {
			cookieText += "; path=" + path;
		}

		if ( domain ) {
			cookieText += "; domain=" + domain;
		}

		if ( secure ) {
			cookieText += "; secure"
		}

		dom.cookie = cookieText;
	}//end setCookie

	//删除cookie值，将cookie时间设置为0即可
	function removeCookie ( name, path, domain, secure ) {
		setCookie( name, "", new Date(0), path, domain, secure );	
	}

	//删除所有cookie
	function removeAllCookie () {

		var cookieText = dom.cookie,	
			arr = cookieText.split("=");

		for ( var i=arr.length; i--; ) {
			var newArr = arr[i].split(';');	
			if ( newArr.length > 1 ) {
				removeCookie( trim ( newArr[1] ) );
			} else {
				removeCookie( trim ( newArr[0] ) );
			}
		}

	}//end removeAllCookie

	//对外接口
	module.exports = {
    	set: setCookie,
    	get: getCookie,
    	remove: removeCookie,
    	removeAll: removeAllCookie	
  	};

});

// gif.module.js
// -------------
// gif 加载示意
// 可复用

define("#util/0.1.1/gif/gif-debug", ["#jquery/1.8.2/jquery-debug"], function( require, exports, module) {
    seajs.importStyle('#ajax-loader{width:76px;height:30px;display:none;padding-left:35px;margin-left:-35px;background:#545454 url("/Zonda/images/load.gif") no-repeat;background-position:7px 7px;position:fixed;top:15%;left:50%;z-index:1000;box-shadow:0 0 5px rgba(0,0,0,.2);border-radius:5px;line-height:30px;color:#fff;font-size:14px}', '#util/0.1.1/gif/gif');

    var $ = require('#jquery/1.8.2/jquery-debug');

    // 增加配置
    var main = function ( config ) {
        try {
            // 清掉之前的ajax-loader
            $("#ajax-loader").remove();
        } catch (e) {
        }

        $(document.body).append(
            '<div id="ajax-loader" style="display: none;">Loading ...</div>'
        );

        // 含有配置，采用配置
        if ( config && config.css ) {
            $("#ajax-loader").css( config.css );
        }
    };

    main.open = function () {
        $("#ajax-loader").fadeIn('fast');
        return this;
    };

    main.close = function () {
        $("#ajax-loader").fadeOut('slow');
        return this;
    };

    main();

    // API
    module.exports = main;

});

// dialog.module.js
// ----------------
// 基于Bootstrap的对话框封装
//
// 依赖 bootstrap,jquery
// 默认dialog模板为bootstrap modal模板
//
// Usage:
/**
var Util = require('util-debug');

// 配置
Util.dialog({
    title : 'dialog标题' ,
    content : 'dialog内部html或者文本', // 这里将会向dialog内部嵌入编译好的HTML
    button : {  // 按钮，会实例化为按钮对象，绑定点击事件到后面的callback
         '提交' : function() {...},
         '更多' : function() {...}
         // ...
    },
    css : {
        height: 200,
        color: '#fff'
    } // 传入css，API参照jQuery $('#sel').css()
});

// 打开dialog
Util.dialog.open();

// 关闭dialog
Util.dialog.close();

// 延时1300毫秒关闭
Util.dialog.close(1300);

// 链式调用
Util.dialog.open().close(1300);

*/

define("#util/0.1.1/dialog/dialog-debug", ["#bootstrap/2.2.1/bootstrap-debug", "#jquery/1.8.2/jquery-debug", "#underscore/1.4.2/underscore-debug"], function( require, exports, module ){
    var $ = require('#bootstrap/2.2.1/bootstrap-debug');
    var _ = require('#underscore/1.4.2/underscore-debug');

    // 准备模板
    var dialogTPL = '<div class="modal hide " id="util-dialog" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button> <h3 id="myModalLabel"><%= title %></h3> </div> <div class="modal-body"> <%= content %> </div> <div class="modal-footer"> <button class="btn" data-dismiss="modal" aria-hidden="true">取消</button> </div> </div>';

    // dialog对象构造函数
    var Constructor = function ( config ) {

        // 已存在dialogDOM时，不打开新窗口
        if ( $("#util-dialog:visible")[0] ) {
            return false;
        }

        // 插入对话框
        $(document.body).append(
            _.template( dialogTPL, {
                'title' : config.title,
                'content' : config.content
            }) // 模板编译
        );

        // 自定义css
        if ( config.css ) {
            $("#util-dialog").css( config.css );
        }

        // 动态创建button
        _.each( config.button, function ( callback, buttonName ) {
            // 生成唯一ID
            var uid = _.uniqueId('dialog-button-');

            // 插入<button>
            $("#util-dialog .modal-footer").append(
                '<button id="' + uid + '" class="btn btn-success">' +
                buttonName +
                '</button>'
            );

            // 绑定click事件
            $( "#" + uid ).click( callback );
        });

        // 关闭窗口时摧毁dialog对象
        $("#util-dialog").on( 'hide', function(){
            delete $("#util-dialog").modal;
            $("#util-dialog").remove();
        });

        return this;

    }; // END Constructor

    // 打开窗口方法
    Constructor.open = function () {
        $("#util-dialog").modal({
            'show' : true,
            'backdrop' : false
        });

        // 计算高度，垂直居中
        var outerHeight = $("#util-dialog").outerHeight();

        $("#util-dialog").css({
            'margin-top' : -outerHeight/2
        });

        return this;
    };

    // 关闭窗口方法
    Constructor.close = function ( delay ) {

        if ( delay ) {
            // 延时关闭
            setTimeout(function() {
                $("#util-dialog").modal('hide');
            }, delay);

        } else {
            $("#util-dialog").modal('hide');
        }
    };

    // 返回对话框引用
    Constructor.dom = $("#util-dialog");

    // API
    module.exports = Constructor;

});

// verify.module.js
// ----------------
// 表单验证，for Bootstrap Form
// 使用verification.module作为验证核心，为Bootsrap表单处理DOM
//
// Util.verify('pre','#sel'); 为'#sel'下的input做预验证，绑定change事件
// Util.verify('all','#sel'); 立即验证'#sel'下的所有input做验证，返回布尔值
// verify 的第二个参数'#sel'参数可省略，省略后默认为'body'

define("#util/0.1.1/verify/verify-debug", ["./verification-debug", "#underscore/1.4.2/underscore-debug", "#jquery/1.8.2/jquery-debug"], function ( require, exports, module ) {

    var _ = require('#underscore/1.4.2/underscore-debug');

    var verify = function ( type, scope ) {
        // 默认type值为pre
        if ( type === void 0 ) {
            type = 'pre';
        }

        // 默认scope为body
        if ( scope === void 0 ) {
            scope = 'body';
        }

        // 验证结果
        // 数组，如果该数组含有0则表明某项数据验证失败
        var re = [];

        // 通过表单的ruler检查，并且只检查可见的表单的ruler
        var verify = require('./verification-debug');

        var $ = require('#jquery/1.8.2/jquery-debug');

        // 消息回调函数
        // 作为当前作用域的jQuery对象的扩展
        $.fn.msg = function ( result ) {
            if (  result.status === 0 ) {
                $(this).addClass('error').find('.help-inline').text( result.info );

                // 正在进行全部表单检查出错，则聚焦到此错误表单，并返回false
                if ( type === 'all' ) {
                    // 向结果中加入一个错误标记
                    re.push(0);
                }

            } else {
                $(this).removeClass('error').find('.help-inline').text('');
            }
        }; // END msg

        // 为需要验证的表单项绑定事件
        $( scope ).find(".control-group").each( function () {
            // 只检查“可见”表单的ruler
            var cell = $(this).find("[ruler]:visible");
            var _this = this;

            if ( cell[0] ) {
                // 绑定 change 事件
                cell.live('change', function () {
                    var data = {
                        ruler : cell.attr('ruler'),
                        data  : cell.val()
                    };

                    // 验证数据，并将结果传给消息函数
                    $(_this).msg( verify.check( data ) );

                });
            } // END if

        }); // END each

        // 检查所有表单项目，直到遇到错误的表单，停止，聚焦
        if ( type === 'all' ) {
            // 清空验证结果
            re = [];

            // 遍历所有需要检查的表单
            $( scope ).find(".control-group").each( function () {
                // 只检查“可见”表单的ruler
                var cell = $(this).find("[ruler]:visible");
                var _this = this;

                if ( cell[0] ) {

                    var data = {
                        ruler : cell.attr('ruler'),
                        data  : cell.val()
                    };

                    // 验证数据，并将结果传给消息函数
                    return $(_this).msg( verify.check( data ) );

                } // END if

            }); // END each
        }

        // 结果分析，返回
        if ( _.include( re, 0 ) ) {
            $( scope ).find(".control-group.error").eq(0).find('[ruler]:visible').focus();
            return false;
        } else {
            return true;
        }

    }; // END verify

    // API
    module.exports = verify;

});

/**
 * 数据验证模块 verification.js
 * author : Degas
 *
 * API:
 *  check { Function } : 方法；验证数据，接受并返回以下参数；函数
 *      input { Array/Object } : 接受参数；待验证数据，对象包括以下两个成员；对象或数组
 *          input[i].ruler { String/JSON } : 接受参数；验证规则；JSON字符串
 *          input[i].data { String/Other } : 接受参数；待验证参数；各种格式
 *      output { Object } : 返回参数；验证结果，包括以下两个成员；对象
 *          output.status { Number } : 返回参数；验证通过为‘1’，失败为‘0’；对象成员，数字
 *          output.info { String } : 返回参数；验证信息；对象成员，字符串
 *
 *  验证模块使用方法：
 *
 * 验证规则以JSON字符串的形式写在HTML或TPL中
 *  在需要被验证的input/select的节点上加上属性verification，示例如下：
 *  ruler = "{'required':true,'type':'email'}"
 *  或
 *  ruler = "{'required':true,'type':'select','vacancy':'_0'}"
 *
 *  参数说明：
 *  required 值为true或false，若为true，则此项为必填写项
 *  vacancy 值为某个制定的字符串或者数字，表示此表单已填写的默认值
 *  type 值为email，number，分别验证是否为电子邮箱和数字（数字允许出现‘-’）
 *  type 值为select，则将验证该select是否选择，
 *      此时将当前表单已经填写的数据对比vacancy的值，若值为vacancy默认值，
 *      则表示此select未选择，验证不通过
 */

define("#util/0.1.1/verify/verification-debug", ["#underscore/1.4.2/underscore-debug", "#jquery/1.8.2/jquery-debug"], function ( require, exports, module ) {
    // 加载Underscore模块
    var _ = require('#underscore/1.4.2/underscore-debug');
    
    // 加载jQuery模块
    var $ = require('#jquery/1.8.2/jquery-debug');

    // 数据分类处理，错误信息输出
    // 检查待验证数据格式，为单个数据或一组数据
    var main = function ( input ) {
        // 返回结果
        var result = {};
        var tmp = {};

        try {
            // 一组数据
            if ( _.isArray( input ) ) {
                for ( var i = 0; i < input.length; i++ ) {
                    // 调用check检测
                    tmp = check( input[i].name, input[i].data, input[i].ruler, input[i].title );

                    if ( tmp.status === 0 ) {
                        return tmp;
                    } else {
                        result[ input[i].name ] = input[i].data;
                    }
                } // END for

            // 单个数据
            } else if ( _.isObject( input ) ) {
                // 调用check检测
                tmp = check( input.name, input.data, input.ruler, input.title );

                if ( tmp.status === 0 ) {
                    return tmp;
                } else {
                    result = input;
                }

            } else if ( _.isEmpty( input ) ) {
                throw new Error('待验证数据为空!');
            } else {
                throw new Error('待验证数据格式不正确!');
            }
        } catch (e) {
            if ( typeof console !== undefined ) {
                console.error( e.message );
            } else {
                console = {};
                alert( e.message );
            }
        }

        // 返回数据
        return result;

    };// END  检查数据

    // 验证方法 check
    // 验证规则
    var check = function ( name, data, ruler, title ) {
        var result = {};
        //ruler = eval( '(' + ruler + ')' );
        // 使用JSON方式解析
        ruler = JSON.parse( ruler );

        if ( title === undefined ) {
            title = '';
        }

        // 是否允许为空
        if ( ruler.required && /^\s*$/.test( data ) ) {
            result.info = title + '不能为空';
            result.status = 0;
            return result;
        }

        // 是否允许含有空格
        if ( ruler.noblank && /\s{1,}/.test( data ) ) {
            result.info = title + '此项内容不能包含空格';
            result.status = 0;
            return result;
        }

        // 验证不安全字符
        if ( ruler.xxs && /<{1,}|>{1,}/.test( data ) ) {
            result.info = title + '“<”“>”为非法字符';
            result.status = 0;
            return result;
        }

        // 数据类型为数字
        if ( ruler.type === 'number' && !/^(\d{1,}-){0,}\d*$/.test( data ) ) {
            result.info = title + '格式不是数字';
            result.status = 0;
            return result;
        }

        // 数据类型为手机号码
        if ( ruler.type === 'phone' && !/^\d{11}$/.test( data ) ) {
            result.info = title + '手机号码不正确';
            result.status = 0;
            return result;
        }

        // 数据类型为邮箱
        if ( ruler.type === 'email' && !/^.{1,}@.{1,}\.{1,}\w{1,}$/.test( data ) ) {
            result.info = title + '格式不为Email';
            result.status = 0;
            return result;
        }

        // 验证select表单
        if ( ruler.type === 'select' && ruler.vacancy === data ) {
            result.info = title + '未选择';
            result.status = 0;
            return result;
        }

        // 验证全部通过
        result.status = 1;
        result.info = title + '通过验证';

        return result;
    };// END check

    // API / 对外接口
    module.exports = {
        check : main
    };

});

// state.machine.module.js
// ---------------
// 状态机
//
// Usage:
//
/**
    var Util = require('util-debug');
    var StateMachine = new Util.StateMachine();

    // 主界面状态回调
    var mainView = {
        activate : function () {
            $("#side-bar .table-list").show();
            $("#green-bar ul.green-bar-list").show();
        },
        deactivate : function () {
            $("#side-bar .table-list").hide();
            $("#green-bar ul.green-bar-list").hide();
        }
    };

    // 邮件发送状态回调
    var mailView = {
        activate : function () {
            // 面包屑
            $(".green-bar-list.location .pos").append(
                '<a href="javascript:mainView();">数据管理</a>' +
                '>' +
                '<a href="javascript:;">发送邮件</a>'
            );
        },
        deactivate : function () {
            $("#side-bar .mail").remove();
            $("#lookTable #add-page-wrap").empty();

            // 清除面包屑
            $(".green-bar-list.location .pos").empty();
        }
    };

    // 添加为状态
    StateMachine.add( mainView );
    StateMachine.add( mailView );

    // 加入全局变量，方便在View中调用
    // 这里主要为了快速开发
    window.mailView = mailView.active;
    window.mainView = mainView.active;

*/

define("#util/0.1.1/stateMachine/stateMachine-debug", ["#jquery/1.8.2/jquery-debug"], function ( require, exports, module) {
    var $ = require('#jquery/1.8.2/jquery-debug');

    var Events = {
        bind : function () {
            if ( !this.o ) {
                this.o = $({});
            }

            this.o.bind.apply( this.o, arguments );
        },
        trigger : function () {
            if ( !this.o ) {
                this.o = $({});
            }

            this.o.trigger.apply( this.o, arguments );
        }
    };

    var StateMachine = function() {};

    StateMachine.fn = StateMachine.prototype;

    // 用Events扩展构造器
    $.extend( StateMachine.fn, Events );

    // 添加状态方法
    StateMachine.fn.add = function ( controller ) {
        // 为此状态绑定事件
        this.bind( 'change', function ( e, current ) {
            if ( controller === current ) {
                controller.activate();
            } else {
                controller.deactivate();
            }
        });

        // 激活该状态
        controller.active = $.proxy( function() {
            this.trigger( 'change', controller );
        }, this);

    }; // END add

    // API
    module.exports = StateMachine;

});

// right.click.menu.module.js
// ----------------
// 基于Bootstrap Dropdown Menu的右键菜单封装
//
// 依赖 bootstrap,jquery
// 默认菜单模板为Bootstrap Mrop Menu模板
//
// Usage:
/**
var Util = require('util-debug');

// 配置
Util.rightClickMenu({
    scope : '#sel',
    option : {
        '新建列表' : function () {
            alert(1);
        },
        '删除' : function () {
            alert(2);
        }
    }
});
*/

define("#util/0.1.1/rightClickMenu/rightClickMenu-debug", ["#bootstrap/2.2.1/bootstrap-debug", "#jquery/1.8.2/jquery-debug", "#underscore/1.4.2/underscore-debug"], function( require, exports, module ){
    var $ = require('#bootstrap/2.2.1/bootstrap-debug');
    var _ = require('#underscore/1.4.2/underscore-debug');

    // 插入菜单
    $(document.body).append(
        '<ul id="right-click-menu" class="dropdown-menu" style="display:none;" role="menu" aria-labelledby="dropdownMenu"></ul>'
    );

    // 点击隐藏事件
    $(window).click(function (event) {
        if ( event.button !== 2 ) {
            $("#right-click-menu").empty().hide();
        }
    });

    // 主控制器
    var main = function ( config ) {

        // 右键事件
        $( config.scope ).contextmenu(function (event) {
            event.stopPropagation();

            // 调用菜单控制
            menu(event, config);

            // 禁用浏览器右键
            return false;
        });

    }; // END main

    // 菜单控制
    var menu = function ( event, config ) {

        // 右键事件发生DOM
        var $target = $(event.target);

        // 寻找目标DOM
        $target.parents().each(function () {
            if ( _.include( $(config.target), $(this)[0] ) ) {
                $target = $(this);
            }
        });

        // 右键非选项的DOM，跳出
        if ( !_.include( $(config.target), $target[0] ) ) {
            return false;
        }

        // 显示菜单，并跟随鼠标
        $("#right-click-menu").empty().css({
            'top' : event.clientY,
            'left': event.clientX,
            'display' : 'block'
        });

        // 动态生成菜单选项
        _.each( config.option, function ( callback, optionName ) {
            // 生成唯一ID
            var uid = _.uniqueId('right-click-menu-option-');

            // 插入<button>
            $("#right-click-menu").append(
                '<li><a href="javascript:;" id="' + uid + '" class="right-click-menu-li">' +
                optionName +
                '</a></li>'
            );

            // 事件托管
            $("#right-click-menu").delegate('#'+ uid, 'click', function () {
                event.stopPropagation();
                $("#right-click-menu").hide().undelegate('click');

                // 执行选项回调
                callback( $target );
            });

        }); // END 动态生成

    }; // END 菜单控制

    // API
    module.exports = main;

});

// ajax.module.js
// --------------
// 封装jQuery的ajax API

define("#util/0.1.1/ajax/ajax-debug", ["../dialog/dialog-debug", "#jquery/1.8.2/jquery-debug", "#bootstrap/2.2.1/bootstrap-debug", "#underscore/1.4.2/underscore-debug"], function( require, exports, module ) {
    var $ = require('#jquery/1.8.2/jquery-debug');
    var dialog = require('../dialog/dialog-debug');

    $.ajaxSetup({
        type : 'POST',
        dataType : "JSON",
        error : function (error) {
            dialog({
                title : '发生错误了！！',
                content : error.responseText
            });

            //dialog.open();
        }
    });

    // API
    module.exports = $.ajax;

});

/**
 * slide.js
 * 幻灯片模块
 *
 * init: 方法，初始化slide实例，若需要page，则生成page，配置完毕后，须执行初始化init
 *
 * play: 方法，自动播放幻灯片
 * pause: 方法，停止播放幻灯片
 *
 * next: 方法，下一个
 * prev: 方法，上一个
 *
 * 配置参数如下：
 * slideDOM: DOM，必须参数，除此之外的配置参数为可选，
 *           作为slide的<ul>，该<ul>下的所有<li>将作为幻灯片播放
 *
 * slideLength: Number，幻灯片数目
 *
 * speed: Number，毫秒数，切换的速度
 *
 * pageDOM: DOM，将作为slide的页码的<ul>，
 *          模块会根据slideDOM的<ul>中的<li>的数量自动生成Page<li>插入到pageDOM中
 *
 * pageNum: true/false，是否在page上显示页码数字
 *
 * pageThumb : true/false, 是否在page上显示幻灯片缩略图
 *
 * animation: String，动画方式
 *
 * cutover : true/false，是否在page中加上“上一个”和“下一个”按钮
 *
 * ******************************************************************************
 * 代码示例
 *
 * var slide = require('path/slide.module-debug');
 *
 * 配置
 * slide.config = {
 *  slideDOM : document.getElementById('slider'),
 *  pageDOM  : document.getElementById('page'),
 *  speed    : 1200,
 *  ...
 * }
 *
 * 配置完毕，初始化
 * slide.init();
 *
 * 绑定事件
 * $("#play").click( function() {
 *  slide.play();
 * });
 *
 * ******************************************************************************
 *
 * 如果在页面上有多个slide，则使用下面的方法获得多个slide实例
 * seajs.use( 'path/slide.module', function ( slide ) {
 *
 *  slide.config = {
 *      ...
 *  };
 *
 *  slide.init();
 *
 *  ...
 *
 * });
 *
 */
define("#util/0.1.1/slide/slide-debug", ["#underscore/1.4.2/underscore-debug", "#easing/1.3.0/easing-debug", "#jquery/1.8.2/jquery-debug"], function ( require, exports, module ) {
    var _ = require('#underscore/1.4.2/underscore-debug');
    var $ = require('#easing/1.3.0/easing-debug');

    // 配置,初始置为空
    exports.config = {};

    // 必须的参数
    var need = {
        slideDOM : ''
    };

    // 默认配置 / 模块内部缓存配置
    var _config = {
        speed     : 2000,
        pageDOM   : null,
        pageNum   : false,
        pageThumb : false,
        animation : 'fade',
        cutover   : false
    };

    /**
     * 检查配置，并重写配置
     */
    var checkConfig = function ( ) {
        // 当配置改变时，重新检查配置
        if ( _.isEqual( _config, exports.config ) ) {
            return false;
        } else {
            // 将当前配置与默认/缓存配置合并
            _.extend( _config, exports.config );

            // 将合并的配置保存到当前配置中
            exports.config = _config;
        }

        // 检查是否包含必须的配置项
        try {
            _.each( need, function ( em, key ) {
                if ( !_.has( exports.config, key ) ) {
                    throw new Error('Slide模块未配置' + key );
                }
            });

        } catch (e) {
            if ( window.console !== undefined ) {
                console.error( e.message );
            } else {
                alert( e.message );
            }
        }

    }; // END checkConfig

    // 是否停止自动播放
    var autoPlay = true;

    // 计时器
    var timer;

    // 当前页码
    var onPage = -1;

    // 缓存幻灯片以及幻灯片页码的jQuery对象
    var slideArr;
    var pageArr;

    // Play 方法
    exports.play = function ( page ) {
        // 计数器置空
        clearTimeout( timer );

        // 传入了page参数，则跳到page指定的幻灯片
        if ( page !== undefined ) {
            // 将当前页码置为传入的page
            onPage = Math.abs( page );

            // 显示幻灯片
            // 根据选择的效果不同，采用不同的方式渲染
            // 淡入淡出 fade
            if ( exports.config.animation === 'fade' ) {
                slideArr.fadeOut('slow');
                slideArr.eq( onPage ).stop().fadeIn('slow');
            // 淡出后，再淡入
            } else if ( exports.config.animation === 'callBackFade' ) {
                slideArr.fadeOut('fast', function () {
                    slideArr.eq( onPage ).fadeIn('fast');
                });
            // 滑动效果
            } else if ( exports.config.animation === 'slip' ) {

                slideArr.eq( onPage -1 ).stop().animate({
                    "left" : "-=960px",
                    "opacity" : "0"
                }, 500);

                slideArr.eq( onPage ).css({
                    "left" : "960px",
                    "opacity" : "0"
                });

                slideArr.eq( onPage ).stop().animate({
                    "left" : "-=960px",
                    "opacity" : "100"
                }, 1500);
            // 未实现的效果，则直接hide/show
            } else {
                slideArr.hide();
                slideArr.eq( onPage ).show();
            }

            if ( pageArr ) {
                // 当前页码加亮
                pageArr.removeClass('on');
                pageArr.eq( onPage ).addClass('on');
            }

        // 无参数，则从onPage对应的幻灯片开始
        } else {
            // 幻灯片播放到最后一张时，跳至第一张
            if ( onPage === (exports.slideLength -1) ) {
                exports.play( 0 );
            } else {
                // 播放下一张
                onPage = onPage +1;

                exports.play( onPage );
            }

            // 不执函数体末尾的延时递归
            return false;
        }

        // 如果当前幻灯片为开头或末尾，则“next”和“prev”按钮加上class
        if ( onPage === 0 && exports.config.cutover ) {
            $( exports.config.pageDOM ).find('.prev').addClass('beginning');
            $( exports.config.pageDOM ).find('.next').removeClass('end');
        } else if ( onPage === (exports.slideLength -1) && exports.config.cutover ) {
            $( exports.config.pageDOM ).find('.next').addClass('end');
            $( exports.config.pageDOM ).find('.prev').removeClass('beginning');
        } else {
            $( exports.config.pageDOM ).find('.prev').removeClass('beginning');
            $( exports.config.pageDOM ).find('.next').removeClass('end');
        }

        // 自动播放，切换速度按照配置执行
        if ( autoPlay ) {
            timer = setTimeout( function () {
                exports.play();
            }, exports.config.speed );
        }

    }; // END play

    // stop 方法
    exports.stop = function () {

        autoPlay = false;

        // 停止回调play方法
        clearTimeout( timer );

    }; // END stop

    // pause 方法
    // 防止在较短的时间内多次调用
    exports.pause = function () {

        if ( autoPlay ) {
            autoPlay = false;

            // 停止回调play方法
            clearTimeout( timer );
        } else {
            autoPlay = true;

            exports.play();
        }

    }; // END pause

    // Next 方法
    exports.next = function () {
        // 当前显示的幻灯片不为最后一张时，onPage加1
        if ( onPage !== (exports.slideLength -1) ) {
            onPage = onPage +1;
        }

        exports.play( onPage );
    }; // END next

    // Prev 方法
    exports.prev = function () {
        // 不为第一张时，onPage减1
        if ( onPage !== 0 ) {
            onPage = onPage -1;
        }

        exports.play( onPage );
    }; // END prev

    /**
     * init 方法
     * 初始化slide
     */
    exports.init = function () {
        // 检查配置
        checkConfig();

        // 将幻灯片个数缓存到模块配置中
        exports.slideLength = $( exports.config.slideDOM ).find('>li').size();

        // 缓存单张幻灯片的jQuery对象
        slideArr = $( exports.config.slideDOM ).find('>li');

        // 当传入了page的DOM并且幻灯片数量大于1时，生成page，next，prev
        if ( exports.config.pageDOM !== null && exports.slideLength > 1 ) {
        
            // 生成slide page
            var li;

            slideArr.each( function (i) {
                if ( exports.config.pageNum ) {
                    // 有页码的page
                    li = '<li><a class="slide-page-cell" page="' + i + '">' + i + '</a></li>';
                } else if ( exports.config.pageThumb ) {
                    // 有缩略图的page
                    li = '<li><a class="slide-page-cell" page="' + i + '"><img src="' + $(this).find('img').attr('src') + '" /></a></li>';
                } else {
                    // 无页码，无缩略图的page
                    li = '<li><a class="slide-page-cell" page="' + i + '"></a></li>';
                }

                $( exports.config.pageDOM ).append( li );

            });

            // 在page中生成“next”和“prev”按钮
            if ( exports.config.cutover ) {
                $( exports.config.pageDOM ).prepend( '<li><a class="prev"></a></li>' );
                $( exports.config.pageDOM ).append( '<li><a class="next"></a></li>' );

                // 为“next”和“prev”按钮绑定事件
                $( exports.config.pageDOM ).find('.next').click( function () {
                    exports.next();
                });

                $( exports.config.pageDOM ).find('.prev').click( function () {
                    exports.prev();
                });
            }

            // 缓存幻灯片页码的jQuery对象
            pageArr = $( exports.config.pageDOM ).find('li');

            // 为页面绑定点击事件，点击的时候调用play方法
            pageArr.each( function () {
                var page = $(this).find('a.slide-page-cell').attr('page');

                $(this).click( function () {
                    exports.play( page );
                });
            });

        } // END if

        // 初始化结束，执行自动播放
        exports.play();

        // 如果只有一张幻灯片，无动画
        if ( exports.slideLength === 1 ) {
            autoPlay = false;
            exports.stop();
        }

    }; // END init

});

/**
 * scaffold.helper.js
 *
 * 栅格系统脚手架工具
 * ------------------
 *
 * makeGrid : 方法，生成遮罩当前页面的栅格系统示意图，以便于检查当前页面的栅格布局
 *            默认为960栅格系统，可通过以下三个参数生成需要的单元格
 *            接受三个参数: columnWidth（单元格宽度）
 *                          columnNum  （单元格数目）
 *                          gutterWidth（单元格间距）
 *
 * destroyGrid : 方法，摧毁已生成的栅格系统示意图
 *
 * toggleGrid : 方法，显示或隐藏栅格系统
 *
 */
define("#util/0.1.1/scaffold/scaffold-debug", ["#jquery/1.8.2/jquery-debug"], function ( require, exports, module ) {
    var $ = require('#jquery/1.8.2/jquery-debug');

    // showGrid 显示标准栅格系统
    exports.makeGrid = function ( columnWidth, columnNum, gutterWidth ) {
        // 清除之前的栅格系统示意图
        exports.destroyGrid();

        // 设定默认值
        if ( !columnWidth || !columnNum || !gutterWidth ) {
            // 每个栅格单元的宽度
            columnWidth = 60;

            //  栅格单元总数
            columnNum   = 12;

            // 栅格单元间隔
            gutterWidth = 20;
        }

        // 栅格单元的容器
        var wrap = '<div class="scaffold-grid-wrap"></div>';

        $(document.documentElement).append( wrap );

        // 插入当前页面后，转为jQuery对象
        wrap = $(".scaffold-grid-wrap");

        // 定义栅格单元的容器样式
        wrap.css({
            // 先隐藏
            'display' : 'none',
            // 计算宽度
            'width' : ( columnWidth + gutterWidth ) * columnNum + 'px',
            // 居中
            'position' : 'absolute',
            'left' : '50%',
            'margin-left' : -1 * ( columnWidth + gutterWidth ) * columnNum / 2 + 'px',
            // 置于最前面
            'z-index' : 1000,
            'top' : 0,
            // 高度100%
            'height' : $(document.documentElement).height(),
            // 背景
            'background' : 'rgba( 255, 255, 255, 0.2)'
        });

        // 生成栅格单元
        var column = '<div class="scaffold-column"></div>';

        // 插入到栅格单元的容器中
        for ( var i=0; i < columnNum; i++ ) {
            wrap.append( column );
        } // END for

        // 定义栅格单元样式
        $(".scaffold-column").css({
            'width' : columnWidth + 'px',
            'height' : '100%',
            'float' : 'left',
            'margin-left' : gutterWidth / 2 + 'px',
            'margin-right' : gutterWidth / 2 + 'px',
            'background' : 'rgba( 0, 0, 0, 0.3)'
        });

    }; // END showGrid

    // 显示或隐藏栅格系统示意图
    exports.toggleGrid = function() {
        if ( $(".scaffold-grid-wrap")[0] ) {
            $(".scaffold-grid-wrap").slideToggle('fast');
        } else {
            if ( window.console ) {
                console.log('No Grid System Schematic!');
            }
        }
    };// END toggleGrid

    // 清除栅格系统示意图
    exports.destroyGrid = function () {
        if ( $(".scaffold-grid-wrap")[0] ) {
            // 直接删除容器DOM
            $(".scaffold-grid-wrap").remove();
        } else {
            if ( window.console ) {
                console.log('Grid System Schematic Destroy!');
            }
        }
    }; // END hideGrid

}); // END scaffold.helper

// upload.module.js
// ----------------
// 上传模块
//
// Usage : (在app目录下的应用脚本调用)
//
// HTML
/**
<form id="upload-form" target="upload_iframe_hidden" method="POST" name="file-upload-form" action="/attach/addfile" enctype="multipart/form-data">
    <input id="upload-input-file" name="file" type="file" multiple="multiple" />
</form>
<iframe id="upload_iframe_hidden" name="upload_iframe_hidden" style="display:none" src="" frameborder="0"></iframe>
*/

// Javascript
/**
var FILE = require('../module/file.module-debug');

FILE.config = {
    url : 'server', // {STRING} 请求服务器脚本
    fileType : 'png, bmp, zip, rar', // {STRING} 允许上传的文件类型，暂不支持正则
    fileList : $('#upload-block ul')[0], // {DOM} 实例化后的file对象<li>，将插入的目标<ul>
    msg : function ( msg ) { console.log(msg) }, // {FUNCTION}, {msg: OBJECT} 消息回调函数，处理'文件格式错误'等消息，返回参数'msg'，为对象
    uploadForm : $("#upload-form")[0] // {DOM} 为兼容IE浏览器，需要使用<form>配合隐藏<iframe>的方式模拟异步上传文件
                                      // 所以在IE下使用upload模块时，需要先在页面中写好异步上传的<form>，<input:file>和<iframe:hidden>
};

FILE.upload( files ); // {files: HTML5 files 对象} 将HTML5的'files'对象传入upload方法，并启动上传

// 监听upload模块loading事件
// 在开始上传文件时触发
FILE.loading( function ( msg ) {
    $("#load-gif").fadeIn('fast');
});

// 监听upload模块ready事件
// 在全部文件上传完毕后触发
FILE.ready( function ( msg ) {
    $("#load-gif").stop().fadeOut('fast');
});

*/

define("#util/0.1.1/upload/upload-debug", ["#underscore/1.4.2/underscore-debug", "#jquery/1.8.2/jquery-debug", "#backbone/0.9.2/backbone-debug"], function( require, exports, module ) {
    // 加载 Underscore 模块
    var _ = require('#underscore/1.4.2/underscore-debug');

    // 加载 jQuery 模块
    var $ = require('#jquery/1.8.2/jquery-debug');

    // 加载 Backbone 模块
    var Backbone = require('#backbone/0.9.2/backbone-debug');

    // 用 Backbone 为 exports 做扩展
    _.extend( exports, Backbone.Events );

    // 自定义 loading 模块事件
    exports.loading = function ( callBack ) {
        // 监听 upload 模块 loading 事件
        exports.on('loading', function ( msg ) {
            callBack( msg );
        });
    };

    // 自定义 ready 模块事件
    exports.ready = function ( callBack ) {
        // 监听 upload 模块 ready 事件
        exports.on('ready', function ( msg ) {
            callBack( msg );
        });
    };

    // 配置,初始置为空
    exports.config = {};

    // 必须的参数
    var need = {
        url      : '',
        fileType : '',
        fileList : '',
        msg      : ''
    };

    // 如果为IE浏览器，则需要配置文件上传表单
    if ( $.browser.msie ) {
        need.uploadForm = '';
    }

    // 默认配置 / 模块内部缓存配置
    var _config = {
        fileTpl  : '<li> <a href="" target="_blank"> <%= fileName %> </a> &nbsp;&nbsp; <progress></progress> <span class="delete red"> &times; </span> </li>'
    };

    /**
     * 检查配置，并重写配置
     */
    var checkConfig = function ( ) {
        // 当配置改变时，重新检查配置
        if ( _.isEqual( _config, exports.config ) ) {
            return false;
        } else {
            // 将当前配置与默认/缓存配置合并
            _.extend( _config, exports.config );

            // 将合并的配置保存到当前配置中
            exports.config = _config;
        }

        // 检查是否包含必须的配置项
        try {
            _.each( need, function ( em, key ) {
                if ( !_.has( exports.config, key ) ) {
                    throw new Error('上传文件模块未配置' + key );
                }
            });

        } catch (e) {
            if ( window.console !== undefined ) {
                console.error( e.message );
            } else {
                alert( e.message );
            }
        }

        // 解析文件类型为数组
        if ( _.isString( exports.config.fileType ) ) {
            // 去掉空格
            exports.config.fileType = exports.config.fileType.replace(/\s{1,}/g, '');
            // 分割成数组
            exports.config.fileType = exports.config.fileType.split(',');
        }

    }; // END checkConfig

    /**
     * checkFileType 内部方法检查文件类型
     * 接受参数: fileList 文件对象
     * 返回符合要求的文件数组
     */
    var checkFileType = function ( fileList ) {
        // 错误消息队列
        var error_msg = [];

        // 正确文件队列
        var correctFileList = [];
        
        // 检查是否为文件夹
        if ( fileList.length !== undefined && fileList.length === 0 ) {
            error_msg.push( '暂不支持直接上传文件夹，请压缩后上传<br />' );
        } else if ( $.browser.msie ) {
            //兼容IE，检测文件名
            var name = $( exports.config.uploadForm ).find('input:file').val().split('.');
            // 后缀，转换为小写
            var suffix = _.last( name ).toLowerCase();

            if ( !_.include( exports.config.fileType, suffix ) ) {
                error_msg.push( '<span class="black">[ ' + name + ' ]</span> 为不允许上传的文件类型<br />' );

                exports.config.msg({
                    'status' : 0,
                    'info'   : error_msg.toString()
                });

                return 0;
            } else {
                // 正确格式的文件压入新的文件队列
                return 1;
            }
        }// END 兼容性 IE

        _.each( fileList, function ( file, key ) {
            var nameArr = file.name.split('.');
            // 后缀，转换为小写
            var suffix = _.last( nameArr ).toLowerCase();

            // 无后缀名
            if ( nameArr.length === 1 ) {
                error_msg.push( '<span class="black">[ ' + file.name + ' ]</span> 无后缀名，请重新选择<br />' );
            } else {
                if ( !_.include( exports.config.fileType, suffix ) ) {
                    error_msg.push( '<span class="black">[ ' + file.name + ' ]</span> 为不允许上传的文件类型<br />' );
                } else {
                    // 正确格式的文件压入新的文件队列
                    correctFileList.push( file );
                }
            } // END if
        }); // END each

        if ( error_msg.length === 0 ) {
            exports.config.msg({
                'status' : 1,
                'info'   : 'success'
            });

        } else {
            // 输出错误消息
            exports.config.msg({
                'status' : 0,
                'info'   : error_msg.toString()
            });
        }

        //返回正确的文件队列
        return correctFileList;

    };// END checkFileType

    /**
     * 获得后端需要的文件类型
     */
    var conv_fileType = function ( fileName ) {
        // 分割文件名
        var nameArr = fileName.split('.');
        // 后缀，转换为小写
        var suffix = _.last( nameArr ).toLowerCase();

        var image = ['jpeg', 'jpg', 'png', 'gif', 'bmp'];
        var doc   = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];

        if ( _.include( image, suffix ) ) {
            return '1';
        } else if ( _.include( doc, suffix ) ) {
            return '2';
        } else {
            return '3';
        }

    }; // END conv_fileType

    /**
     * 文件DOM形态构造器
     * 属性:
     *     fileType : 文件类型
     *     fileName : 文件名
     *     filePath : 在服务器上的位置
     * 方法：
     *     delete   : 删除DOM形态
     *     loading  : 上传状态
     */
    var DOM = function ( fileName, fileType, fileSize ) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;

        // 加载模板文件并编译
        var file_DOM = _.template( exports.config.fileTpl, this);

        // 插入文件DOM列表中
        $( exports.config.fileList ).prepend( file_DOM );

        // 获得该DOM节点
        this.dom = $( exports.config.fileList ).find('li').eq(0);

        var _this = this;

        // 绑定事件删除该节点
        $( this.dom ).find('.delete').click( function() {
            _this.dom.remove();
        });

        return this;
    };

    /**
     * 兼容IE的上传方法适配
     */
    // 目标iframe缓存
    var uploadIframe = null;

    // 当前正在上传的文件(文件名)
    var uploadCurrentFileName;

    // ieUpload 内置方法，使用同步表单+iframe形式模拟AJAX提交
    var ieUpload = function () {
        // 获取input:file中要上传的文件名，赋给uploadCurrentFileName
        uploadCurrentFileName = $( exports.config.uploadForm ).find('input:file').val();

        // 检查要上传的文件类型是否配置要求
        if ( !checkFileType( uploadCurrentFileName ) ) {
            return false;
        }

        exports.trigger('loading', 'Sending...');

        // 根据配置（同步表单的target）取得返回结果用的iframe，并缓存（性能）
        if ( uploadIframe === null ) {
            uploadIframe = $( 'iframe[name="' + exports.config.uploadForm.target + '"]' );
        }

        // 为该iframe绑定事件，根据配置提供的同步文件上传form的target确定目标iframe
        if ( uploadIframe.attr( 'isBind' ) !== 'yes' ) {
            // 绑定成功后为iframe加上属性 isBind=true，防止再次绑定
            uploadIframe.attr( 'isBind', 'yes' );

            uploadIframe.on( 'load', function () {
                // 初始化文件DOM形态
                var File = new DOM( uploadCurrentFileName );

                try {
                    var data = window.frames[ exports.config.uploadForm.target ].data;

                    if ( data.status === 1 ) {
                        File.dom.find('a').attr('href', data.data.url );

                        exports.trigger('ready', 'Ready');
                    } else {

                        exports.config.msg({
                            'status' : 0,
                            'info'   : '发生错误: ' + File.fileName + data.info
                        });

                        File.dom.remove();

                        exports.trigger('ready', 'Error');
                    }

                } catch (e) {

                    exports.config.msg({
                        'status' : 0,
                        'info'   : '发生错误: ' + File.fileName + e
                    });

                    File.dom.remove();

                    exports.trigger('ready', 'Error');
                }
            });
        } // END bind event

        // JS提交表单
        $( exports.config.uploadForm ).submit();

    }; // END ieUpload

    // upload 对外方法，接受文件对象，并发送文件到服务器
    exports.upload = function ( fileList ) {
        // 检查配置是否满足要求
        checkConfig();

        // 如果为IE浏览器，则使用ieUpload方法上传
        if ( $.browser.msie ) {
            ieUpload();
            return false;
        }

        // 检查要上传的文件类型是否配置要求
        var correctFileList = checkFileType( fileList );

        // 初始化文件的DOM形态,并上传到服务器
        _.each( correctFileList, function ( file, key) {
            // 转化为DOM形态
            var File = new DOM( file.name, file.type, file.size );

            // 对每个文件建立XHR,以及FormData
            var XHR  = new XMLHttpRequest();
            var FileData = new FormData();

            // 将数据加入表单中
            FileData.append( 'file', file );
            FileData.append( 'upload_type', conv_fileType( file.name ) );

            // 向服务器声明以AJAX的方式发送，期望获得AJAX返回
            FileData.append( 'ajax', 1 );

            XHR.open( 'POST', exports.config.url, true );

            exports.trigger('loading', 'Sending');

            // 进度条
            if ( $( File.dom ).find('progress')[0] ) {
                var progress   = $( File.dom ).find('progress')[0];
                progress.min   = 0;
                progress.max   = 100;
                progress.value = 0;

                XHR.onload = function() {
                    $( progress ).hide();
                };

                XHR.upload.onprogress = function ( event ) {
                    if ( event.lengthComputable ) {
                        progress.value =
                        progress.innerHTML = ( event.loaded / event.total * 100 || 0 );
                    }
                };
            } // END progress

            // 获得文件在服务器上的位置
            XHR.onreadystatechange = function () {
                if ( XHR.readyState === 4 ) {
                    try {
                        // 尝试解析JSON返回结果
                        var data = $.parseJSON( XHR.response );

                        if ( data.status === 1 ) {
                            // 以属性的形式将该文件在服务器上的url添加到文件的DOM形态中
                            File.dom.find('a').attr('href', data.data.url);

                            exports.trigger('ready', '完成');
                        } else {

                            exports.config.msg({
                                'status' : 0,
                                'info'   : '发生错误: ' + File.fileName + data.info
                            });

                            File.dom.remove();

                            exports.trigger('ready', 'Error');
                        }
                    } catch (e) {

                        exports.config.msg({
                            'status' : 0,
                            'info'   : '发生错误: ' + e
                        });

                        exports.trigger('ready', 'Error');
                    }// END try catch
                }
            };

            // 上传
            XHR.send( FileData );

        });

    }; // END upload

});

/**
 * rpc.js
 * 对外接口
 * JSON rpc
 */
define("#util/0.1.1/rpc/rpc-debug", ["./rpcContainer-debug", "./client/rpcClient-debug", "./transport/httpClientTransport-debug", "#underscore/1.4.2/underscore-debug", "#backbone/0.9.2/backbone-debug", "#jquery/1.8.2/jquery-debug"], function(require, exports, module){
    var Combination = require('./rpcContainer-debug');

    var Rpc = function ( config ) {
        var comb = new Combination ( config );

        this.newClient = function () {
            return comb.client;
        };

        // TODO
        this.newServer = function () {
            return comb.server;
        };

    }; // END Rpc

    // API
    module.exports = Rpc;

}); // END rpc

/**
 * rpcContainer.js
 * 依赖注入
 */
define("#util/0.1.1/rpc/rpcContainer-debug", ["./client/rpcClient-debug", "./transport/httpClientTransport-debug", "#underscore/1.4.2/underscore-debug", "#backbone/0.9.2/backbone-debug", "#jquery/1.8.2/jquery-debug"], function(require, exports, module){
    var _ = require('#underscore/1.4.2/underscore-debug');

    var RpcClient = require('./client/rpcClient-debug');
    var HttpClientTransport = require('./transport/httpClientTransport-debug');

    // 依赖注入
    var Combination = function ( config ) {

        // 默认传输协议为HTTP
        this.transport = new HttpClientTransport();

        // 合并配置，可能会配置transport
        _.extend( this, config );

        // 根据配置的transport实例化client
        this.client = new RpcClient( this.transport );

        return this;

    }; // END Combination

    // API
    module.exports = Combination;

});

/**
 * rpcClient.js
 * JSON rpc 客户端
 */
define("#util/0.1.1/rpc/client/rpcClient-debug", ["#backbone/0.9.2/backbone-debug", "#underscore/1.4.2/underscore-debug", "#jquery/1.8.2/jquery-debug"], function(require, exports, module){
    var Backbone = require('#backbone/0.9.2/backbone-debug');
    var $ = require('#jquery/1.8.2/jquery-debug');
    var _ = require('#underscore/1.4.2/underscore-debug');

    var Client = Backbone.Model.extend({

        initialize : function ( transport ) {
            var _this = this;

            this.transport = transport;

            var transportEvents = [
                'ready:request',
                'error:request',
                'ready:dial',
                'error:dial'
            ];

            _.each( transportEvents, function(event) {
                _this.transport.on( event, function(res, data){
                    _this.trigger( event, res, data );
                });
            });

        },

        // 连接服务器
        dial : function ( url, callback ) {
            // url保存到当前Model
            this.url = url;

            // 调用协议层连接
            this.transport.dial( url, callback );
        },

        // 发送请求
        request : function ( method, data, callback) {
            var DATA = {
                method : method,
                url : this.url,
                data : data
            };

            this.transport.request( DATA , callback );

        }

    });

    module.exports = Client;

}); // END rpc

/**
 * 客户端HTTP协议层
 */
define("#util/0.1.1/rpc/transport/httpClientTransport-debug", ["#backbone/0.9.2/backbone-debug", "#underscore/1.4.2/underscore-debug", "#jquery/1.8.2/jquery-debug"], function(require, exports, module){

    function HttpClientTransport () {

        var Backbone = require('#backbone/0.9.2/backbone-debug');
        var _ = require('#underscore/1.4.2/underscore-debug');

        _.extend( this, Backbone.Events );

        /**
         * this.status 连接状态
         * status = 0;未连接
         * status = 1;连接成功
         */
        this.status = 0;

        // 连接服务器
        this.dial = function ( url, callback ) {
            // 缓存url
            this.url = url;

            var _this = this;

            callback = callback || function(){};

            // 尝试连接Rpc服务器，不发送任何数据
            $.ajax({

                url : this.url,

                type : "POST",

                dataType : "JSON",

                data : {},

                error : function ( err ) {
                    _this.trigger('error:dial', err);
                },

                success : function ( res ) {
                    // 返回值为JSON，则认为Rpc服务器可用
                    _this.trigger('ready:dial', res);
                    callback( res ); // 调用回调
                } // END success
            }); // END ajax
        }; // END dial

        // 通过Ajax向服务器发送数据
        // 这里会将已经发送的数据放回callback中
        this.request = function ( data, callback ) {
            var _this = this;

            callback = callback || function(){};

            $.ajax({

                url : this.url,

                type : "POST",

                dataType : "JSON",

                data : data,

                error : function ( err ) {
                    _this.trigger('error:request', err, data);
                },

                success : function ( res ) {

                    switch ( res.status ) {
                        case 1:
                            _this.trigger('ready:request', res, data);
                            break;
                        case 0:
                            _this.trigger('error:request', res, data);
                            break;
                        default:
                            _this.trigger('ready:request', res, data);
                    } // END switch

                    // 调用回调
                    callback( res, data);

                } // END success
            }); // END ajax
        }; // END request

        return this;
    }

    // API
    module.exports = HttpClientTransport;

});

// localStorageSync.js

// Backbone localStorage 适配器
// -----------------------------
// For Backbone with Zonda (c) Degas 2012
// Fork form https://github.com/jeromegn/Backbone.localStorage

define("#util/0.1.1/localStorageSync/sync-debug", ["#underscore/1.4.2/underscore-debug"], function(require, exports, module){
    var _  = require('#underscore/1.4.2/underscore-debug');

	// 生成一个四位的16进制数随机
	function S4 () {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	}

	// 生成一个伪GUID
	function guid() {
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	}

    // Store
    // -----
    // 提供两个方法方便存取LocalStorage对象
	var Store = function () {

		if ( window.localStorage === undefined ) {
			throw new Error('No localStorage!');
		} else {
			window.localStorage.zondaStorage = JSON.stringify({});
		}

		this.set = function ( newLocalStorage ) {
			if ( !newLocalStorage ) {
				return false;
			}

			window.localStorage.zondaStorage = JSON.stringify( newLocalStorage );
		};

		this.get = function () {
			return JSON.parse( window.localStorage.zondaStorage );
		};

		return this;

	}; // END Store

    // 实例化一个 Store 对象
    var store = new Store();

    // Create / Update
    // ------
    // 若 Model id 不不存在
    // 创建该 Model 的一个新实例
    // 保存到 LocalStorage 对应该Model的URL下
    //
    // 若 Model id 存在，则修改该 Model 实例
    var create = function ( model ) {

        if ( model.id === undefined ) {
            model.id = guid();
            model.set(model.idAttribute, model.id);
        }

        // 临时 localStorage 对象
        var tmp = store.get();

        // 创建数组存放该url下的Model实例
        var model_list = tmp[model.url];

        if ( model_list === undefined ) {
            model_list = [];
        }

        // 操作 model_list 数组
        // 如果 model.id 已经存在于 model_list 中，那么直接修改它
        // 若无该 model.id，那么push到 model_list 末尾
        var where = -1;

        _.each( model_list, function ( cell, key ) {
            if ( cell.id === model.id ) {
                where = key;
            }
        });

        if ( where !== -1 ) {
            model_list[where] = model;
        } else {
            model_list.push( model );
        }

        tmp[model.url] = model_list;

        store.set( tmp );

        return model;

    }; // END Create

    // Read
    // ----
    // 读取 LocalStorage 相应的数据后调用 Backbon fetch 函数的 success 方法
    // 更新该 Model
    var read = function ( model, options ) {
        var tmp = store.get(),
            model_list = tmp[model.url];

        try {
            // 读取某个 model
            if ( model.id !== undefined ) {
                var where = -1;

                _.each( model_list, function ( cell, key ) {
                    if ( cell.id === model.id ) {
                        where = key;
                    }
                });

                // 没有该 model 则抛出一个错误
                if ( where === -1 ) {
                    options.error( options.error, model );
                } else {
                    options.success(model);
                    return tmp[model.url][where];
                }

            // 读取所有的 model
            } else {
                // DEBUG
                console.log(tmp[model.url]);
                // END DEBUG

                options.success(tmp[model.url]);

                return tmp[model.url];
            }
        } catch (err) {
            options.error( options.error, model );
        }
    }; // END Read

    // Update / Create
    // ------
    // alias create
    var update = create;

    // Destroy
    // ------
    // 删除数据
    var destroy = function ( model, options ) {
        var tmp = store.get(),
            model_list = tmp[model.url],
            where = -1;

        try {
            _.each( model_list, function ( vo, key ) {
                if ( vo === undefined ) {
                    //Array.prototype.splice.call( model_list, key, 1 );
                    return;
                }

                if ( vo.id === model.id ) {
                    where = key;
                }
            });

            model_list.splice( where, 1 );

            tmp[model.url] = model_list;

            store.set( tmp );

            options.success(model);

            return model_list;

        } catch (err) {
            options.error( options.error, model );
        }

    }; // END destroy

    // sync
    // ----
    // 对外接口
    // 符合Backbone.sync的API
	var sync = function ( method, model, options ) {

		switch ( method ) {
			case "create":
                return create( model, options );
			case "read":
                return read( model, options );
			case "update":
                return update( model, options );
			case "delete":
                return destroy( model, options );
		}

	}; // END sync

	// API
	module.exports = sync;
});

/**
 * util.js
 * 框架组件
 */
define("#util/0.1.1/util-debug", ["./route/route-debug", "./cookie/cookie-debug", "./gif/gif-debug", "./gif.css", "./dialog/dialog-debug", "./verify/verify-debug", "./verify/verification-debug", "./stateMachine/stateMachine-debug", "./rightClickMenu/rightClickMenu-debug", "./ajax/ajax-debug", "./slide/slide-debug", "./scaffold/scaffold-debug", "./upload/upload-debug", "./rpc/rpc-debug", "./rpc/rpcContainer-debug", "./rpc/client/rpcClient-debug", "./rpc/transport/httpClientTransport-debug", "./localStorageSync/sync-debug", "#jquery/1.8.2/jquery-debug", "#underscore/1.4.2/underscore-debug", "#bootstrap/2.2.1/bootstrap-debug", "#easing/1.3.0/easing-debug", "#backbone/0.9.2/backbone-debug"], function(require, exports, module){

    var Util = {
        route          : require('./route/route-debug'),
        cookie         : require('./cookie/cookie-debug'),
        gif            : require('./gif/gif-debug'),
        dialog         : require('./dialog/dialog-debug'),
        verify         : require('./verify/verify-debug'),
        stateMachine   : require('./stateMachine/stateMachine-debug'),
        rightClickMenu : require('./rightClickMenu/rightClickMenu-debug'),
        ajax           : require('./ajax/ajax-debug'),
        slide          : require('./slide/slide-debug'),
        //tips           : require('./tips/tips-debug'),
        scaffold       : require('./scaffold/scaffold-debug'),
        upload         : require('./upload/upload-debug'),
        rpc            : require('./rpc/rpc-debug'),
        sync           : require('./localStorageSync/sync-debug')
    };

    // API
    module.exports = Util;
    
});
