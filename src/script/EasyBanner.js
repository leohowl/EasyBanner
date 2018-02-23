/*!
 * EasyBanner 
 *
 * Date: 2016-12-5
 * Author: leohowl
 */


!(function( window ){

    'use strict';

    // var EasyBanner = window.EasyBanner;

    function EasyBanner(opts){
        /**
         *
         * @param {viewWidth} 浏览器有效宽度
         */
        this.viewWidth = $(window).width();

        /**
         *
         * @param {viewHeight} 浏览器有效高度
         */
        this.viewHeight = $(window).height();

        /**
         *
         * @param {wrap} 父级容器
         */
        this.wrap = $(opts.wrap) ||  null;

        /**
         *
         * @param {img} 子元素
         * 子元素将从父级容器中查找，不必重复父级容器的选择器
         *
         */
        this.img = this.wrap.find(opts.img) || null;

        /**
         * @param {imgNum} 子元素的图片
         * 自动生成，无需手动添加
         */
        this.imgNum = this.img.length;

        /**
         *
         * @param {speed} 子元素切换速度
         */
        this.speed  = opts.speed || 1000;

        /**
         *
         * @param {interval} 子元素切换间隔
         */
        this.interval = (opts.interval > this.speed + 500) ? opts.interval : 2000;

        /**
         *
         * @param {mode} 切换模式
         * 包括"auto","click","passive"
         * auto模式下将自动切换
         * click模式下，需要通过点击“焦点”或“上一张，下一张”按钮切换
         * passive模式下，只能被其他实例控制
         */
        this.mode = opts.mode || 'auto';

        /**
         *
         * @param {control} 控制模式
         * 实例开启此项时，将被作为控制机使用，控制其他mode为passive的实例
         */
        this.control = opts.control || null;

        /**
         *
         * @param {method} 切换风格
         * fade为渐入渐出
         * slide为滑动
         */
        this.method = opts.method || 'fade';

        /**
         *
         * @param {direction} 切换方向
         * 此项为method为“slide”的进一步配置，用于设置滑动方向
         */
        this.direction = opts.direction || 'right';

        /**
         *
         * @param {displacement} slide切换的相对位移，取值范围为[0,1]
         */
        this.displacement = opts.displacement || 0;

        /**
         *
         * @param {preImg} 上一个显示的元素的index
         */
        this.preImg = 0;

        /**
         *
         * @param {curImg} 当前显示的元素的index
         */
        this.curImg = 0;

        /**
         *
         * @param {targetIndex} 目标显示的元素的index
         */
        this.targetIndex = 0;

        /**
         *
         * @param {actionAble} 切换保护
         */
        this.actionAble = true;

        /**
         *
         * @param {wrapWidth} 父级容器宽度
         */
        this.wrapWidth = this.wrap.width();

        /**
         *
         * @param {wrapHeight} 父级容器高度
         */
        this.wrapHeight = this.wrap.height();

        /**
         *
         * @param {easing} 缓动效果
         */
        this.easing = opts.easing || '';

        /**
         *
         * @param {initLeft} 子元素初始化位置信息
         */
        this.initLeft = 0;

        /**
         *
         * @param {initLeft} 子元素初始化位置信息
         */
        this.initTop = 0;

        /**
         *
         * @param {timer_autoClick} 自动轮播定时器
         */
        this.timer_autoClick = null;

        /**
         *
         * @param {beforeActionCallback} 子元素切换前回调函数
         */
        this.beforeActionCallback = opts.beforeActionCallback || function(){};

        /**
         *
         * @param {afterActionCallback} 子元素切换后回调函数
         */
        this.afterActionCallback = opts.afterActionCallback || function(){};

        /**
         *
         * @param {delayBefore} 子元素切换前回调函数的执行延时
         */
        this.delayBefore = opts.delayBefore || 0;

        /**
         *
         * @param {delayAfter} 子元素切换后回调函数的执行延时
         */
        this.delayAfter = opts.delayAfter || 0;

        /**
         *
         * @param {leftArrow} ”上一张“切换按钮
         */
        this.leftArrow = opts.leftArrow || false;

        /**
         *
         * @param {rightArrow} ”下一张“切换按钮
         */
        this.rightArrow = opts.rightArrow || false;

        /**
         *
         * @param {arrow} 切换按钮设置完全验证
         */
        this.arrow = !!(opts.leftArrow && opts.rightArrow);

        /**
         *
         * @param {btn} 切换焦点
         */
        this.btn = opts.btn || false;

        
        this.init();//initialize

    }

    EasyBanner.prototype = {

        constructor : 'EasyBanner',

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
                case "film":
                    // film mode
                    this.filmPositionInit();
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
                eb.filmPositionInit();
            });
            //扩展初始化
            this.pluginInit();
            if(this.mode === 'auto'){
                //当前为自动；轮播模式
                this.timer_autoClick = setTimeout(function(){eb.next();},this.interval);
            }

        },
        slidePositionInit : function(){
            //set origin position
            if(this.method !== 'slide'){
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
                default:
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

            this.img.eq(activeIndex).css({
                'z-index': 100,
                left: 0,
                top: 0
            });
        },
        filmPositionInit: function(){
            //film mode
            if(this.method !== 'film'){
                console.error('error method');
                return false;
            }
            var eb = this;
            var activeIndex = 0;
            //定位

            for(var i = 0; i < this.img.length; i++){
                //初始化图片位置
                this.img.eq(i).css({
                    left:(eb.wrapWidth*(i - activeIndex))+'px',
                    top:0,
                    'z-index':101
                })
            }
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
                if(this.mode !== "passive"){
                    $(this.btn).on('click',function(){
                        var index = $(this).index();
                        eb.jump(index,'click');
                    });
                }
            }
            //翻页按钮初始化
            if(this.arrow && this.mode !== 'passive'){
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
        action : function( targetIndex ){
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
                case 'film':
                    film(this);
                    break;
            }
            if(this.mode === 'auto'){
                //如果当前为自动模式，则自动切换
                var eb = this;

                this.timer_autoClick = setTimeout(function(){eb.next();}, this.interval);
            }

            function fade(eb){

                eb.img.eq(eb.curImg).fadeOut(eb.speed);

                eb.img.eq(targetIndex).fadeIn(eb.speed,function(){
                    //自定义回调函数
                    eb.callback(eb.afterActionCallback, eb.delayAfter);
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
                    eb.callback(eb.afterActionCallback, eb.delayAfter);
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
                    top: 0}, eb.speed, eb.easing
                );
            }

            function film(eb){
                eb.img.each(function(index){
                    eb.img.eq(index).animate({
                        left: (index - targetIndex)*eb.wrapWidth + 'px'
                    }, eb.speed, eb.easing, function(){
                        if(index === eb.imgNum - 1){
                            //自定义回调函数
                            eb.callback(eb.afterActionCallback, eb.delayAfter);
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
                        }
                    });
                });
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

            //若目标图片为当前图片，则忽略
            if(this.curImg === targetIndex){
                return;
            }

            //暴露切换的目标图片，方便外部引用
            this.targetIndex = targetIndex;

            //设置请求标志位为不允许
            this.actionAble = false;

            //清除开始进行轮播后产生定时器
            if(this.timer_autoClick){ clearTimeout(this.timer_autoClick); }

            //如果开启控制模式，这可以控制其他轮播
            if(this.control){
                for(var i = 0; i < this.control.length; i++){
                    var run = function(i){
                        var obj = eb.control[i].object;
                        var delay = eb.control[i].delay;
                        var t_mode = setTimeout(function(){obj.jump(targetIndex, 'control');}, delay);//control 表示是由控制机控制
                    };
                    run(i);
                }
            }
            //执行前执行回调函数
            this.callback(this.beforeActionCallback, this.delayBefore);

            //调用插件
            this.plugin({
                type : 'before',
                targetIndex : targetIndex
            });

            this.action(targetIndex);
        },

        /**
         * 下一张，使当前的curImg增加1，然后调用图片切换
         */
        next : function(){
            //被动模式中，亦不可通过调用方法翻页
            if(this.mode !== 'passive'){
                this.changeAction({
                    targetIndex : (this.curImg + 1) % this.imgNum
                });
            }

        },
        /**
         * 上一张，使当前的curImg减少1，然后调用图片切换
         */
        prev : function(){
            if(this.mode !== 'passive'){
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
        jump : function( index, type ){
            //type的类型：click来自鼠标点击，control来自控制机。
            if(type === 'control' && this.mode !== 'passive'){
                //表示当前为控制机操作，若没有启用被动模式则不执行，控制机误操作防止
                return;
            }
            this.changeAction({
                targetIndex : index
            });
        },
        plugin : function(opts){
            switch (opts.type) {
                case 'before':
                    if(this.btn){
                        //btn设置
                        $(this.btn).removeClass('EasyBannerBtnActive');
                        $(this.btn).eq(opts.targetIndex).addClass('EasyBannerBtnActive');
                    }
                    break;
                case 'after':
                    break;
                default:
                    break;
            }
        },
        callback : function(c, delay){
            delay = delay || 0;
            if( typeof c === 'function'){
                var t_callback = setTimeout(function () {
                    c();
                }, delay);
            }
        }
    };

    window.EasyBanner = EasyBanner;

})( window );