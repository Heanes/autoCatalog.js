/**
 * @doc 根据文章内容自动生成导航目录
 * @author FangGang,Heanes,heanes@163.com
 * @time 2016-04-13 15:12:33
 */
"use strict";
!(function ($, window, undefined) {
    $.fn.autoCatalog = function (userConf) {
        var defaultConf = {
            level1: 'h2',                       // 第一级别选择器
            level2: 'h3',                       // 第二级别选择器
            step: 48,                           // 按钮滚动导航目录步距
            catalogTarget: '#articleCatalog',   // 放置生成目录的容器
            alwaysShow: true,                   // 是否一直显示
            collapseOnInit: false               // 初始化时折叠
        },
            conf = $.extend({}, defaultConf, userConf || {});

        var $content = this,//$(conf.contentSelector),
            $headerList = $content.find(conf.level1 + ',' + conf.level2);
        var $headerListLength = $headerList.length;
        var $articleCatalogContainer = $(conf.catalogTarget);

        //导航的滚动，以及向上，向下按钮的显示隐藏
        function scrollSlide(that, index, $articleCatalog, $catalogScrollerOuter, $catalogScrollerInner, $goDownBtn, $goUpBtn, $arrow){
            //console.log('that.offset().top:' + that.offset().top);
            //console.log(index);
            var catalogListOutHeight = $catalogScrollerOuter.height();
            var catalogListInnerHeight = $catalogScrollerInner.height();
            var enableTop = catalogListInnerHeight - catalogListOutHeight;
            if (index < 6) {
                $catalogScrollerInner.stop().animate({'top': '0'}, 'fast');
                $goDownBtn.removeClass('disable');
                $goUpBtn.addClass('disable');
            } else if (index > 8) {
                $catalogScrollerInner.stop().animate({'top': -enableTop}, 'fast');
                $goDownBtn.addClass('disable');
                $goUpBtn.removeClass('disable');
            } else {
                var dlTop = parseInt($catalogScrollerInner.css('top')) + catalogListOutHeight / 2 - (that.offset().top - $articleCatalog.offset().top);
                $catalogScrollerInner.stop().animate({'top': dlTop}, 'fast');
                $goDownBtn.removeClass('disable');
                $goUpBtn.removeClass('disable');
            }
            $arrow.stop().animate({'top': that.position().top + $arrow.height()/2 - 3}, 'fast');
            //console.log('that.height():' + that.height());
            //console.log('that.position().top:' + that.position().top);
            //console.log('that.offset().top:' + that.offset().top);
            //console.log('$articleCatalog.offset().top:'+$articleCatalog.offset().top);
            //console.log($arrow.position().top);
        }


        // 生成锚点
        function generateAnchorStr(anchor){
            return '<div class="anchor-list">'
                + '<a name="' + anchor.anchorAddress + '" class="lemma-anchor para-title anchor-address"></a>'
                + '<a name="sub1001_' + anchor.anchorAddress + '" class="lemma-anchor-address"></a>'
                + '<a name="' + anchor.anchorName + '" class="lemma-anchor anchor-name"></a>'
                + '</div>';
        }

        // 生成导航目录
        function generateCatalogStr(anchor, level, h2, h3) {
            var catalogStr = '';
            if(level == 1){
                catalogStr = '<dt class="catalog-title level1">'
                    + '<em class="pointer"></em>'
                    + '<span class="text">'
                    + '<span class="title-index">' + anchor.anchorAddress + '</span>'
                    + '<a href="#' + anchor.anchorAddress + '" class="title-link">' + anchor.anchorName + '</a>'
                    + '</span>'
                    + '</dt>';
            }
            else if(level == 2){
                catalogStr = '<dd class="catalog-title level2">'
                    + '<em class="pointer"></em>'
                    + '<span class="text">'
                    + '<span class="title-index">' + h2 + '.' + (h3 - 1) + '</span>'
                    + '<a href="#' + anchor.anchorAddress + '" class="title-link">' + anchor.anchorName + '</a>'
                    + '</span>'
                    + '</dd>';
            }
            return catalogStr;
        }
        return this.each(function () {
            // 先清一次content中的锚链接
            $content.find('.anchor-list').remove();

            var catalogStructStr = '<div class="side-catalog">'
                +'<div class="side-bar">'
                +'<em class="circle start"></em>'
                +'<em class="circle end"></em>'
                +'</div>'
                +'<div class="catalog-scroller">'
                +'<dl class="catalog-list">'
                +'<a class="arrow" href="javascript:void(0);"></a>'
                +'</dl>'
                +'</div>'
                +'<div class="right-wrap">'
                +'<a class="go-up disable" href="javascript:void(0);"></a>'
                +'<a class="go-down" href="javascript:void(0);"></a>'
                +'</div>'
                +'<div class="bottom-wrap">'
                +'<a class="toggle-button" href="javascript:void(0);"></a>'
                +'<a class="gotop-button" href="javascript:void(0);"></a>'
                +'</div>'
                +'</div>';
            $articleCatalogContainer.empty().append(catalogStructStr);
            var $articleCatalog = $articleCatalogContainer.find('.side-catalog');
            if(conf.alwaysShow){
                $articleCatalog.css({'visibility':'visible','opacity':1});
            }
            if(conf.collapseOnInit){
                $articleCatalog.addClass('collapse');
            }

            var h2 = 1, h3 = 1, anchorAddress = '', anchorName = '', anchor = {}, level = 1;//, catalogStr = '';
            $.each($headerList, function (i, item) {
                // 1. 顺序生成多级章节
                if(item.tagName.toLowerCase() == conf.level1.toLowerCase() || $(item).hasClass(conf.level1)){
                    level = 1;
                    if(h3 > 1) h2++;
                    anchorAddress = h2;
                    h2++;
                    h3 = 1;
                }
                if(item.tagName.toLowerCase() == conf.level2.toLowerCase() || $(item).hasClass(conf.level2)){
                    level = 2;
                    if(h3 == 1) h2--;
                    anchorAddress = h2 + '_' + h3;
                    h3++;
                }
                anchorName = $(item).html().trim();
                anchor = {anchorName: anchorName,anchorAddress: anchorAddress};
                //anchorList.push(anchor);
                // 2. 插入锚点链接内容到相应h2~h3的节点上方
                $(item).before(generateAnchorStr(anchor));
                // 3. 生成导航目录
                $articleCatalog.find('.catalog-list').append(generateCatalogStr(anchor, level, h2, h3));
            });

            // 滚动页面，即滚动条滚动时目录随之自动滚动
            var $catalogScrollerOuter = $articleCatalog.find('.catalog-scroller');
            var $catalogScrollerInner = $articleCatalog.find('.catalog-list');
            var catalogListOutHeight = $catalogScrollerOuter.height();
            var catalogListInnerHeight = $catalogScrollerInner.height();
            var enableTop = catalogListInnerHeight - catalogListOutHeight;
            var step = conf.step;
            // 向上
            var $goUpBtn = $articleCatalog.find('.go-up');
            $goUpBtn.on('click', function () {
                if(!$(this).hasClass('disable')){
                    if (Math.abs(parseInt($catalogScrollerInner.css('top'))) >= step) {
                        $catalogScrollerInner.stop().animate({'top': '+=' + step}, 'fast');
                        $goDownBtn.removeClass('disable');
                    }else{
                        $catalogScrollerInner.stop().animate({'top': '0'}, 'fast');
                        $(this).addClass('disable');
                    }
                }
                return false;
            });
            // 向下
            var $goDownBtn = $articleCatalog.find('.go-down');
            $goDownBtn.on('click', function () {
                if(!$(this).hasClass('disable')){
                    if (enableTop - Math.abs(parseInt($catalogScrollerInner.css('top'))) >= step) {
                        $articleCatalog.find('.catalog-list').stop().animate({'top': '-=' + step}, 'fast');
                        $goUpBtn.removeClass('disable');
                    }else{
                        $catalogScrollerInner.stop().animate({'top': -enableTop}, 'fast');
                        $(this).addClass('disable');
                    }
                }
                return false;
            });

            $catalogScrollerInner.find('.catalog-title').eq(0).addClass('highlight').siblings('.catalog-title').removeClass('highlight');
            $(window).on('scroll', function () {
                if(!conf.alwaysShow){
                    if($(this).scrollTop() >= $content.position().top){
                        $articleCatalog.css({'visibility':'visible'}).animate({'opacity':1}, 'fast');
                    }else{
                        $articleCatalog.css({'visibility':'hidden'}).animate({'opacity':0}, 'fast');
                    }
                }
                if($(this).scrollTop() >= $content.position().top + $content.height()){
                    $articleCatalog.css({'visibility':'hidden'}).animate({'opacity':0}, 'fast');
                }else{
                    $articleCatalog.css({'visibility':'visible'}).animate({'opacity':1}, 'fast');
                }

                for (var i = $headerListLength - 1; i>=0; i--) {
                    var index = i;
                    if ($(this).scrollTop() >= $headerList.eq(i).offset().top - $headerList.eq(i).height()) {
                        $catalogScrollerInner.find('.catalog-title').eq(index).addClass('highlight').siblings('.catalog-title').removeClass('highlight');
                        scrollSlide($catalogScrollerInner.find('.catalog-title').eq(index), index, $articleCatalog, $catalogScrollerOuter, $catalogScrollerInner, $goDownBtn, $goUpBtn, $arrow);
                        return false;
                    } else {
                        $catalogScrollerInner.find('.catalog-title').eq(0).addClass('highlight').siblings('.catalog-title').removeClass('highlight');
                    }
                }
            });
            var $arrow = $catalogScrollerOuter.find('.arrow');
            // 导航侧栏内容的显示与隐藏
            $articleCatalog.find('.toggle-button').on('click', function(){
                if($articleCatalog.hasClass('collapse')){
                    $articleCatalog.removeClass('collapse');
                }else{
                    $articleCatalog.addClass('collapse');
                }
            });

            /**
             * @doc 滚动到文章内容起始位置
             * @author fanggang
             * @time 2016-04-13 17:03:16
             */
            $articleCatalog.find('.gotop-button').on('click', function () {
                $('body,html').animate({scrollTop: $content.position().top}, 'slow');
                return false;
            });

            // 插件执行完毕后触发一次滚动事件
            $(window).trigger('scroll');
        });
    }
}(jQuery, window));