/**
 * @doc 根据内容自动生成导航目录
 * @author Heanes
 * @time 2018-07-24 18:30:55 周二
 */
;(function($, window, document, undefined) {
    "use strict";
    let autoCatalog = 'autoCatalog';
    let version = '1.0.0';

    let _default = {
        outlineSelector: ['h2', 'h3', 'h4'],    // 大纲选择器，支持多级
        catalogContainer: undefined,            // 放置生成目录的容器dom
        autoCounter: false,                     // 是否自动为大纲计数(即自动生成编号)。
        showChapterNumber: true,                // 是否显示章节编号
        showChapterSymbol: true,                // 是否显示章节符号
        formatChapterAnchor: undefined,         // 章节锚链接自定义格式化
        changeUrlAnchor: true,                  // 是否更改页面URL的锚链接。目前许多网页应用使用#做页面路由，所以增加此选项
        scrollContentAnimationDelay: 400,       // 滚动内容的动画延时，为0时没有动画效果
        scrollToContentOffset: 0,               // 点击目录时，页面跳转到对应章节处的偏移值
        scrollCatalogAnimationDelay: 400,       // 目录滚动动画延时，为0时没有动画效果
        useButtonToScroll: false,               // 是否使用按钮来滚动目录
        clickToScrollCatalogStep: 48,           // 当目录较长时，右侧会出现使目录上下滚动的按钮，此值定义点击一次按钮滚动导航目录移动的高度
        alwaysShow: true,                       // 是否一直显示目录
        collapseOnInit: false,                  // 初始化时折叠
        dataChapterFieldName: 'data-chapter',   // 章节data字段名称
        onChapterClick: undefined,              // 章节点击事件
        treeOption: {
            // 默认option
            option: {
                data: [],                       // 列表树上显示的数据
                getDataUrl: '',                 // 菜单数据获取的URL
                nodeIcon: 'fa fa-list',         // 节点图标
                iconCollapse: '',               // 合上时的图标
                iconExpand: '',                 // 展开时的图标
                iconEmpty: 'icon-empty',        // 空节点时图标
                showCollapseExpandIcon: false,  // 是否显示展开折叠标识图标
                showIcon: false,                // 是否显示图标

                nodeDefaultState: {
                    selected: false,
                    expanded: true,
                    disabled: false,
                    checked:  false
                },

                afterRenderNode: function($treeNode, level){

                },

                enableLink: true,               // 树是否允许超链接
                showSingleNodeIcon: true,       // 无子树节点是否显示图标
            },
            // 节点默认数据
            node: {
                text: "",
                nodeIcon: "fa fa-list",
                href: "",
                iconSelected: "",
                selectable: true,
                state: {
                    selected: false,
                    expanded: true,
                    disabled: false,
                    checked: false
                },
                switchToShow: true,
                target: "",                     // 链接打开目标
                nodes: []
            }
        }
    };

    /**
     * @doc 根据内容自动生成导航目录
     *      1. 根据指定的大纲选择器，自动抽取内容中的目录;
     *      2. 点击生成的目录，可以链接到对应的内容章节;
     *      3. 页面滚动生成目录也自动滚动到对应章节处;
     *      4. 可自动为目录编号;
     *      5. 支持多级目录;
     *      6. 定义风格样式;
     * @param element
     * @param options
     * @returns {{options: *, init: *, destroy: *, refreshOption: *}}
     * @constructor
     */
    let AutoCatalog = function (element, options) {
        this._defaults  = this.getDefaults();
        this.options    = null;
        this.$element   = null;
        this.inState    = null;

        this.init(element, options);

        return {
            // Options (public access)
            options: this.options,

            // Method
            // Initialize / destroy methods
            init:           $.proxy(this.init, this),           // 初始化
            destroy:        $.proxy(this.destroy, this),        // 销毁
            refreshOption:  $.proxy(this.refreshOption, this),  // 刷新option
            show:           $.proxy(this.show, this),           // 显示
            hide:           $.proxy(this.hide, this),           // 隐藏
            toggle:         $.proxy(this.toggle, this),         // 交替切换
        };
    };

    AutoCatalog.V = AutoCatalog.VERSION = version;
    /**
     * @doc 默认选项
     * @type Object
     */
    AutoCatalog.DEFAULTS = _default;

    /**
     * @doc 初始化
     * @returns {AutoCatalog}
     */
    AutoCatalog.prototype.init = function (element, options) {
        this.$element = $(element);
        this.$el_ = this.$element.clone(true);  // 保留一份原始dom

        this.options = this.getOptions(options);

        this.treeData = this.getChapterTreeData();

        this.renderCatalog(this.treeData);

        this.bindEvent();

        return this;
    };

    /**
     * @doc 绑定事件
     * @returns {AutoCatalog}
     */
    AutoCatalog.prototype.bindEvent = function () {
        let $element = this.$element,
            $catalog = this.$catalog,
            options = this.options,
            contentPosition = $element.position(),
            contentHeight = $element.height(),
            _this = this;

        let $catalogListWrap = $catalog.find('.catalog-list-wrap');
        let $catalogList = $catalog.find('.catalog-list');
        let $catalogItemList = $catalog.find('.node-wrap');
        let catalogItemFirstHeight = $catalogItemList.eq(0).height();

        let $scrollbarLocationArrow = $catalog.find('.scrollbar-location-arrow');
        let arrowHeight = $scrollbarLocationArrow.height();

        let $outlines = this.$outlines, outlineLength = $outlines.length;

        let catalogListOutHeight = $catalogListWrap.height();
        let catalogListInnerHeight = $catalogList.height();
        let overHeight = catalogListInnerHeight - catalogListOutHeight;

        let $goUpBtn = $catalog.find('.go-up-btn'),
            $goDownBtn = $catalog.find('.go-down-btn');

        let clickToScrollCatalogStep = options.clickToScrollCatalogStep;
        let scrollCatalogAnimationDelay = options.scrollCatalogAnimationDelay;
        let scrollContentAnimationDelay = options.scrollContentAnimationDelay;
        let catalogOffsetTop = 0, locationArrowOffsetTop = 0;

        let $chapterItem, $chapterMatched, chapterMatchedPosition, chapterNumberCurrent;
        let scrollTop = 0;
        let matchScroll;

        /*console.log('overHeight', overHeight);
        console.log('catalogListInnerHeight', catalogListInnerHeight);
        console.log('catalogListOutHeight', catalogListOutHeight);*/

        // 滚动事件
        $(window).on('scroll', function () {
            scrollTop = $(this).scrollTop();

            // 滚动时，1. 左侧进度自动跟随定位，2. 目录自动滚动
            // 从后向前匹配，匹配到了便立即返回
            for(let i = outlineLength - 1; i > 0; i--){
                $chapterItem = $outlines.eq(i);
                matchScroll = scrollTop >= $chapterItem.offset().top - catalogItemFirstHeight;
                if(matchScroll){
                    chapterNumberCurrent = $chapterItem.attr(options.dataChapterFieldName);
                    $chapterMatched = $catalogList.find('[' + options.dataChapterFieldName + '="' + chapterNumberCurrent + '"]');
                    chapterMatchedPosition = $chapterMatched.position();
                    // 1. 自动定位章节
                    $catalogItemList.removeClass('active');
                    $chapterMatched.addClass('active');

                    // 2. 显示区域滑动
                    if(overHeight > 0){
                        if(chapterMatchedPosition.top + catalogItemFirstHeight <= catalogListOutHeight){
                            //console.log('top');
                            catalogOffsetTop = 0;
                            // 右侧操作按钮显示、隐藏
                            $goUpBtn.addClass('disabled');
                            $goDownBtn.removeClass('disabled');
                        }
                        // 如果超出显示范围
                        else if ((chapterMatchedPosition.top + catalogItemFirstHeight > catalogListOutHeight) && (chapterMatchedPosition.top < overHeight)){
                            //console.log('middle');
                            catalogOffsetTop = -chapterMatchedPosition.top + catalogListOutHeight / 2 - catalogItemFirstHeight;
                            // 右侧操作按钮显示、隐藏
                            $goUpBtn.removeClass('disabled');
                            $goDownBtn.removeClass('disabled');
                        }else if (chapterMatchedPosition.top > overHeight){
                            //console.log('bottom');
                            catalogOffsetTop = -overHeight;
                            $goUpBtn.removeClass('disabled');
                            $goDownBtn.addClass('disabled');
                        }
                        // 如果使用按钮点击来上下滚动目录
                        if(options.useButtonToScroll){
                            scrollCatalogAnimationDelay > 0 ? $catalogList.stop().animate({'top': catalogOffsetTop}, scrollCatalogAnimationDelay) : $catalogList.css({'top': catalogOffsetTop});
                        }else{
                            scrollCatalogAnimationDelay > 0 ? $catalogListWrap.stop().animate({scrollTop: -catalogOffsetTop}, scrollCatalogAnimationDelay) : $catalogListWrap.scrollTop(-catalogOffsetTop); // 不使用右侧按钮点击滚动功能，而使用原生滚动条时
                        }
                    }

                    // 3. 左侧定位滑块滑动
                    locationArrowOffsetTop = chapterMatchedPosition.top + ($chapterMatched.height() - arrowHeight) / 2;
                    scrollCatalogAnimationDelay > 0 ? $scrollbarLocationArrow.stop().animate({'top': locationArrowOffsetTop}, scrollCatalogAnimationDelay) : $scrollbarLocationArrow.css({'top': locationArrowOffsetTop});

                    return false;// 匹配到后立即跳出each循环
                }else{
                    locationArrowOffsetTop = (catalogItemFirstHeight - arrowHeight) / 2;
                    scrollCatalogAnimationDelay > 0 ? $scrollbarLocationArrow.stop().animate({'top': locationArrowOffsetTop}, scrollCatalogAnimationDelay) : $scrollbarLocationArrow.css({'top': locationArrowOffsetTop});
                    $catalogItemList.removeClass('active').eq(0).addClass('active');
                }
            }

            // 整个目录不在内容范围内就自动隐藏
            if(!options.alwaysShow){
                if(scrollTop >= contentPosition.top + contentHeight){
                    $catalog.animate({'opacity':0,'visibility':'hidden'}, 1000);
                }else{
                    $catalog.animate({'opacity':1,'visibility':'visible'}, 1000);
                }
            }
        });

        // 内容定位到对应位置。支持偏移值
        if(!options.changeUrlAnchor || options.scrollToContentOffset > 0){
            $catalog.on('click', function (event) {
                let $htmlBody = $('html,body');
                let $target = $(event.target);
                let $nodeWrap = $target.hasClass('node-wrap') ? $target : $target.closest('.node-wrap');
                if(options.changeUrlAnchor){
                    window.location.href = window.location.href.split("#")[0] + $nodeWrap.attr('href');
                }else{
                    let chapterCurrent = $nodeWrap.attr(options.dataChapterFieldName);
                    //console.log(options.dataChapterFieldName + '="' + chapterCurrent + '"');
                    let $contentMatched = _this.$element.find('[' + options.dataChapterFieldName + '="' + chapterCurrent + '"]');
                    if(scrollContentAnimationDelay > 0){
                        $htmlBody.animate({scrollTop: $contentMatched.offset().top + options.scrollToContentOffset}, scrollContentAnimationDelay)
                    }else{
                        $htmlBody.scrollTop($contentMatched.offset().top + options.scrollToContentOffset);
                    }
                }
                return false;
            });
        }

        /*setInterval(function () {
            //console.log('scrollTop', scrollTop);
            console.log('matchScroll', matchScroll);
            console.log('chapterMatchedPosition', chapterMatchedPosition);
        }, 1000);*/
        if(options.useButtonToScroll){
            // 右侧工具条点击驱使目录滚动
            $goUpBtn.on('click', function () {
                let $this = $(this);
                if(!$this.hasClass('disabled')){
                    if (Math.abs(parseInt($catalogList.css('top'))) >= clickToScrollCatalogStep) {
                        $catalogList.stop().animate({'top': '+=' + clickToScrollCatalogStep}, 'fast');
                        $goDownBtn.removeClass('disabled');
                    }else{
                        $catalogList.stop().animate({'top': '0'}, 'fast');
                        $this.addClass('disabled');
                    }
                }
                return false;
            });
            $goDownBtn.on('click', function () {
                let $this = $(this);
                if(!$this.hasClass('disabled')){
                    if (overHeight - Math.abs(parseInt($catalogList.css('top'))) >= clickToScrollCatalogStep) {
                        $catalog.find('.catalog-list').stop().animate({'top': '-=' + clickToScrollCatalogStep}, 'fast');
                        $goUpBtn.removeClass('disabled');
                    }else{
                        $catalogList.stop().animate({'top': -overHeight}, 'fast');
                        $this.addClass('disabled');
                    }
                }
                return false;
            });
        }else{
            $catalogListWrap.addClass('auto-scroll');
            $catalog.find('.catalog-scrollbar-right').remove();
        }

        // ----- 底部工具条功能
        let $goTopBtn = $catalog.find('.go-top-btn'),
            $toggleShowBtn = $catalog.find('.toggle-show-btn');
        // 回到文章顶部功能
        $goTopBtn.on('click', function () {
            $('html,body').animate({scrollTop: contentPosition.top}, 'fast');
        });
        // 展开折叠目录列表展示事件
        $toggleShowBtn.on('click', function () {
            _this.$catalog.toggleClass('collapse');
        });

        // 插件加载完成就触发一次滚动事件
        $(window).trigger('scroll');
        return this;
    };

    /**
     * @doc 抽取目录数据
     * @author Heanes
     * @time 2018-08-06 16:18:24 周一
     */
    AutoCatalog.prototype.getChapterTreeData = function($element) {
        let $content = $element || this.$element;
        let options = this.options;
        let outlineSelector = options.outlineSelector;
        let selector = outlineSelector.join(',');
        let $outlines = $content.find(selector);
        this.$outlines = $outlines;
        let treeData = [];
        let _this = this;
        $.each($outlines, function (i, chapter) {
            let $chapter = $(chapter);
            let node = {};
            node.nodes = [];
            node.text = $chapter.text();
            let level = _this.matchOutlineSelectorLevel($chapter, outlineSelector);
            node.level = level;
            if(level === 1){
                // 记录大纲编号，数组形式保存，如[1, 2, 2]，表示第1.2.2章节
                node.outline = [treeData.length + 1];
                node.href = '#' + _this.formatChapterAnchor(node);
                treeData.push(node);
            }else{
                let parentNode = _this.getParentNodeByLevel(treeData, level);
                node.outline = parentNode.outline;
                node.href = '#' + _this.formatChapterAnchor(node);
                parentNode.parentNode.nodes.push(node);
            }
            _this.insertChapterAnchorToContent($chapter, node);

            $chapter.attr(options.dataChapterFieldName, node.outline.join('.'));
        });

        //console.log(treeData);
        return treeData;
    };

    /**
     * @doc 根据级别获取大纲树的父级节点
     * @param treeData
     * @param level
     * @returns {*}
     * @author Heanes
     * @time 2018-08-06 15:30:30 周一
     */
    AutoCatalog.prototype.getParentNodeByLevel = function(treeData, level) {
        if(level === 1){
            return treeData;
        }
        let parentNode = treeData[treeData.length - 1];
        let outline = [];
        if(level === 2){
            outline = [treeData.length, (parentNode.nodes.length + 1)];
            return {parentNode: parentNode, outline: outline};
        }
        outline = [treeData.length, parentNode.nodes.length];
        for(let i = 2; i < level; i++){
            let nodes = parentNode.nodes;
            let pos = nodes.length > 1 ? nodes.length - 1 : 0;
            parentNode = nodes[pos];
            outline.push(parentNode.nodes.length + 1);
        }
        return {parentNode: parentNode, outline: outline};
    };

    /**
     * @doc 格式化输出大纲
     * @param chapter 章节
     * @param joiner 中间连接符
     * @returns {string}
     * @author Heanes
     * @time 2018-08-06 16:37:43 周一
     */
    AutoCatalog.prototype.formatChapterAnchor = function(chapter, joiner){
        let options = this.options;
        let formatChapterAnchorFn = options.formatChapterAnchor;
        if(typeof formatChapterAnchorFn === 'function'){
            return formatChapterAnchorFn(chapter);
        }
        joiner = joiner || '.';
        return chapter.outline.join(joiner) + joiner + chapter.text;
    };

    /**
     * @doc 根据大纲选择器计算指定元素的大纲级别
     * @param $element
     * @param outlineSelector
     * @returns {number}
     * @author Heanes
     * @time 2018-08-06 15:29:41 周一
     */
    AutoCatalog.prototype.matchOutlineSelectorLevel = function($element, outlineSelector) {
        let options = this.options;
        outlineSelector = outlineSelector || options.outlineSelector;
        let level = 1;
        $.each(outlineSelector, function (i, item) {
            if($element.hasClass(item) || $element[0].tagName.toLowerCase() === item.toLowerCase()){
                level = i + 1;
                return false;
            }
        });
        return level;
    };

    /**
     * @doc 插入锚链接到文章
     * @author Heanes
     * @time 2018-08-06 17:02:27 周一
     */
    AutoCatalog.prototype.insertChapterAnchorToContent = function($element, node) {
        let $anchor = this.generateOutlineAnchor(node);
        $element.before($anchor);
        return this;
    };

    /**
     * @doc 生成大纲锚链接
     * @author Heanes
     * @time 2018-08-06 17:02:45 周一
     */
    AutoCatalog.prototype.generateOutlineAnchor = function(node) {
        let anchor = this.formatChapterAnchor(node);
        return `<div class="auto-catalog-outline-anchor">
            <a class="auto-catalog-anchor-href" name="${anchor}"></a>
        </div>`;
    };

    /**
     * @doc 生成导航目录
     * @param treeData
     * @author Heanes
     * @time 2018-08-06 17:04:33 周一
     */
    AutoCatalog.prototype.renderCatalog = function(treeData) {
        let options = this.options;
        this.$catalog = $(this.template.main);
        let $catalogContainer = options.catalogContainer;
        if(!options.catalogContainer instanceof jQuery){
            $catalogContainer = $(options.catalogContainer);
        }
        let $catalogList = this.$catalog.find('.catalog-list');
        $catalogContainer.empty().append(this.$catalog);
        this.convertToStandardTree(treeData);
        $catalogList.append(this.buildTree(treeData));

        // 加载后是否折叠显示
        if(options.collapseOnInit){
            this.$catalog.addClass('collapse');
        }

        // 右侧点击滑动的按钮是否展示
        if(this.$catalog.find('.catalog-list-wrap').height() >= this.$catalog.find('.catalog-list').height()){
            this.$catalog.find('.catalog-scrollbar-right').hide();
        }

        return this;
    };

    /**
     * @doc 导航目录模版
     * @type {string}
     */
    AutoCatalog.prototype.template = {
        main: `<div class="auto-catalog">
            <div class="catalog-wrap">
                <div class="catalog-scrollbar-left">
                    <em class="circle start"></em>
                    <em class="circle end"></em>
                </div>
                <div class="catalog-list-wrap">
                    <div class="catalog-list tree-list">
                        <div class="scrollbar-location-arrow">
                            <i class="rectangle"></i>
                            <i class="triangle-right"></i>
                        </div>
                    </div>
                </div>
                <div class="catalog-scrollbar-right">
                    <a class="handle-btn go-up-btn disabled" href="javascript:;"><i class="triangle-up"></i></a>
                    <a class="handle-btn go-down-btn" href="javascript:;"><i class="triangle-down"></i></a>
                </div>
            </div>
            <div class="catalog-toolbar-wrap">
                <div class="catalog-toolbar">
                    <a class="handle-btn toggle-show-btn" href="javascript:;"><i class="fa fa-list"></i></a>
                    <a class="handle-btn go-top-btn" href="javascript:;"><i class="fa fa-angle-up"></i></a>
                </div>
            </div>
        </div>`,
        chapterSymbol: '<em class="chapter-symbol"></em>'
    };

    /**
     * @doc 构建树
     * @param nodes
     * @param level
     * @param toSwitch
     */
    AutoCatalog.prototype.buildTree = function (nodes, level, toSwitch) {
        if (!nodes) return;
        let catalogOption = this.options;
        let options = this.options.treeOption.option;
        // 如果开启切换，则顶级当作0级
        level = level === undefined ? 1 : level;
        //console.log(level);

        let _this = this;
        let $treeUl = $(_this.treeTemplate.treeListGroup);

        $.each(nodes, function addNodes(index, node) {
            // console.log('%c ' + level + ' in loop', 'background:#222;color:#bada55');

            let $treeNodeLi = $(_this.treeTemplate.node).attr('data-nodeId', node.nodeId);
            let $treeNodeWrap = $(_this.treeTemplate.nodeWrap);
            if (options.enableLink){
                $treeNodeWrap = $(_this.treeTemplate.nodeLink);
                $treeNodeWrap.attr('href', node.href);
                if(node.target !== undefined) $treeNodeWrap.attr('target', node.target);
            }

            {
                // 左侧树
                // 按子菜单层级缩进
                //console.log('%c' + level, 'background:#222;color:#3c8dbc;font-size:14px;');
                for (let i = 0; i < (level - 1); i++) {
                    $treeNodeWrap.append(_this.treeTemplate.indent);
                }

                // 添加章节符号
                if(catalogOption.showChapterSymbol){
                    $treeNodeWrap.append('<em class="chapter-symbol"></em>');
                }

                // 有子树的添加折叠及其他样式
                let ceIconClassList = [];
                if (node.nodes && node.nodes.length > 0) {
                    ceIconClassList.push('node-collapse-expand-icon');
                    if(node.state.expanded){
                        // 添加展开样式
                        ceIconClassList.push('expand');
                        ceIconClassList.push(options.iconExpand);
                        $treeNodeLi.addClass('expand');
                    }else{
                        ceIconClassList.push('collapse');
                        ceIconClassList.push(options.iconCollapse);
                        $treeNodeLi.addClass('collapse');
                    }
                } else {
                    ceIconClassList.push(options.iconEmpty);
                }

                if(options.showCollapseExpandIcon){
                    $treeNodeWrap.append(
                        $(_this.treeTemplate.icon).addClass(ceIconClassList.join(' '))
                    );
                }

                // 添加图标icon
                if (options.showIcon) {
                    // 只有左侧第一级节点 或者 该节点存在子树 或者该节点是叶子节点但是开启了“叶子节点也显示图标”时才显示节点图标
                    if(level === 1 || options.showSingleNodeIcon || (node.nodes && node.nodes.length > 0)) {
                        let nodeIconClassList = ['node-icon'];
                        nodeIconClassList.push(node.nodeIcon || options.nodeIcon);
                        $treeNodeWrap.append(
                            $(_this.treeTemplate.icon).addClass(nodeIconClassList.join(' '))
                        );
                    }
                }

                // 添加章节编号
                if(catalogOption.showChapterNumber){
                    $treeNodeWrap.addClass('chapter-item').append('<span class="chapter-number">' + node.outline.join('.') +'.</span>');
                }

                // 添加文字及链接
                $treeNodeWrap.append($(_this.treeTemplate.nodeText).append(node.text).addClass('chapter-text'));

                // 添加章节号属性，作为标记
                $treeNodeWrap.attr(catalogOption.dataChapterFieldName, node.outline.join('.'));

                // 添加到dom中
                $treeUl.append($treeNodeLi.append($treeNodeWrap));
                if(options.afterRenderNode && typeof options.afterRenderNode === 'function'){
                    options.afterRenderNode($treeNodeLi, level);
                }

                $treeNodeLi.addClass('level' + level);

                //console.log('buildTree: level: ' + level);
                //console.log($treeNodeLi.html());
                // 递归
                if (node.nodes && node.nodes.length > 0) {
                    $treeNodeLi.append(_this.buildTree(node.nodes, level + 1));
                }

                if(level === 1){
                    // console.log('append treeList');
                    //_this.$treeList.append($treeUl);
                    return $treeUl
                }
            }
        });
        //console.log('return at last');
        //if($treeUl.children().length > 0)
        return $treeUl;
    };

    /**
     * @doc tree做一次标准转化
     * @param tree
     * @author Heanes
     * @time 2017-11-09 11:45:01 周四
     */
    AutoCatalog.prototype.convertToStandardTree = function (tree) {
        if(!tree) return;
        let options = this.options;
        let defaultNode = options.treeOption.node;

        let _this = this;
        $.each(tree, function (index, node) {
            node.state = $.extend(true, {}, defaultNode.state, options.nodeDefaultState, node.state);
            tree[index] = $.extend(true, {}, defaultNode, node); // @experience 此处发现循环内部若更改循环变量单体引用，将出现问题
            if(node.nodes && node.nodes.length > 0){
                tree[index].nodes = _this.convertToStandardTree(node.nodes);
            }
        });
        return tree;
    };

    /**
     * @doc 模版
     */
    AutoCatalog.prototype.treeTemplate = {
        treeTopWrap:            '<div class="tree-top-wrap"></div>',
        treeTop:                '<ul class="tree-top-list"></ul>',
        treeListWrap:           '<div class="tree-list-wrap"></div>',
        treeList:               '<div class="tree-list"></div>',
        treeListGroupWrap:      '<div class="tree-group-wrap"></div>',
        treeListGroup:          '<ul class="tree-group"></ul>',
        nodeWrap:               '<span class="node-wrap"></span>',
        nodeLink:               '<a class="node-wrap"></a>',
        node:                   '<li class="tree-node"></li>',
        link:                   '<a href="javascript:;" class="node-wrap"></a>',
        nodeText:               '<span class="node-text"></span>',
        indent:                 '<span class="indent"></span>',
        icon:                   '<i class="icon"></i>',
        badge:                  '<span class="badge"></span>', // 标记该菜单下有多少子菜单
        leftTreeHandle:         '<div class="tree-left-handle"></div>', // 左侧树操作栏
        handleContractLeftTree: '<span class="left-tree-handle-btn handle-contract" title="收缩/展开"><i class="handle-icon fa fa-exchange"></i></span>', // 收缩左侧树功能
        handleCollapseAll:      '<span class="left-tree-handle-btn handle-collapse-all" title="一键折叠全部"><i class="handle-icon fa fa-compress"></i></span>', // 一键折叠全部功能
        handleExpandAll:        '<span class="left-tree-handle-btn handle-expand-all" title="一键展开全部"><i class="handle-icon fa fa-expand"></i></span>', // 一键展开全部功能
        treeSearch:             '<div class="tree-search"><input type="text" class="tree-search-input" placeholder="search" /></div>', // 动态搜索功能
        collapseAllHandle:      '<div class="collapse-all-handle">' +
                                    '<span class="collapse-all-handle-btn collapsed" title="一键折叠/展开全部"><i class="handle-icon fa fa-compress"></i></span>' +
                                    '</div>' // 一键折叠展开全部功能
    };


    /**
     * @doc 获取options
     * @param options
     * @returns {void | {}}
     */
    AutoCatalog.prototype.getOptions = function (options) {
        return this.handleToStandardOption(options);
    };

    /**
     * @doc 处理为合法的标准option
     * @param options
     * @returns {void | {}}
     */
    AutoCatalog.prototype.handleToStandardOption = function (options) {
        let defaultOption = this.getDefaults();
        options = $.extend({}, defaultOption, this.$element.data(), options);
        if(!options.changeUrlAnchor){
            options.treeOption.option.enableLink = false;
        }
        return options;
    };

    /**
     * @doc 刷新option
     * @param options
     * @returns {AutoCatalog}
     */
    AutoCatalog.prototype.refreshOption = function (options) {
        this.options = $.extend(true, {}, this.options, options);
        this.getOptions(this.options);

        this.destroy();
        this.init();
        return this;
    };

    /**
     * @doc 销毁插件功能
     * @returns {AutoCatalog}
     */
    AutoCatalog.prototype.destroy = function () {
        this.$element.html(this.$el_.html());
        return this;
    };

    /**
     * @doc 获取默认选项
     * @returns Object
     */
    AutoCatalog.prototype.getDefaults = function () {
        return AutoCatalog.DEFAULTS;
    };


    /* --------------------------- 开发用内部功能函数 --------------------------- */
    /**
     * @doc 判断对象是否是数组
     * @param value
     * @returns {*}
     * @author Heanes
     * @time 2018-08-02 11:52:29 周四
     */
    function isArray(value){
        if (typeof Array.isArray === "function") {
            return Array.isArray(value);
        }else{
            return Object.prototype.toString.call(value) === "[object Array]";
        }
    }

    /**
     * @doc 输出错误到console
     * @param message
     * @returns {*}
     * @author Heanes
     * @time 2018-08-02 11:52:29 周四
     */
    function logError(message) {
        if(window.console){
            window.console.error(message);
        }
    }

    /**
     * @doc 加载插件到jquery
     * @param options
     * @param args
     * @returns {undefined|*}
     */
    $.fn[autoCatalog] = function (options, args) {
        let result = undefined;
        this.each(function () {
            let $this = $(this);
            let _this = $.data(this, autoCatalog);
            if (typeof options === 'string') {
                if (!_this) {
                    logError('Not initialized, can not call method : ' + options);
                }
                else if (!$.isFunction(_this[options]) || options.charAt(0) === '_') {
                    logError('No such method : ' + options);
                }
                else {
                    if (options === 'destroy') {
                        $this.removeData(autoCatalog);
                    }
                    if (!(args instanceof Array)) {
                        args = [ args ];
                    }
                    result = _this[options].apply(_this, args);
                }
            }
            else if (typeof options === 'boolean') {
                result = _this;
            }
            else {
                $.data(this, autoCatalog, new AutoCatalog(this, $.extend(true, {}, options)));
            }
        });
        return result || this;
    };

})(jQuery, window, document);