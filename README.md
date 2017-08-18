EasyBanner
=
####简介：

EasyBanner是一个能够满足大部分网页轮播需求的轮播插件，它是基于jQuery的。这个轮播插件的意义在于：只要你按照插件的语法构建DOM，并进行一些简短的、必要的引用就可以实现一个轮播的功能，当然通过一些额外的设置，他还可以完成一些其他类似轮播的功能。
使用方法
####基础应用：
下面通过一个简单的例子演示怎么快速创建一个轮播图。
准备DOM：
```
<div id="main">
    <div class="main" id="main1"></div>
    <div class="main" id="main2"></div>
    <div class="main" id="main3"></div>
</div>
```
其中#main是轮播图的外部容器，要注意的是它的样式表应包含;
```
overflow:hidden;
position:relative;
```
当然，你不需要在层叠样式表中体现出来，因为插件在成初始化后会设置这些属性，但是你需要知道这些变化，因为这可能会影响你的布局。
引入插件：
```
<script type="text/javascript" src="path/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="path/EasyBanner.js"></script>
```
由于插件是基于jQuery，虽然它不是一个jQuery插件，但是还是需要引入jQuery，因为jQuery用起来太爽了。
创建实例：
```
<script type="text/javascript">
var banner = new EasyBanner({
        wrap:'#main',//轮播容器选择器
        img:'.main',//轮播元素选择器
    });
</script>
```
是的，就只要这样就好了。EasyBanner中预设了大部分的参数，使你在不用额外配置的情况下也可以使用。
####更多设置
但是，这是预设的参数无法满足我们需求，我们可通过重写参数来把轮播设置成我们想要的样子。
```
    var banner = new EasyBanner({
        wrap:'#main1',//轮播图容器
        img:'main',//轮播图元素
        btn:'btn1',//焦点按钮
        leftArrow:'.prev',//翻页按钮上一页
        rightArrow:'.next',//翻页按钮下一页，rightArrow，leftArrow同时设置是才能生效
        speed:1000，//轮播图片切换速度，单位：ms
        interval:6000,//轮播图片切换间隔
        method:'fade|slide',//图片切换方法，目前有淡入和滑入两种方式
        direction:'right|left|top|bottom',//入场方式，只对slide方式有效
        displacement:1,//切换时退场图片的相对位移比例，只对slide方式有效
        easing:'linear',//图片切换的缓动效果。
        beforeActionCallback:function(){
            //do something
        },//轮播动画开始前回调函数
        delayBefore:1000,//轮播动画开始前回调延时
        afterActionCallback:function(){
            //do something
        },//轮播动画结束后回调函数
        delayAfter:1000,//轮播动画结束后回调延时
        smallImg:true,//开启缩略图
        timeLine:true,//开启时间线
        control:[{
            object: banner2,//控制对象
            delay : 0,//执行延时
        }],
        mode : 'passive',//被动模式
    });
```
通过上面的设置我们几乎可以做一个理想的轮播图，但是不足的是没有那么多的切换效果供我们选择，但这并不是这个插件的使命。
####更多功能
也许你已经发现上面的设置中有的设置选项看上去不知所云。它们是为一些扩展功能准备的。
 ######mode:'auto | passive | click'
设置轮播的工作方式，当mode设置为auto时，即为正常的自动轮播。设置为click时，不进行自动轮播需要手动点击焦点按钮或者翻页按钮才能进行图片切换。设置为passive时情况，比较特殊，此时既不是自动轮播，手动点击焦点按钮或者翻页按钮也无效。此时只能被其他轮播控制。
 ######control
当对轮播添加此项设置后，这个轮播图片将会被作为控制机，控制其他轮播跟随自己进行切换。我们暂且把被控制的轮播称为子机。control选项的设置在上面的参数介绍中已经提到，需要注意的是子机的mode设置为passive时，才能真正进行工作。
举例说明：
```
var banner2 = new EasyBanner({
        wrap:'#maina',
        img:'.main',
        method:'slide',
        displacement:0.5,
        direction:'top',
        btn:'.btna1',
        mode : 'passive',//开启被动模式后，被控制,将不会初始化点击事件
    });
    var banner1 = new EasyBanner({
        wrap:'#main',
        img:'.main',
        method:'fade',
        control:[{
            object: banner2,//控制对象
            delay : 0,//执行延时
        }],//被作为控制机使用,在作为控制机使用的时候需要在从机的下方，因为在上方的时候从机还没有定义，会出现未定义错误
    });
```
上面的例子中，实例banner1被设置为控制机，banner2被设置为子机。banner2将跟随banner1的节奏进行切换。需要注意的是作为控制机的banner1必须在banner2的下方，否则banner1的control选项中的object会出现未定义的错误，这是显而易见的。同时，作为子机的banner2的焦点按钮和翻页按钮将会失效。
######回调函数

```

        beforeActionCallback:function(){
            //do something
        },//轮播动画开始前回调函数
        delayBefore:1000,//轮播动画开始前回调延时
        afterActionCallback:function(){
            //do something
        },//轮播动画结束后回调函数
        delayAfter:1000,//轮播动画结束后回调延时

```
通常我们在进行轮播的时候还会想做一些其他的事情，但是我们需要知道轮播进行到了哪一步，于是在轮播的图片切换之前和之后都加入了回调函数，同时为他们加入了执行延时。这样做的好处是，我们可以在确切的时间做一些确切的事情。同样也有一些需要注意的东西：afterActionCallback的回调时间点是在动画操作结束后，当前图片指针变化之前，也就是说图片指针（暂且将图片的index叫指针吧，觉得这样更加形象一点）仍在上一张退场图片上。可以通过类似banner1.curImg的方式获取当前显示图片的指针。另外，需要注意回调函数的作用域。
####另外需要知道的事情
为了便于书写样式，或者实现其他什么功能。在显示的图片上回添加一个类名“EasyBannerActive“，类似的在相应的焦点按钮上会添加一个类名“EasyBannerBtnActive“。
缩略图和时间线的功能尚未完成，因为他们并不是很需要的功能。
