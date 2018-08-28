/**
 * @doc demo样式
 * @author fanggang
 * @time 2018-07-05 11:49:47 周四
 */
$(function () {

    console.clear();
    var $tooltips = $('.tooltip');
    $tooltips.tooltip({
        delay: {
            show: 1000,                             // 显示延时
            hide: 1000                              // 隐藏延时
        },                                          // tooltip显示隐藏动画延时时间
        theme: 'default',                           // 风格样式前缀
        title: 'Tooltip',                           // tooltip内容，支持文本、dom内容。也可以从dom的data-original-title中取
        placement: 'top-center',                    // 出现的位置，top-center, top-left, top-right, left, right, bottom-left, bottom-center, bottom-right
        opacity: 1,                                 // 透明度
        enableAnimation: true,                      // 是否启用动画效果
        animation: undefined,                       // 动画效果
        /*animation: {
            show: 'fadeIn',
            hide: 'fadeOut',
        },*/                                          // 动画效果对象配置形式
        trigger: 'hover',                           // 出现的触发事件
        keepShowWhenOnTip: true,                    // 当鼠标在tip内容上时保持显示，鼠标离开则自动隐藏
        keepShowWhenClickTip: false,                // 当鼠标点击tip内容时保持显示(即使鼠标移开)，再点击一下将会取消一直显示
        cancelKeepShowWhenClickOtherPlace: false,   // 当鼠标点击非tooltip区域时取消一直显示
        positionOffset: undefined,                  // tooltip相对偏移位置，e.g:{top: 2px, left: 2px}，其值可为负数
        $container: false,                          // 放置展示tooltip的容器
        template: '<div class="tooltip-wrap" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',  // tooltip模版

        // Event
        beforeShow: undefined,                      // 显示之前
        afterShow: undefined,                       // 显示之后
        beforeHide: undefined,                      // 消失之前
        afterHide: undefined,                       // 消失之后
        onToggle: undefined,                        // 切换显隐时
    });

    /**
     * @doc 偏移
     * @type {jQuery|HTMLElement}
     * @author Heanes
     * @time 2018-07-09 11:11:17 周一
     */
    var $tooltipOffset1 = $('.tooltip-offset-1');
    var $tooltipOffset2 = $('.tooltip-offset-2');
    var $tooltipOffset3 = $('.tooltip-offset-3');
    var $tooltipOffset4 = $('.tooltip-offset-4');
    var $tooltipOffset5 = $('.tooltip-offset-5');
    $tooltipOffset1.tooltip({
        positionOffset: {
            top: '-10',
        },
    });
    $tooltipOffset2.tooltip({
        placement: 'bottom',
        positionOffset: {
            top: '10',
        },
    });
    $tooltipOffset3.tooltip({
        positionOffset: {
            left: '-30',
        },
    });
    $tooltipOffset4.tooltip({
        positionOffset: {
            left: '30',
        },
    });
    $tooltipOffset5.tooltip({
        positionOffset: {
            left: '30',
            top: '10',
        },
    });

    // 保持显示和取消保持显示
    var $tooltipKeepShow = $('.tooltip-keep-show');
    var $tooltipCancelKeepShow = $('.tooltip-cancel-keep-show');
    $tooltipKeepShow.tooltip({
        keepShowWhenClickTip: true,                 // 当鼠标点击tip内容时保持显示(即使鼠标移开)，再点击一下将会取消一直显示
    });

    $tooltipCancelKeepShow.tooltip({
        keepShowWhenClickTip: true,                 // 当鼠标点击tip内容时保持显示(即使鼠标移开)，再点击一下将会取消一直显示
        cancelKeepShowWhenClickOtherPlace: true,    // 当鼠标点击非tooltip区域时取消一直显示
    });

    // 动画
    /**
     * @doc 动画
     * @type {jQuery|HTMLElement}
     * @author Heanes
     * @time 2018-07-10 14:23:08 周二
     */
    var $tooltipAnimation1 = $('.tooltip-animation-1');
    var $tooltipAnimation2 = $('.tooltip-animation-2');
    var $tooltipAnimation3 = $('.tooltip-animation-3');
    var $tooltipAnimation4 = $('.tooltip-animation-4');
    var $tooltipAnimation5 = $('.tooltip-animation-5');
    $tooltipAnimation1.tooltip({
        animation: {
            show: 'animated bounce',
            hide: 'animated tada',
        },
    });
    $tooltipAnimation2.tooltip({
        animation: {
            show: 'animated wobble',
            hide: 'animated tada',
        },
    });
    $tooltipAnimation3.tooltip({
        animation: {
            show: 'animated bounceIn',
            hide: 'animated tada',
        },
    });
    $tooltipAnimation4.tooltip({
        animation: {
            show: 'animated shake',
            hide: 'animated tada',
        },
    });
    $tooltipAnimation5.tooltip({
        animation: {
            show: 'animated jello',
            hide: 'animated tada',
        },
    });

    /**
     *
     * @type {jQuery|HTMLElement}
     */
    var $tooltipTheme1 = $('.tooltip-theme-1');
    var $tooltipTheme2 = $('.tooltip-theme-2');
    var $tooltipTheme3 = $('.tooltip-theme-3');
    var $tooltipTheme4 = $('.tooltip-theme-4');
    var $tooltipTheme5 = $('.tooltip-theme-5');

    $tooltipTheme1.tooltip({
        theme: 'white'
    });
    $tooltipTheme2.tooltip({
        theme: 'primary'
    });
    $tooltipTheme3.tooltip({
        theme: 'info'
    });
    $tooltipTheme4.tooltip({
        theme: 'warn'
    });
    $tooltipTheme5.tooltip({
        theme: 'danger'
    });


    $('#showAllTooltipBtn').on('click', function () {
        $tooltips.tooltip('toggle');
        $tooltipOffset1.tooltip('toggle');
        $tooltipOffset2.tooltip('toggle');
        $tooltipOffset3.tooltip('toggle');
        $tooltipOffset4.tooltip('toggle');
        $tooltipOffset5.tooltip('toggle');

        $tooltipAnimation1.tooltip('toggle');
        $tooltipAnimation2.tooltip('toggle');
        $tooltipAnimation3.tooltip('toggle');
        $tooltipAnimation4.tooltip('toggle');
        $tooltipAnimation5.tooltip('toggle');

        $tooltipTheme1.tooltip('toggle');
        $tooltipTheme2.tooltip('toggle');
        $tooltipTheme3.tooltip('toggle');
        $tooltipTheme4.tooltip('toggle');
        $tooltipTheme5.tooltip('toggle');
    });

});