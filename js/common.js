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
        this.interval = (opts.interval > this.speed + 500) ? opts.interval : 3000;
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
        this.arrow = (opts.leftArrow&&opts.rightArrow) ? true : false;
        this.init();//进行初始化
    }

    EasyBanner.prototype = {
        constructor : EasyBanner,
        init : function(){
            //normal init
            this.wrap.css({
                position: 'relative',
                property2: 'value2'
            });
        },
        test : function(){
            console.log(this.interval);
        },
        main : function(opts){
            console.log('main');
        }
    }

    window.EasyBanner = window.EB = EasyBanner;
})(window);