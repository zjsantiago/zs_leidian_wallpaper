/**
 * Created with JetBrains PhpStorm.
 * User: luolaibiao
 * Date: 13-4-15
 * Time: 下午7:14
 * To change this template use File | Settings | File Templates.
 */
var BZ = BZ || {};

BZ.lightBox = {
    ie6: $('html').hasClass('ie6'),
    status: 'hide',
    createPhoneUrl: function (item) {
        var title = item['dsptitle'] || item['title'] ||  '手机壁纸';
        var agent = UXC.util.base64.encode('Mozilla/4.0(compatible;MSIE 6.0; Windows NT 5.1; SV1;PICASSO@360)');
        var encode_name = encodeURIComponent(title);
        return 'zhushou360://dtype=wallpaper&op=0&type=jpg&name=' + encode_name + '&url=pdown://k=1|p14=1|h3=60|c1=2|p16=' + agent + '|' + item['qhimg_url'];
    },
    keyPressHandler: function (e) {
        if (e.keyCode == 27) {
            BZ.lightBox.hide();
        }
    },
    bodyClick : function(e) {
    	var bd = $("#lightBoxBd")[0];
    	var ft = $("#lightBoxFt")[0];
    	var t = e.target;
    	if(t != bd && t != ft && !$.contains(bd , t) && !$.contains(ft , t)) {
    		$(document.body).off('click' , arguments.callee);
    		BZ.lightBox.hide();
    	}
    },
    imgLoader: (function () {
        var img = new Image(), cache = BZ.cache = {} , timer = 0;
        //加载图片,成功或者失败返回
        return function (opts, callback) {
            var item = cache[opts['qhimg_url']];
            img.onload = img.onerror = null;
            timer && clearTimeout(timer);
            if (!!item) {
                timer = setTimeout(function () {
                    callback.call(item, item.status);
                }, 100);
            } else {
                img = new Image();
                img.onload = function () {
                    cache[opts['qhimg_url']] = {
                        width: this.width,
                        height: this.height,
                        status: false
                    };
                    callback.call(this, false);
                };
                img.onerror = function () {
                    cache[opts['qhimg_url']] = {
                        width: 0,
                        height: 0,
                        status: true
                    };
                    callback.call(this, true);
                };
                img.src = opts['qhimg_url'];
            }
        };
    })(),
    hideCallbacks: [],
    showCallbacks: [],
    addCallback: function (callback, type) {
        this[type + 'Callbacks'].push(callback);
    },
    //<a href="#" class="pv" id="J_ToggleBtn"><!--[if lte IE 8]><span class="before"></span><![endif]-->模拟手机预览</a>
    init: function () {
        var div = $('<div class="lightBox" id="lightBox"></div>');
        var shareHtml = '<div class="mode-share" data-title="%E9%9B%B7%E7%94%B5%E7%BD%91%E5%A3%81%E7%BA%B8%E5%88%86%E4%BA%AB" data-old_content="%E6%88%91%E5%9C%A8%E9%9B%B7%E7%94%B5%E6%89%8B%E6%9C%BA%E6%90%9C%E7%B4%A2%E5%8F%91%E7%8E%B0%E4%B8%80%E5%BC%A0%E6%9E%81%E5%A5%BD%E7%9A%84%E6%89%8B%E6%9C%BA%E5%A3%81%E7%BA%B8%EF%BC%8C%E8%AE%BE%E5%A5%BD%E4%B9%8B%E5%90%8E%E6%89%8B%E6%9C%BA%E5%A5%BD%E6%BC%82%E4%BA%AE%E5%93%87%EF%BC%8C%E5%A4%A7%E5%AE%B6%E5%BF%AB%E6%9D%A5%E5%9B%B4%E8%A7%82%E5%90%A7%EF%BC%9A" data-imgurl="http://p7.qhimg.com/t014c8b22789a1f317c.png">' + 
                                '<span>分享到：</span>' + 
                                '<a href="javascript:;" class="weibo" data-share="weibo" title="新浪微博"></a>' + 
                                '<a href="javascript:;" class="tweibo" data-share="tweibo" title="腾讯微博"></a>' + 
                                '<a href="javascript:;" class="qzone" data-share="qzone" title="QQ空间"></a>' + 
                                '<a href="javascript:;" class="renren" data-share="renren" title="人人网"></a>' + 
                                '<a href="javascript:;" class="douban" data-share="douban" title="豆瓣网"></a>'+ 
                        '</div>';
        var str = '<div class="inner">';
        str += '<div class="bd" id="lightBoxBd"><div id="lightBoxImage" class="image"><img/>' + shareHtml + '</div></div>';
        str += '<div class="ft" id="lightBoxFt"><div class="info"><span id="lb-title"></span>(<span id="lb-index"></span>/<span id="lb-count">10000</span>)</div><div class="handles"><a class="setup" id="lb-push" href="#">一键装进手机</a><a id="lb-down" href="#">下载到电脑</a></div></div>';
        str += '<div unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;" class="after"></div>';
        str += '<a href="#lightbox=0" class="btn-close" id="lightBox-close">Close</a>';
        str += '</div>';
        str += '<div unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;" class="after"></div>';
        str += '<div unselectable="on" style="-moz-user-select:none;-webkit-user-select:none;" onselectstart="return false;" class="phone" id="lightBoxPhone"><div class="preview"><img/><div class="touch"></div></div><img src="http://p2.qhimg.com/d/inn/b10c6a10/phone.png" class="img"/></div>';
        div.html(str);
        //<a href="#" class="btn-close" id="lightBox-close">Close</a>
        $('body').append(div);
        this.initShow(jQuery);
        this.initPhone(jQuery);
        if ($.browser.msie && $.browser.version < 7) {
            $('#lightBox').append('<iframe src="about:blank" style="position: absolute;left:0;top:0;width:100%;height:100%;" frameBorder="0" />');
            $('#lightBox iframe').css({opacity: 0});
        }
    },
    initShow: function ($) {
        var lightBox = $('#lightBox'),
            ImageBox = $('#lightBoxImage'),
            image = ImageBox.find('img'),
            lightBoxInner = lightBox.children('div.inner'),
            lightBoxFt = lightBox.find('div.ft'),
            lightBoxInfo = lightBox.find('div.info'),
            lightBoxHandles = lightBox.find('div.handles'),
            lightBoxShare = lightBox.find('div.mode-share'),
            docHtml = $('html'),
            _overflowY = docHtml.css('overflow') || 'auto',
            _opts = {
                width: 0,
                height: 0
            };
        function setImageInfo(opts) {

            //-------------//
            var t = +new Date;
            //-------------//

            image.css({
                'visibility': 'hidden',
                'left': 0
            });
            $('#lb-down').attr('href', opts['down_url']);
            $('#lb-push').attr('href', BZ.lightBox.createPhoneUrl(opts));
            $('#lb-title').html(opts['title']);
            $('#lb-index').html(opts['index'] - -1);
//            image.attr('src', opts['qhimg_375_url']);

            BZ.lightBox.imgLoader(opts, function (error) {

                //ImageBox.find('a.imgurl').attr('href', opts['site']);

                setimageBoxWH(this);

                image.attr('src', (error ? opts['qhimg_375_url'] : opts['qhimg_url'] ));

                setTimeout(function () {
                    image.css('visibility', 'visible');
                }, 100);
				
                //-------------//
                try {
                    window.dada && dada.pv({
                        fe: (+new Date) - t,
                        value: opts['qhimg_url'],
                        q: window.dada && dada.data.q,
                        pid: 'view'
                    });
                }
                catch (e) {

                }
                //-------------//
				
            });
        }

        var width = 0, height = 0;

        function setimageBoxWH(opts) {
            _opts.width = opts.width || 800;
            _opts.height = opts.height || 450;
            var scale = opts.width > 920 ? opts.width / 920 : 1;
            height = opts.height / scale;
            width = Math.floor(opts.width / scale);
            if (height > ($(window).height() - 147)) {
                height = $(window).height() - 147;
                scale = opts.height / height;
                width = Math.floor(opts.width / scale);
            }
            width = width % 2 == 0 ? width : width - 1;
            height = height % 2 == 0 ? height : height - 1;
            ImageBox.css({
                height: height,
                width: width
            });
            image.css({
                height: height,
                width: width
            });
            var ftWidth = width + 20;
            lightBoxFt.width(ftWidth);
            //左边info宽度设置，避免折行...
            lightBoxInfo.width(ftWidth - lightBoxHandles.outerWidth()); 
            lightBoxInner.css({
                'top': ($(window).height() - height - 37) * 0.382,
                'marginTop': 0,
                'height': height + 20
            });
            $('#lightBox-close').css('right', (920 - width) / 2);
            ImageBox.parent('div').width(width + 20);
            lightBoxInner.children('.after').css({
                height: height + 20,
                marginLeft: 0 - width / 2 - 10,
                width: width + 20
            });
        }

        //        image.on( 'load' , function () {
        //            image.css( 'visibility' , 'visible' );
        //        } );

        BZ.lightBox.show = function (opts) {
            docHtml.css('overflow', 'hidden');
            $(window).off('resize', resizeCallback);
            setImageInfo(opts);
            lightBox.show();
            if (opts.width > 0 && opts.height > 0) {
                setimageBoxWH(opts);
            }
            $(window).on('resize', resizeCallback);
            BZ.lightBox.status = 'show';
            $(document).on('keydown', this.keyPressHandler);
            //设置当前分享的data-信息
            lightBoxShare.data("content" , lightBoxShare.data('old_content'));
        	$(document.body).off('click' , this.bodyClick);
        	$(document.body).on('click' , this.bodyClick);
        };

        BZ.lightBox.hide = function () {
            $('html').css('overflow', _overflowY);
            BZ.lightBox.hidePhone();
            lightBox.hide();
            image.css({
                'visibility': 'hidden',
                'left': 0
            });
            if (BZ.lightBox.status == 'show') {
                $.each(this.hideCallbacks, function (index, callback) {
                    callback();
                });
            }
            $(window).off('resize', resizeCallback);
            BZ.lightBox.status = 'hide';
            if ('' != window.location.hash.replace('#', '')) {
                window.location.hash = 'lightbox=0';
            }
            $(document).off('keydown', this.keyPressHandler);
        };
        var resizeCallback = (function () {
            var resizeTimer = 0;
            return function () {
                resizeTimer && clearTimeout(resizeTimer);
                resizeTimer = setTimeout(function () {
                    setimageBoxWH(_opts);
                    var BtnToggle = $('#J_ToggleBtn');
                    if (BtnToggle.hasClass('on')) {
                        BZ.lightBox.hidePhone();
                        BtnToggle.addClass('on');
                        setTimeout(function () {
                            BZ.lightBox.showPhone();
                        }, 200);
                    }
                }, 200);
            }
        })();
        $('#lightBox-close').on('click', function () {
            BZ.lightBox.hide();
        });
        ImageBox.on('mouseenter' , function() {
            lightBoxShare.stop(1,1).fadeIn(300);
        }).on('mouseleave' , function(e) {
        	lightBoxShare.stop(1,1).fadeOut(300);
        });
        lightBoxShare.on('mouseenter' , function() {
        	lightBoxShare.stop(1,1).show(0);
        }).on('mouseleave' , function(e) {
        	var related = e.relatedTarget;
        	if(related != ImageBox[0] || $.contains(ImageBox , related)) {
        		return;
        	};
        	lightBoxShare.stop(1,1).fadeOut(300);
        });
        (function() {
            var e = {
                reg: /\!\!([a-z]+)\!\!/g,
                data: {
                    weibo: "http://service.weibo.com/share/share.php?url=!!url!!&appkey=&title=!!title!!%20%EF%BC%8D%EF%BC%8D%20!!text!!&pic=!!pic!!&language=zh_cn",
                    tweibo: "http://share.v.t.qq.com/index.php?c=share&a=index&title=!!title!!%20%EF%BC%8D%EF%BC%8D%20!!text!!&url=!!url!!&pic=!!pic!!",
                    douban: "http://shuo.douban.com/%21service/share?image=!!pic!!&href=!!url!!&name=!!title!!&text=!!text!!",
                    qzone: "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url=!!url!!&title=!!title!!&pics=!!pic!!&summary=!!text!!",
                    renren: "http://widget.renren.com/dialog/share?resourceUrl=!!url!!&srcUrl=!!url!!&title=!!title!!&pic=!!pic!!&description=!!text!!"
                }
            };
            lightBoxShare.click(function (t) {
                if ($(t.target).is("a[data-share]")) {
                    var n = $(t.target),
                        r = e.data[n.data("share")],
                        i = n.closest(".mode-share"),
                        s = r.replace(e.reg, function (e, t) {
                            switch (t) {
                            case "url":
                                return encodeURIComponent(location.href);
                            case "title":
                                return i.data("title");
                            case "pic":
                                return encodeURIComponent(i.data("imgurl"));
                            case "text":
                                return i.data("content");
                            }
                        });
                    window.open(s);
                }
                return false;
            });
        })();
        /*在图片上左右移动的时候切换鼠标指针代码开始*/
        ImageBox.mousemove(function(e) {
        	var imgWidth = ImageBox.outerWidth();
        	var imgLeft = ImageBox.offset().left;
        	var left = e.pageX - imgLeft;
        	
        	var extra = ImageBox.data("extraClass");
        	var curDir = "prev";
        	if(left > imgWidth/2) {
        		curDir = "next";
        	}
        	if(extra) {
        		if(curDir == 'prev' && extra.left) {
	        		curDir += " " + extra.left;
	        	}
	        	if(curDir == 'next' && extra.right) {
	        		curDir += " " + extra.right;
	        	}
        	}
        	ImageBox[0].className = 'image ' + curDir;
        });
        /*在图片上左右移动的时候切换鼠标指针代码开始*/
    },
    initPhone: function ($) {
        var opts = {
            height: 600,
            width: 335,
            scale: 1,
            boxWidth: 397,
            boxHeight: 738,
            top: 60,
            left: 32
        }, targetCss = opts;
        var lightBox = $('#lightBox');
        var lightBoxPhone = $('#lightBoxPhone'),
            lightBoxImage = $('#lightBoxImage'),
            preview = lightBoxPhone.find('.preview');
        var touch = preview.find('.touch');
        touch.css({
            opacity: 0
        });
        touch.on('mousedown', function (e) {
            var left = e.pageX ,
                cssLeft = parseInt(preview.find('img').css('left').replace('px', ''), 10),
                leftCache = 0;
            touch.css('cursor', 'move');
            touch.on('mousemove', function (evt) {
                var _left = (evt.pageX - left) - (0 - cssLeft);
                _left = _left > 0 ? 0 : (_left < targetCss.width - targetCss.imgWidth ? targetCss.width - targetCss.imgWidth : _left);
                if (_left !== leftCache) {
                    preview.find('img').css('left', _left);
                    lightBoxImage.find('img').css('left', _left + (targetCss.imgWidth - targetCss.width) / 2);
                    leftCache = _left;
                }
                return false;
            });
            return false;
        });
        touch.on('mouseup', function () {
            touch.off('mousemove');
            touch.css('cursor', '');
            return false;
        });
        touch.on('mouseleave', function () {
            touch.off('mousemove');
            touch.css('cursor', '');
            return false;
        });

        BZ.lightBox.showPhone = (function () {

            function setPhoneWH() {
                lightBox.addClass('lightBoxPhone');
                $("#lightBoxPhone .img,#lightBoxPhone span").css({
                    width: targetCss.boxWidth,
                    height: targetCss.boxHeight
                });
                preview.css(targetCss);
                preview.find('img').attr('src', $('#lightBoxImage').find('img').attr('src'));
                preview.find('img').css({
                    height: targetCss.height,
                    width: targetCss.imgWidth
                });
                preview.find('img').css('left', (targetCss.width - lightBoxImage.find('img').width()) / 2);
                lightBoxPhone.css({
                    'top': lightBoxImage.find('img').offset().top - lightBox.offset().top - targetCss.top,
                    'marginLeft': 0 - targetCss.boxWidth / 2
                });
            }

            return function () {
                var scale = opts.height / lightBoxImage.find('img').height();
                targetCss = {
                    scale: scale,
                    height: lightBoxImage.height(),
                    width: Math.ceil(opts.width / scale),
                    boxWidth: Math.round(opts.boxWidth / scale),
                    boxHeight: Math.round(opts.boxHeight / scale),
                    top: Math.floor(opts.top / scale) - 1,
                    left: Math.floor(opts.left / scale) - 1,
                    imgWidth: lightBoxImage.find('img').width()
                };
                setPhoneWH();
            }
        })();
        BZ.lightBox.hidePhone = function () {
            BtnToggle.removeClass('on');
            lightBoxImage.find('img').css('left', 0);
            lightBox.removeClass('lightBoxPhone');
        };
        var BtnToggle = $('#J_ToggleBtn');
        BtnToggle.on('click', function () {
            if (BtnToggle.hasClass('on')) {
                BZ.lightBox.hidePhone();
            } else {
                BtnToggle.addClass('on');
                BZ.lightBox.showPhone();
            }
            return false;
        });
    }
};

jQuery(function () {
    BZ.lightBox.init();
    //写入cursor对应的css
	var cssHtml = '<style type="text/css">' + 
					'.lightBox .prev{' + 
						'cursor: url(/static/img/left.cur), auto;' + 
					'}' + 
					'.lightBox .next{' + 
					    'cursor: url(/static/img/right.cur), auto;' + 
					'}' +
					'.lightBox .nomore{'+
						'cursor:default;' + 	
					'}' +  
					'</style>';
	$("head").append(cssHtml);
});

//IE6下做一些提前的修正工作
if (BZ.lightBox.ie6) {
    jQuery(function ($) {
        $('#lightBoxPhone').append('<span style="display:inline-block;filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=scale, src=\'http://p2.qhimg.com/d/inn/b10c6a10/phone.png\';"></span>');
        $('#lightBoxPhone ').find('.img').remove();

        $(window).on('scroll', function () {
            $('#lightBox').css('top', $(window).scrollTop());
        });

        $('#lightBox').css('top', $(window).scrollTop());

        $(window).on('resize', function () {
            $('#lightBox').css('height', $(window).height());
        });
    })
}