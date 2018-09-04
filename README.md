# autoCatalog.js
 根据文章生成导航目录

## 简介
根据指定文章内容生成目录导航栏侧栏。当文章较长时，特别对于教程或者参考文档性文章，浏览起来不方便，这时候，侧边浮动的目录大纲可以方便的让你定位到关键章节。

## 特点
1. 可以指定具体文章内容容器，据此自动生成导航目录;
2. 可以指定要生成章节节点的容器，控制哪些章节生成目录;
3. 可以指定放置生成目录导航的容器，导航位置随你安排;
4. 样式可以自由定义，只需更改css文件即可;
5. 按目录导航到内容时可以自定义滚动偏移值;

## Demo
<center>
<img src="https://github.com/Heanes/autoCatalog.js/blob/master/doc/static/image/autoCatalog_demo_screenshot.png?raw=true" alt="demo截图" />
demo截图
</center>
demo样式见: [autoCatalog.js demo](http://cdn.heanes.com/js/autoCatalog/1.0/demo/ "autoCatalog demo")

或者实例: [友谊的小船说翻就翻 (╮(╯▽╰)╭)](http://html.heanes.com/blog/html/heanes/article/friendship.html "友谊的小船说翻就翻 (╮(╯▽╰)╭)")

## 使用说明
autoCatalog.js调用很简单，只需普通jQuery插件使用的三步即可:
#### 第一步：页面头部引入样式文件
    <link type="text/css" rel="stylesheet" href="css/autoCatalog.css">
#### 第二步：引入js脚本
    // jQuery库依赖
    <script type="text/javascript" src="js/jquery.min.js"></script>
    
    // autoCatalog.js
    <script type="text/javascript" src="js/autoCatalog.js"></script>
    
#### 第三步：调用autoCatalog
    // 默认配置
    $('#mainContent').autoCatalog();
    
    // 自定义配置
    $('#mainContent').autoCatalog({
        "level1": 'title-levle1',
        "level2": 'title-levle2',
        "catalogContainer": '#yourArticleCatalog'
    });


## 参数说明
见文档[链接](http://cdn.heanes.com/js/autoCatalog/1.0/doc/index.html)
    
    
## License
* 本项目的所有代码按照 [MIT License](https://github.com/racaljk/hosts/blob/master/LICENSE) 发布
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
