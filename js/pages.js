define(function(){

	'use strict';

	//默认配置
	var defaults = {
		data      : null,            // Array                        需要进行分页的数据
		container : 'document.body', // String|Element|easyJS Object 用于展示每个分页的容器
		elem      : null,            // String|Element|easyJS Object 自定义每条数据的展示html
		wrapPages : 3,               // Number                       当前页前后各显示几个页码
	    everyPage : 30               // Number                       每页展示的数据条数
	};

	var currPage = 0,   //当前页
		totalPage = 0,  //总页数
		totalCount = 0, //数据总条数
		prevBtn,        //前一页按钮
		nextBtn,   	    //后一页按钮
		data;           //数据集

	var easyPages = {
		init : function( o ) {
			data = o.data;
			//分页数据不能为空
			if( data === null || !data.length ) {
				return;
			}

			//数据处理
			totalCount = data.length;
			totalPage = Math.round(totalCount/o.everyPage);
			container = $(o.container).eq(0);
			
			//初始渲染页面
			drawPage( o );
			drawControl();
		},

		//构造展示界面html
		creatPageHtml : function ( o ) {
			var pageBegin, pageEnd, pageData,
				htmlArr = [];

			//本页的开始和结束在数据集中的位置
			pageBegin = currPage * everyPage; 
			pageEnd =  pageBegin + everyPage -1;

			if(currPage == (totalPage - 1) {
				pageEnd = pageBegin + (totalCount % everyPage) - 1;
			}
			//本页的数据子集
			pageData = o.data.slice(pageBegin, pageEnd + 1);

			//拼接字符串
			$(pageData).each(function(){
				var s = '<li class="photo">\
	                     	<a class="img-wrap" href="javascript:void(0);"><img src="http://p5.qhimg.com/d/inn/a0c42483/placeholder.png" data-lazysrc="http://p4.so.qhimg.com/sdr/197_148_/t01527c1108a66aeca9.jpg"/></a>\
		                     <div class="item-info">\
		                        <a href="javascript:void(0);">设为壁纸</a>\
		                        <a href="javascript:void(0);">下载至手机</a>\
		                     </div>\
	                     </li>';
				htmlArr.push(s);
			});

			return htmlArr.join('\n');
		},

		//构造分页组件html
		createCtrlHmtl : function ( o ) {
			var html = '';
			if ( totalPage > 1 ) {
				html = $('<ul></ul>');
				if ( currPage+1 > 1 ) {
					html.append('<li><a href="javascript:void(0);" class="prev"><span><s class="icon_arrow_prev"></s></span></a></li>');
				}
				if ( currPage + 1 >= 2 * $wrapPages && $totalPage > 2 * $wrapPages && $startPage != 1 ) {}
			}
		},

		nextPage : function () {

			drawPage( o );
			drawControl( o );
		},

		prevPage : function () {

			drawPage( o );
			drawControl( o );
		},

		toPage : function () {

			drawPage( o );
			drawControl( o );
		},

		//重新渲染container的内容
		drawPage : function ( o ) {
			var container = $(o.container).eq(0);
			if(container === undefined) {
				return;
			}

			//拼接每页html字符串
			var html = createPageHtml( o );
			
			container.empty();
			container.append(html);
		},

		//重新渲染翻页控件
		drawControl : function ( o ) {
			var pageation = o.target;

			var html = createCtrlHmtl( o );

			pageation.empty();
			pageation.append(html);
		}
	};

	var Pages = function (target, options) {
		target = $( target ).eq(0);
		options = options || {};

		if( !target.length ){
			return;
		}
		//合并默认配置和用户配置
		var o = $.extend( {}, defaults, options );

		easyPages.init( o );

		o.target = target;
		this.__o__ = o;
	};

	Pages.prototype = {
		
		destroy : function(){},

		prevPage : function(){
			if( this.__o__ ){
				easyPages.prevPage( this.__o__ );
			}

			return this;
		},

		nextPage : function(){
			if( this.__o__ ){
				easyPages.prevPage( this.__o__ );
			}

			return this;
		},

		toPage : function(){},
	};

	//添加到$.ui中
	if( !$.ui ){
		$.ui = {};
	}

	$.ui.Pages = Pages;
});