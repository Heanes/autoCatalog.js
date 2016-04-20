# autoCatalog.js
 根据文章生成导航目录

## 简介
根据指定文章内容生成目录导航栏侧栏。当文章较长时，特别对于教程或者参考文档性文章，浏览起来不方便，这时候，侧边浮动的目录大纲可以方便的让你定位到关键章节。

## 特点
1. 可以指定具体文章内容容器，据此自动生成导航目录;
2. 可以指定要生成章节节点的容器，控制哪些章节生成目录;
3. 可以指定放置生成目录导航的容器，导航位置随你安排;
4. 样式可以自由定义，只需更改css文件即可;

## Demo
demo样式见: [autoCatolog demo](http://html.heanes.com/blog/html/heanes/article/autoCatalog/ "autoCatolog demo")

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
        "catalogTarget": '#yourArticleCatalog'
    });


## 参数说明
- `level1`
    - **数据类型**： 字符串
    - **默认值**： `'h2'`
    - **含义**： 第一级标题选择器，可以为html标签名，也可以为jQuery选择器字符串
    - **示例**： `'h2'`
- `level2`
    - **数据类型**： 字符串
    - **默认值**： `'h3'`
    - **含义**： 第二级标题选择器，可以为html标签名，也可以为jQuery选择器字符串
    - **示例**： `'h3'`
- `catalogTarget`
    - **数据类型**： 字符串
    - **默认值**： `'#articleCatalog'`
    - **含义**： 放置生成目录的容器
    - **示例**： `'#articleCatalog'`
- `step`
    - **数据类型**： 数值型
    - **默认值**： `48`
    - **含义**： 目录导航上下按钮点击一下导航栏上下移动的高度
    - **示例**： `60`
- `alwaysShow`
    - **数据类型**： 布尔类型
    - **默认值**： `true`
    - **含义**： 是否一直显示，如果设为false，只有在滚动到文章主体范围时才会自动显示，超过范围时将会自动消失
    - **示例**： `true`
- `collapseOnInit`
    - **数据类型**： 布尔类型
    - **默认值**： `false`
    - **含义**： 初始化时折叠，为true时生成导航目录默认为折叠起来
    - **示例**： `true`
    
    
## License
* 本项目的所有代码按照 [MIT License](https://github.com/racaljk/hosts/blob/master/LICENSE) 发布
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
