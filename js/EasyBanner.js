/*!
 * EasyBanner 
 *
 * Date: 2016-12-5
 * Author: leohowl
 */

(function( window ){
    // var EasyBanner = window.EasyBanner;

    function EasyBanner(opts){
        this.viewWidth = $(window).width();
        this.viewWidth = $(window).width();
        this.wrap = $(opts.wrap) ||  null;//father wrap
        this.img = this.wrap.find(opts.img) || null;//image wrap
        this.imgNum = this.img.length;//image number
        this.speed  = opts.speed || 1000;//banner change speed
        this.interval = (opts.interval > this.speed + 500) ? opts.interval : 2000;
        this.mode = opts.mode || 'auto';
        this.control = opts.control || null;
        this.method = opts.method || 'fade';
        this.direction = opts.direction || 'right';//the direction of enter
        this.displacement = opts.displacement || 0;
        this.preImg = 0;//index of previous  image
        this.curImg = 0;//index of current image
        this.targetIndex = 0;
        this.actionAble = true;//enable change image
        this.wrapWidth = this.wrap.width();
        this.wrapHeight = this.wrap.height();
        this.easing = opts.easing || '';
        this.initLeft = 0;//img position
        this.initTop = 0;
        this.t_autoClick = null;//自动轮播定时器
        this.beforeActionCallback = opts.beforeActionCallback || function(){};
        this.afterActionCallback = opts.afterActionCallback || function(){};
        this.delayBefore = opts.delayBefore || 0;
        this.delayAfter = opts.delayAfter || 0;
        this.leftArrow = opts.leftArrow || false;
        this.rightArrow = opts.rightArrow || false;
        this.arrow = !!(opts.leftArrow && opts.rightArrow);
        this.btn = opts.btn || false;
        this.smallImg = opts.smallImg || false;
        this.timeLine = opts.timeLine || false;
        //杂项
        this.waterMark = opts.waterMark || false;
        this.init();//initialize

    }

    EasyBanner.prototype = {
        constructor : EasyBanner,

        init : function(){
            //show Author
            if(this.waterMark){
                // this.showDesign();
            }
            //normal init
            this.wrap.css({
                position: 'relative',
                overflow: 'hidden'
            });
            this.img.css({//default init
                position : 'absolute',
                left: 0,
                top: 0
            });
            this.img.removeClass('EasyBannerActive');
            this.img.eq(0).addClass('EasyBannerActive');
            //移动端时间初始化
            //special init
            switch(this.method){
                case "fade":
                    this.img.hide();
                    this.img.eq(0).show();
                    break;
                case "slide":
                    //also execute with $(window).resize
                    this.slidePositionInit();
                    break;
                default:
                    break;
            }
            //bind
            var eb = this;
            $(window).resize(function(event) {
                eb.wrapWidth = eb.wrap.width();
                eb.wrapHeight = eb.wrap.height();
                //slide position init
                eb.slidePositionInit();
            });
            //扩展初始化
            this.pluginInit();
            if(this.mode == 'auto'){
                //当前为自动；轮播模式
                this.t_autoClick = setTimeout(function(){eb.next();},this.interval);
            }

        },
        slidePositionInit : function(){
            //set origin position
            if(this.method != 'slide'){
                return false;
            }
            switch(this.direction){
                case "right":
                    this.initLeft = this.wrapWidth;
                    this.initTop = 0;
                    break;
                case "left":
                    this.initLeft = -this.wrapWidth;
                    this.initTop = 0;
                    break;
                case "top":
                    this.initLeft = 0;
                    this.initTop = -this.wrapHeight;
                    break;
                case "bottom":
                    this.initLeft = 0;
                    this.initTop = this.wrapHeight;
                    break;
            }
            var eb = this;
            this.img.each(function(index, el) {
                $(this).css({
                    left: eb.initLeft+'px',
                    top: eb.initTop+'px',
                    'z-index' : 101
                });
            });
            //初次位置初始化检查
            var activeIndex = 0;
            this.img.each(function(index, el) {
                if($(this).hasClass('EasyBannerActive')){
                    activeIndex = index;
                    return null;
                }
            });
            // console.log(activeIndex);
            this.img.eq(activeIndex).css({
                'z-index': 100,
                left: 0,
                top: 0
            });
        },
        pluginInit : function(){
            /**
             * 焦点初始化，在被动模式下，不会初始化翻页，不会为按钮绑定点击事件
             * @type {EasyBanner}
             */
            var eb = this;
            if(this.btn){
                $(this.btn).removeClass('EasyBannerBtnActive');
                $(this.btn).eq(0).addClass('EasyBannerBtnActive');
                //如果不是被动模式则为按钮绑定点击事件
                if(this.mode != "passive"){
                    $(this.btn).on('click',function(){
                        var index = $(this).index();
                        eb.jump(index,'click');
                    });
                }
            }
            //翻页按钮初始化
            if(this.arrow && this.mode != 'passive'){
                //
                $(this.leftArrow).on('click',function(){
                    //翻页，上一张
                    eb.prev();
                });
                $(this.rightArrow).on('click',function(){
                    //翻页，下一张
                    eb.next();
                })
            }
        },
        action : function(targetIndex){
            var currentIndex = this.curImg;
            //设置banner的active
            this.img.removeClass('EasyBannerActive');
            this.img.eq(targetIndex).addClass('EasyBannerActive');
            switch (this.method){
                case "fade":
                    fade(this);
                    break;
                case "slide":
                    slide(this);
                    break;
            }
            if(this.mode == 'auto'){
                //如果当前为自动模式，则自动切换
                var eb = this;
                this.t_autoClick = setTimeout(function(){eb.next();},this.interval);
            }

            var i = 1;
            function fade(eb){
                eb.img.eq(eb.curImg).fadeOut(eb.speed);
                eb.img.eq(targetIndex).fadeIn(eb.speed,function(){
                    //自定义回调函数
                    eb.callback(eb.afterActionCallback,eb.delayAfter);
                    //调用插件
                    var pluginOpts = {
                        type : 'after',
                        targetIndex : targetIndex
                    };
                    eb.plugin(pluginOpts);
                    //设置请求标志位允许
                    eb.actionAble = true;
                    //动画完成，设置图片指针
                    eb.preImg = eb.curImg;
                    eb.curImg = targetIndex;
                });

            }
            function slide(eb){
                eb.img.eq(eb.curImg).css('z-index', '100');
                eb.img.eq(eb.curImg).animate({
                    left: -eb.initLeft*eb.displacement,
                    top: -eb.initTop*eb.displacement
                },eb.speed,eb.easing,function(){
                    //退场图片样式
                    $(this).css({
                        left: eb.initLeft,
                        top: eb.initTop,
                        'z-index':101
                    });
                    //自定义回调函数
                    eb.callback(eb.afterActionCallback,eb.delayAfter);
                    //调用插件
                    var pluginOpts = {
                        type : 'after',
                        targetIndex : targetIndex
                    };
                    eb.plugin(pluginOpts);
                    //设置请求标志位允许
                    eb.actionAble = true;
                    //动画完成，设置图片指针
                    eb.preImg = eb.curImg;
                    eb.curImg = targetIndex;
                });
                eb.img.eq(targetIndex).animate({
                    left: 0,
                    top: 0}, eb.speed, eb.easing);
            }
        },
        changeAction : function(opts){
            //
            var eb = this;
            //响应请求
            if(!this.actionAble){
                return;
            }
            //参数处理
            var targetIndex = opts.targetIndex;

            //暴露切换的目标图片，方便外部引用
            this.targetIndex = targetIndex;

            //设置请求标志位为不允许
            this.actionAble = false;

            //清除开始进行轮播后产生定时器
            if(this.t_autoClick){ clearTimeout(this.t_autoClick); }

            //如果开启控制模式，这可以控制其他轮播
            if(this.control){
                var i;
                for(i = 0; i < this.control.length; i++){
                    var run = function(i){
                        var obj = eb.control[i].object;
                        var delay = eb.control[i].delay;
                        var t_mode = setTimeout(function(){obj.jump(targetIndex,'control');},delay);//control 表示是由控制机控制
                    };
                    run(i);
                }
            }
            //执行前执行回调函数
            this.callback(this.beforeActionCallback, this.delayBefore);
            //调用插件
            var pluginOpts = {
                type : 'before',
                targetIndex : targetIndex
            };
            this.plugin(pluginOpts);
            //选择动作方法
            switch (this.method){
                case 'fade':
                    this.action(targetIndex);
                    break;
                case 'slide':
                    this.action(targetIndex);
            }
        },

        /**
         * 下一张，使当前的curImg增加1，然后调用图片切换
         */
        next : function(){
            //被动模式中，亦不可通过调用方法翻页
            if(this.mode != 'passive'){
                this.changeAction({
                    targetIndex : (this.curImg + 1) % this.imgNum
                });
            }

        },
        /**
         * 上一张，使当前的curImg减少1，然后调用图片切换
         */
        prev : function(){
            if(this.mode != 'passive'){
                this.changeAction({
                    targetIndex : (this.curImg - 1 + this.imgNum) % this.imgNum
                });
            }
        },

        /**
         *
         * @param index 切换的目标图片
         * @param type 当前控制模式
         */
        jump : function(index,type){
            //type的类型：click来自鼠标点击，control来自控制机。
            if(type == 'control' && this.mode != 'passive'){
                //表示当前为控制机操作，若没有启用被动模式则不执行，控制机误操作防止
                return;
            }
            this.changeAction({
                targetIndex : index
            });
        },
        plugin : function(opts){
            if(opts.type == 'before'){
                if(this.btn){
                    //btn设置
                    $(this.btn).removeClass('EasyBannerBtnActive');
                    $(this.btn).eq(opts.targetIndex).addClass('EasyBannerBtnActive');
                }
            }
            if(opts.type == 'after'){

            }
        },
        callback : function(c,delay){
            var delay = delay || 0;
            if( typeof c == 'function'){
                var t_callback = setTimeout(function () {
                    c();
                },delay);
                // console.log("callback");
            }
        }
    };
    window.EB = EasyBanner;
    window.EasyBanner = window.EB;
})(window);