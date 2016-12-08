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
        this.img = $(opts.img) || null;//image wrap
        this.imgNum = this.img.length;//image number
        this.speed  = opts.speed || 1000;//banner change speed
        this.interval = (opts.interval > this.speed + 500) ? opts.interval : 2000;
        this.mode = opts.mode || 'auto';
        this.method = opts.method || 'fade';
        this.direction = opts.direction || 'right';//the direction of enter
        this.displacement = opts.displacement || 0;
        this.preImg = 0;//index of previous  image
        this.curImg = 0;//index of current image
        this.actionAble = true;//enable change image
        this.wrapWidth = this.wrap.width();
        this.wrapHeight = this.wrap.height();
        this.easing = opts.easing || '';
        this.initLeft = 0;//img position
        this.initTop = 0;
        var t_autoClick = null;//自动轮播定时器
        this.beforeActionCallback = opts.beforeActionCallback || function(){};
        this.afterActionCallback = opts.afterActionCallback || function(){};
        this.delayBefore = opts.delayBefore || 0;
        this.delayAfter = opts.delayAfter || 0;
        this.arrow = (opts.leftArrow&&opts.rightArrow) ? true : false;
        this.btn = opts.btn || false;
        this.smallImg = opts.smallImg || false;
        this.timeLine = opts.timeLine || false;
        this.init();//initialize
        // console.log(typeof this.slidePositionInit);
        
    }

    EasyBanner.prototype = {
        constructor : EasyBanner,
        
        init : function(){
            //normal init
            this.wrap.css({
                position: 'relative',
                overflow: 'hidden',
            });
            this.img.css({//default init
                position : 'absolute',
                left: 0,
                top: 0,
            });
            this.img.removeClass('EasyBannerActive');
            this.img.eq(0).addClass('EasyBannerActive');
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
            $(window).resize(function(event) {
                this.wrapWidth = this.wrap.width();
                this.wrapHeight = this.wrap.height();
                //slide position init
                this.slidePositionInit();
            });
            if(this.mode == 'auto'){
                t_autoClick = setTimeout(this.next,this.interval);
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
                this.initLeft = this.wrapHeight;
                this.initTop = 0;
                break;
            }
            this.img.each(function(index, el) {
                $(this).css({
                    left: initLeft,
                    top: initTop,
                    'z-index' : 101,
                });
            });
            //初次位置初始化检查
            var activeIndex = 0;
            this.img.each(function(index, el) {
                if($(this).hasClass('EasyBannerActive')){
                    activeIndex = index;
                    return;
                }
            });
            this.img.eq(activeIndex).css({
                'z-index': 100,
                left: 0,
                top: 0,
            });
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
            
            t_autoClick = setTimeout(this.next,this.interval);
            var i = 1;
            function fade(eb){
                eb.img.eq(eb.curImg).fadeOut(eb.speed);
                eb.img.eq(targetIndex).fadeIn(eb.speed,function(){
                    //自定义回调函数
                    eb.callback(eb.afterActionCallback,eb.delayAfter);
                    //调用插件
                    eb.plugin('after');
                    //设置请求标志位允许
                    eb.actionAble = true;
                    //动画完成，设置图片指针
                    eb.preImg = eb.curImg;
                    eb.curImg = targetIndex;
                });

            }
            function slide(eb){

            }
        },
        changeAction : function(opts){
            //响应请求
            if(!this.actionAble){
                return;
            }
            //参数处理
            var targetIndex = opts.targetIndex;
            //设置请求标志位为不允许
            this.actionAble = false;
            //清除开始进行轮播后产生定时器
            clearTimeout(t_autoClick);
            //执行前执行回调函数
            this.callback(this.beforeActionCallback, this.delayBefore);
            //调用插件
            this.plugin('before');
            //选择动作方法
            switch (this.method){
                case 'fade':
                this.action(targetIndex);
                break;
                case 'slide':
                this.action(targetIndex);
            }
        },
        next : function(){
            this.changeAction({
                targetIndex : (this.curImg + 1) % this.imgNum,
            });
        },
        prev : function(){
            this.changeAction({
                targetIndex : (this.curImg - 1 + this.imgNum) % this.imgNum,
            });
        },
        jump : function(index){
            this.changeAction({
                targetIndex : index,
            });
        },
        // main : function(easybanner){
        //     //运动
        //     var action = {
        //         fade : function(targetIndex, callback, delay){
        //             var callback = callback || function(){};
        //             var delay = delay || 0;
        //             var currentIndex = easybanner.curImg;
        //             easybanner.img.eq(targetIndex).fadeIn(easybanner.speed,function(){
        //                 //自定义回调函数
        //                 easybanner.callback(callback,0);
        //                 //调用插件
        //                 easybanner.plugin('after');
        //                 //设置请求标志位允许
        //                 easybanner.actionAble = true;
        //                 //动画完成，设置图片指针
        //                 easybanner.preImg = easybanner.curImg;
        //                 easybanner.curImg = targetIndex;
        //             });
        //             //设置active
        //             easybanner.img.removeClass('active');
        //             easybanner.img.eq(targetIndex).addClass('active');
        //             easybanner.img.eq(easybanner.curImg).fadeOut(easybanner.speed);
        //             easybanner.t_autoClick = setTimeout(function(){change.next();},easybanner.interval)

        //         },
        //         slide : function(targetIndex,callback){
        //             var callback = callback || function(){};
        //             var delay = delay || 0;
        //         },
        //     };
        //     var change = {
        //         actionChange : function(opts){
        //             //响应操作请求
        //             if(!easybanner.actionAble){
        //                 return;
        //             }
        //             //参数处理
        //             var targetIndex = opts.targetIndex;
        //             var beforeActionCallback = opts.beforeActionCallback || function(){};
        //             var afterActionCallback = opts.afterActionCallback || function(){};
        //             var delayBefore = opts.delayBefore || 0;
        //             var delayAfter = opts.delayAfter || 0;
        //             //设置请求标志位为不允许
        //             easybanner.actionAble = false;
        //             //清除定时器
        //             clearTimeout(this.t_autoClick);
        //             //执行前调用
        //             this.callback(beforeActionCallback, delayBefore);
        //             //调用插件
        //             this.plugin('before');
        //             //选择动作方法
        //             switch (easybanner.method){
        //                 case 'fade':
        //                 action.fade(targetIndex, afterActionCallback, delayAfter);
        //                 break;
        //                 case 'slide':
        //                 action.slide(targetIndex, afterActionCallback, delayAfter);
        //             }
        //         },
        //         next : function(){
        //             change.actionChange({
        //                 targetIndex : (easybanner.curImg + 1) % easybanner.imgNum,
        //             });
        //         },
        //         prev : function(){
        //             change.actionChange({
        //                 targetIndex : (easybanner.curImg - 1 + easybanner.imgNum) % easybanner.imgNum,
        //             });
        //         },
        //         jump : function(index){
        //             change.actionChange({
        //                 targetIndex : index,
        //             });
        //         },
        //     }
        //     var t_firstChange = setTimeout(function(){change.next();},easybanner.interval);
        // },
        plugin : function(type){

        },
        test : function(){
            console.log(this.interval);
        },
        callback : function(c,delay){
            var delay = delay || 0;
            if( typeof c == 'function'){
                var t_callback = setTimeout(c(),delay);
            }
        },
    }
    window.EasyBanner = window.EB = EasyBanner;
})(window);