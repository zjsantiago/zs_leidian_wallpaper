define(['lazyload'], function(){

'use strict';
    
    var lists = $('div.list'),
        lazyload = $.ui.Lazyload,
        imgs, loader;
    
    // 图片hover显示设为壁纸、下载至手机
    var showItemInfo = function(lists) {
        if (!lists[0]) {
        return;
        }
        lists.delegate('.photo', 'mouseenter', function () {
            var photo = $(this);
            var pos = "-35px";
            var info = photo.children('.item-info'); 
            if( info.is(':animated') ){
                info.stop( true, false );
            } 
            info.animate({'top': pos}, 200);
        });
        lists.delegate('.photo', 'mouseleave', function () {
            var photo = $(this);
            var info = photo.children('.item-info');
            if( info.is(':animated') ){
                info.stop( true, false );
            } 
            info.animate({'top': 0}, 200);
        });
    };

    //延迟加载
    var lazyLoad = function(match) {
        imgs = $(match),
        loader = new lazyload( imgs );
    };

    showItemInfo(lists);
    lazyLoad(".list img");
    
});