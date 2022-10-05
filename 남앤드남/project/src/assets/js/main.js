"use strict";

$(document).ready(function(){
    $('.wrap.main').animate({
        'opacity' : 1,
    },500);
    
    if(uiCommon.mobileCheck._isMobile){
        if($('.wrap.main').length > 0){
            mainUi.mobile.init();
            mainUi.mainVisual.init();
            mainUi.headerCtr.init();
            mainUi.boardCtr.init();
            $('.main-popup').length > 0 && mainUi.mainPop.init();

            if ( $('html').attr('lang') =='en' || $('html').attr('lang') =='zh' ) {
                mainUi.scrollEv_en_cn.sectionAni();
            }else{
                mainUi.scrollEv_kr.sectionAni();
            }
        }
    } else {
        mainUi.init();
    }
});

$(window).on('beforeunload', function () {
    $(window).scrollTop(0);
});

const mainUi = (function (mainUi, $window) {
    mainUi.init = function () {
        $('.main-popup').length > 0 && mainUi.mainPop.init();
        $('.wrap.main').length > 0 && mainUi.headerCtr.init();
        $('.wrap.main').length > 0 && mainUi.mainVisual.init();
        $('.wrap.main').length > 0 && $('html').attr('lang') =='ko' && mainUi.scrollEv_kr.init();
        if ( $('.wrap.main').length > 0 ) {
            if ( $('html').attr('lang') =='en' || $('html').attr('lang') =='zh' ) {
                mainUi.scrollEv_en_cn.init();
            }
        }
        $('.wrap.main').length > 0 && $('html').attr('lang') =='ko' && mainUi.boardCtr.init();
    };
    mainUi.headerCtr = {
        init: function() {
            this.headerScr();
        },
        headerScr : function(){
            $window.on('scroll',function(){
                let scTop = $(this).scrollTop();
                $('.header').removeClass('is-scroll');

                if(scTop > $('.main-visual').height() ){
                    $('.header').addClass('is-scroll');
                }else{
                    $('.header').removeClass('is-scroll');
                }
            });
        },
    }
    mainUi.mainPop = {
        init:function(){
            this.setDefault('.main-popup');
            this.slide('.popup-slide');
            this.event();
        },
        setDefault:function(elem){
            $('body').addClass('scrollOff');
            $('body').append('<div class="dimmed"></div>');
            $(elem).addClass('is-active');
        },
        slide:function(elem){
            $(elem).slick({
                speed:200,
                arrows:false,
                initialSlide:0,
                dots:true,
                adaptiveHeight: true,
                infinite:false
            });
        },
        event:function(){
            let _this = this;
            $('.main-popup .popup-close').on('click', function(){
                _this.close('.main-popup');
            });
        },
        close:function(elem){
            $('body').removeClass('scrollOff');
            $(elem).removeClass('is-active');
            $('.dimmed').remove();
        }
    };
    mainUi.mainVisual = {
        init: function(){
            this.mainSlider();
        },
        mainSlider : function(){
            const barAni = 18000,
                  $el_length = $('.main-slider li').length,
                  $bar = $('.progress-bar .bar'),
                  timeW = $('.progress-bar').width();
            let index = $('.page-num__current').text();

            $('.main-slider').on({
                init : function(event,slick){
                    $(this).siblings('.slider-util').find('.bar').css({'animation-duration': (barAni/1000)+0.3+'s'});
                    $('.page-num__total').text($el_length);
                    $bar.stop().animate({
                        width : timeW
                    }, barAni, "linear", function() {
                        $(this).css({'width': '0'});
                    });
                },
                beforeChange : function(event, { slideCount: count }, currentSlide, nextSlide){
                    $('video').get(nextSlide).currentTime = 0;
                    $('.page-num__current').text(nextSlide+1);
                    $bar.stop().width(0);
                },
                afterChange : function(event, slick, currentSlide){
                    $bar.stop().animate({
                        width : timeW
                    }, barAni, "linear", function() {
                        $(this).css({'width': '0'});
                    });
                }
            });

            $('.main-slider').not('.slick-initialized').slick({
                dots: false,
                prevArrow: $('.util-prev'),
                nextArrow: $('.util-next'),
                pauseOnHover:false,
                infinite: true,
                speed: 1000,
                fade: true,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: true,
                autoplaySpeed: barAni,
            });

            
            $('.util-pause').on('click',function(){
                let index = $('.page-num__current').text(),
                    w = $('.progress-bar .bar').width();

                $('.main-slider').slick('slickPause');
                $(this).removeClass('on').siblings('.util-play').addClass('on');

                $bar.stop().width(w);
                $('.video' + index).get(0).pause();

            });
            $('.util-play').on('click',function(){
                let index = $('.page-num__current').text();

                $('.main-slider').slick('slickPlay');
                $(this).removeClass('on').siblings('.util-pause').addClass('on');

                $('.video' + index).get(0).play();
                $bar.stop().animate({
                    width : timeW
                }, barAni, "linear", function() {
                    $('.video' + index).get(0).pause();
                    $(this).css({'width': '0'});
                });
            });

            $('.slick-arrow').on('click',function(){
                $('.util-play').removeClass('on').siblings('.util-pause').addClass('on');
                $bar.stop().width(0); 
                $('.video' + index).get(0).play();
            });
        },
    };
    mainUi.scrollEv_kr = {
        init: function(){
            this.scrollInit();
            this.scrollEv();
            this.sectionAni();
        },
        scrollInit : function(){
            let sumHeight = 0,
            epilHeight = $('.main-epilogue').height(),
            h = 0,
            fakeHeight = 0;

            if($window.width() < 767){
                fakeHeight = 0;
            }else{
                fakeHeight = 6000;
            }

            if($window.width() < 1025){
                h = 800;
            }else{
                h = 1800;
            }

            $('.quick-menu').scrollTop(800);
            
            setTimeout(function(){
                $('.quick-menu').animate({
                    scrollTop : 0
                }, 1000);
            }, 300);

            $('.main .section').each(function(index, item){
                var posi = $(item).index() * $(window).height(),
                    sec_h = $(window).height();

                if ( index == 3 ) {
                    posi = posi + fakeHeight;
                    sumHeight += $(item).height();
                }else {
                    sumHeight += sec_h;
                }

                $(item).css({ 'top' :  posi});
            });
            $('#wrap.main .container').css({'height' : sumHeight + epilHeight + fakeHeight + h + 'px'}); 
            
        },
        scrollEv: function(){
            let $mainVi = $('.main-visual'),
                $sec01 = $('.section-01'),
                $sec02 = $('.section-02'),
                $sec03 = $('.section-03'),
                $navi = $('.main-indi li'),
                epilHeight = $('.main-epilogue').height(),
                _top01 = $sec01.offset().top, 
                _top02 = $sec02.offset().top,
                _top03 = $sec03.offset().top,
                timer;

            $navi.find('a').on('click', function() {
                var index = $(this).parent().index(),
                    posi;

                $('.main-indi').removeClass('color-change');
                $navi.removeClass('on').eq(index).addClass('on');
                $sec02.find('.section-02-text').removeClass('active').css({
                    'top' : '80%',
                    'opacity' : 0,
                    'z-index' : -1
                });

                switch ( index ) {
                    case 0 :
                        posi = 0;
                        break;
                    case 1 :
                        posi = _top01;
                        $('.main-indi').addClass('color-change');
                        break;
                    case 2 :
                        posi = _top02;
                        break;
                    case 3 :
                        posi = _top03;
                        $('.main-indi').addClass('color-change');
                        break;
                };

                $(window).scrollTop(posi);
            });

            $window.on('scroll',function(e){
                let scTop = $window.scrollTop(),
                c = 0,
                d = -50,
                sec01_value = scTop * ( d - c ) / _top01 + c,
                fakeHeight = 0,
                headerH = Number($('.container').css('padding-top').slice(0,-2)),
                h = 0;

                if($window.width() < 767){
                    fakeHeight = 0;
                }else{
                    fakeHeight = 6000
                }

                if($window.width() < 1025){
                    h = 800;
                }else{
                    h = 1600;
                }

                if(!timer){
                    timer = setTimeout(function(){
                        timer = null;
                        let newHeight = $('.height-fix').outerHeight();
                        $mainVi.css({'height': newHeight});                
                        $sec01.css({'height' : newHeight});
                        $sec02.css({'height': newHeight,});
                        $('#wrap.main .container').css({
                            'height' : newHeight * 3 + $sec03.height() + epilHeight + fakeHeight + h +'px'
                        }); 
                        
        
                        // sec01_value > -50 && $mainVi.css('top', sec01_value + "%");
                        $mainVi.css('top', sec01_value + "%");
                        
                        //section01 지날때
                        if ( scTop > _top01 && scTop < _top02) { 
                            scTop = scTop - $(window).height();
                            let sec02_value = scTop * ( d - c ) / newHeight + c;
                            $mainVi.css({
                                'opacity':'0',
                                'position' : 'absolute',
                            });                  
                            $sec01.css({
                                'position' : 'fixed',
                                'top' : sec02_value + "%",
                            });
                        } else {
                            $mainVi.css({
                                'opacity':'1',
                                'position':'fixed'
                            });
                            $sec01.css({
                                'position' : 'absolute',
                                // 'top' : _top01,
                                'top' : newHeight,
                            });
                        }
        
                        //section02 지날때
                        if ( scTop > _top02 && scTop < _top03) { 
                            $sec02.css({
                                'position' : 'fixed',
                                'top' : 0
                            });
                            $mainVi.css({
                                'opacity':'0',
                                'position' : 'absolute'
                            });   
                            scTop = scTop - $(window).height() * 2 - fakeHeight;
                            let sec03_value = scTop * ( d - c ) / newHeight + c;
                            if ( $(window).scrollTop() > _top02 + fakeHeight ) {
                                $sec02.css({
                                    'top' : sec03_value + "%"
                                });
                            }
                        } else {
                            $sec02.css({
                                'position' : 'absolute',
                                // 'top' : _top02,
                                'top' : newHeight * 2,
                            });
                        }
        
                        //section03 지날때
                        if ( scTop > _top03 ) {
                            scTop = scTop - (newHeight * 3 + fakeHeight);
                            let sec04_value = scTop * ( d - c ) / newHeight + c;
                            $mainVi.css({
                                'opacity':'0',
                                'position' : 'absolute'
                            });   
                            $sec03.css({
                                'position' : 'fixed',
                                'top' : sec04_value + "%"
                            });
                            $('.main-epilogue').addClass('show');
                        } else {
                            $sec03.css({
                                'position' : 'absolute',
                                // 'top' : _top03,
                                'top' : newHeight * 3 + fakeHeight,
                            });
                            $('.main-epilogue').removeClass('show');
                        }        
                    },0);
                }

            });
        },
        sectionAni: function(){
            let $mainVisual = $('.section.main-visual'),
            $section = $('.main .section'),
            $sec01 = $('.section-01'),
            $sec02 = $('.section-02'),
            $sec03 = $('.section-03'),
            $navi = $('.main-indi li'),
            $secInfo = $('.section-02 .section-02-text'),
            $sec02_title = $('.section-02-title'),
            _top01 = $sec01.offset().top - 400, 
            _top02 = $sec02.offset().top - 400, 
            _top03 = $sec03.offset().top - 400, 
            _sec02Posi01 = $sec02.offset().top + 1500, 
            _sec02Posi02 = $sec02.offset().top + 3000, 
            _sec02Posi03 = $sec02.offset().top + 4500, 
            _count01 = new countUp.CountUp('count01', 5000),
            _count02 = new countUp.CountUp('count02', 5000),
            _count01Flag = false,
            _count02Flag = false;

            $window.on('scroll',function(){
                let scTop = $window.scrollTop();
                if( scTop < _top01 ){ 
                    $('.main-indi').removeClass('color-change');
                    $navi.removeClass('on').eq(0).addClass('on');
                    $section.removeClass('active');

                }else if( scTop < _top02 ){ 
                    $('.main-indi').addClass('color-change');
                    $navi.removeClass('on').eq(1).addClass('on');
                    $secInfo.removeClass('active');
                    $section.removeClass('active').eq(1).addClass('active');
                    $sec02_title.removeClass('on');

                    if($secInfo.eq(1).hasClass('active')){
                        $secInfo.eq(0).removeClass('active').stop().animate({
                            'top':'-80%',
                            'opacity':'0',
                            'z-index':'-1',
                        }, 200);
                    }
                    $mainVisual.css({'opacity':1});

                }else if( scTop < _top03 && $window.width() > 767 ){ 
                    $('.main-indi').removeClass('color-change');
                    $navi.removeClass('on').eq(2).addClass('on');
                    $section.removeClass('active').eq(2).addClass('active');
                    $sec02_title.removeClass('on').eq(0).addClass('on');
                    
                    if( scTop < _sec02Posi01 ){ //3614 미만

                        if($secInfo.eq(1).hasClass('active')){
                            $secInfo.eq(1).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }

                        if(!$secInfo.eq(0).hasClass('active')){
                            $secInfo.removeClass('active').eq(0).addClass('active').css('top', '-30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0',
                            }, 200);
                        }

                        setTimeout(function(){
                            _count01Flag = false;
                            _count01.reset();
                        },200);

                    }else if( scTop < _sec02Posi02 ){
                        if($secInfo.eq(2).hasClass('active') ){
                            $secInfo.eq(2).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }

                        if($secInfo.eq(0).hasClass('active')){
                            $secInfo.eq(0).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1',
                            }, 200);
                        }
                    
                        if(!$secInfo.eq(1).hasClass('active')){
                            $secInfo.removeClass('active').eq(1).addClass('active').css('top', '30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }else{
                            setTimeout(function(){
                                if ( !_count01Flag ) {
                                    _count01.start();
                                    _count01Flag = true;
                                } 

                                _count02Flag = false;
                                _count02.reset();    
                            },400);
                        }

                    }else if( scTop < _sec02Posi03 ){

                        if($secInfo.eq(3).hasClass('active')){
                            $secInfo.eq(3).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }

                        if($secInfo.eq(1).hasClass('active')){
                            $secInfo.eq(1).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }

                        if(!$secInfo.eq(2).hasClass('active')){
                            $secInfo.removeClass('active').eq(2).addClass('active').css('top', '-30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }else{
                            setTimeout(function(){
                                if ( !_count02Flag ) {
                                    _count02.start();
                                    _count02Flag = true;
                                } 

                                _count01Flag = false;
                                _count01.reset();    
                            },400);
                        }
                        

                    }else if( _sec02Posi03 < scTop ){ 
                        $sec02_title.removeClass('on').eq(1).addClass('on');

                        setTimeout(function(){
                            _count02Flag = false;
                            _count02.reset();
                        },200);

                        if($secInfo.eq(2).hasClass('active') ){
                            $secInfo.eq(2).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);    
                        }
                        if($secInfo.eq(0).hasClass('active')){
                            $secInfo.eq(0).removeClass('active').css({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            });
                        }

                        if($secInfo.eq(1).hasClass('active')){
                            $secInfo.eq(1).removeClass('active').css({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            });
                        }


                        if ( !$secInfo.eq(3).hasClass('active') ) {
                            $secInfo.removeClass('active').eq(3).addClass('active').css('top', '80%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }

                    }
                } else if( scTop < _top03 && $window.width() < 767 ){
                    // mobile section02
                    $sec02_title = $('.mo-view .section-02-title'),
                    $secInfo = $('.mo-view .section-02-text');
                    _count01Flag = false,
                    _count02Flag = false;

                    $mainVisual.css({'opacity':0});
                    $sec02_title.removeClass('on').eq(0).addClass('on');
                    $secInfo.each(function(){
                        if($(this).hasClass('slick-current') === true){
                            $(this).addClass('active').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }
                    });
                } else {
                    $('.main-indi').addClass('color-change');
                    $navi.removeClass('on').eq(3).addClass('on');
                    $section.removeClass('active').eq(3).addClass('active');
                    $sec02_title.removeClass('on');
                    $secInfo.removeClass('active').css({
                        'top':'-80%',
                        'opacity':'0',
                        'z-index':'-1'
                    });
                }
            });

        }
    };
    mainUi.scrollEv_en_cn = {
        init: function(){
            this.scrollInit();
            this.scrollEv();
            this.sectionAni();
        },
        scrollInit : function(){
            let sumHeight = 0,
            epilHeight = $('.main-epilogue').height(),
            h = 0,
            fakeHeight = 0;

            if($window.width() < 767){
                fakeHeight = 0;
            }else{
                fakeHeight = 6000;
            }

            if($window.width() < 1025){
                h = 800;
            }else{
                h = 1800;
            }

            
            $('.quick-menu').scrollTop(800);
            
            setTimeout(function(){
                $('.quick-menu').animate({
                    scrollTop : 0
                }, 1000);
            }, 300);

            $('.main .section').each(function(index, item){
                var posi = $(item).index() * $(window).height(),
                    sec_h = $(window).height();

                if ( index == 3 ) {
                    posi = posi + fakeHeight;
                    sumHeight += $(item).height();
                }else {
                    sumHeight += sec_h;
                }
                $(item).css({ 'top' :  posi});
            });
            $('#wrap.main .container').css({'height' : sumHeight + epilHeight + fakeHeight +  'px'}); 
            
        },
        scrollEv: function(){
            let $mainVi = $('.main-visual'),
                $sec01 = $('.section-01'),
                $sec02 = $('.section-02'),
                $sec03 = $('.section-footer'),
                $navi = $('.main-indi li'),
                epilHeight = $('.main-epilogue').height(),
                _top01 = $sec01.offset().top, 
                _top02 = $sec02.offset().top,
                _top03 = $sec03.offset().top,
                timer;

            $navi.find('a').on('click', function() {
                var index = $(this).parent().index(),
                    posi;

                $('.main-indi').removeClass('color-change');
                $navi.removeClass('on').eq(index).addClass('on');
                $sec02.find('.section-02-text').removeClass('active').css({
                    'top' : '80%',
                    'opacity' : 0,
                    'z-index' : -1
                });

                switch ( index ) {
                    case 0 :
                        posi = 0;
                        break;
                    case 1 :
                        posi = _top01;
                        $('.main-indi').addClass('color-change');
                        break;
                    case 2 :
                        posi = _top02;
                        break;
                };

                $(window).scrollTop(posi);
            });

            $window.on('scroll',function(e){
                let scTop = $window.scrollTop(),
                c = 0,
                d = -50,
                sec01_value = scTop * ( d - c ) / _top01 + c,
                fakeHeight = 0,
                headerH = Number($('.container').css('padding-top').slice(0,-2)),
                h = 0;

                if($window.width() < 767){
                    fakeHeight = 0;
                }else{
                    fakeHeight = 6000
                }

                if($window.width() < 1025){
                    h = 350;
                }else{
                    h = 100;
                }

                if(!timer){
                    timer = setTimeout(function(){
                        timer = null;
                        let newHeight = $('.height-fix').outerHeight();
                        $mainVi.css({'height': newHeight});                
                        $sec01.css({'height' : newHeight});
                        $sec02.css({'height': newHeight,});
                        $('#wrap.main .container').css({
                            'height' : newHeight * 3 + $sec03.height() + epilHeight + fakeHeight + h +'px'
                        }); 
                                
                        $mainVi.css('top', sec01_value + "%");
                        
                        //section01 지날때
                        if ( scTop > _top01 && scTop < _top02) { 
                            scTop = scTop - $(window).height();
                            let sec02_value = scTop * ( d - c ) / newHeight + c;
                            $mainVi.css({
                                'opacity':'0',
                                'position' : 'absolute',
                            });                  
                            $sec01.css({
                                'position' : 'fixed',
                                'top' : sec02_value + "%",
                            });
                        } else {
                            $mainVi.css({
                                'opacity':'1',
                                'position':'fixed'
                            });
                            $sec01.css({
                                'position' : 'absolute',
                                // 'top' : _top01,
                                'top' : newHeight,
                            });
                        }
        
                        //section02 지날때
                        if ( scTop > _top02 && scTop < _top03) { 
                            $sec02.css({
                                'position' : 'fixed',
                                'top' : 0
                            });
                            $mainVi.css({
                                'opacity':'0',
                                'position' : 'absolute'
                            });   
                            scTop = scTop - $(window).height() * 2 - fakeHeight;
                            var sec03_value = scTop * ( d - c ) / newHeight + c;
                            if ( $(window).scrollTop() > _top02 + fakeHeight ) {
                                $sec02.css({
                                    'position' : 'absolute',
                                    'top' : newHeight * 2 + fakeHeight                                    
                                    // 'top' : -($(window).scrollTop() - (_top02 + fakeHeight)) + "px"                                    
                                    // 'top' : sec03_value + "%"
                                });
                                $sec03.css({
                                    'position' : 'absolute',
                                    'top' : newHeight * 3 + fakeHeight,
                                });
                            }
                        } else {
                            $sec02.css({
                                'position' : 'absolute',
                                // 'top' : _top02,
                                'top' : newHeight * 2,
                            });
                        }
        
                        //section03 지날때
                        if (_top03 < scTop) {
                            scTop = scTop - (newHeight * 3 + fakeHeight);
                            let sec04_value = scTop * ( d - c ) / newHeight + c;
                            $mainVi.css({
                                'opacity':'0',
                                'position' : 'absolute'
                            });   
                            // $sec03.css({
                            //     'position' : 'fixed',
                            //     'top' : sec03_value + "%"
                            // });
                            $sec03.css({
                                'position' : 'absolute',
                                'top' : newHeight * 3 + fakeHeight + 100,
                            });
                            $('.main-epilogue').addClass('show');
                        } else {
                            $sec03.css({
                                'position' : 'absolute',
                                'top' : newHeight * 3 + fakeHeight + 100,
                            });
                            $('.main-epilogue').removeClass('show');
                        }        
                    },0);
                }

            });
        },
        sectionAni: function(){
            let $mainVisual = $('.section.main-visual'),
            $section = $('.main .section'),
            $sec01 = $('.section-01'),
            $sec02 = $('.section-02'),
            $sec03 = $('.section-footer'),
            $navi = $('.main-indi li'),
            $secInfo = $('.section-02 .section-02-text'),
            $sec02_title = $('.section-02-title'),
            _top01 = $sec01.offset().top - 400, 
            _top02 = $sec02.offset().top - 400, 
            _top03 = $sec03.offset().top - 400, 
            _sec02Posi01 = $sec02.offset().top + 1500, 
            _sec02Posi02 = $sec02.offset().top + 3000, 
            _sec02Posi03 = $sec02.offset().top + 4500, 
            _count01 = new countUp.CountUp('count01', 5000),
            _count02 = new countUp.CountUp('count02', 5000),
            _count01Flag = false,
            _count02Flag = false;

            $window.on('scroll',function(){
                let scTop = $window.scrollTop();
                if( scTop < _top01 ){ 
                    $('.main-indi').removeClass('color-change');
                    $navi.removeClass('on').eq(0).addClass('on');
                    $section.removeClass('active');

                }else if( scTop < _top02 ){ 
                    $('.main-indi').addClass('color-change');
                    $navi.removeClass('on').eq(1).addClass('on');
                    $secInfo.removeClass('active');
                    $section.removeClass('active').eq(1).addClass('active');
                    $sec02_title.removeClass('on');

                    if($secInfo.eq(1).hasClass('active')){
                        $secInfo.eq(0).removeClass('active').stop().animate({
                            'top':'-80%',
                            'opacity':'0',
                            'z-index':'-1',
                        }, 200);
                    }
                    $mainVisual.css({'opacity':1});

                }else if( scTop < _top03 && $window.width() > 767 ){ 
                    $('.main-indi').removeClass('color-change');
                    $navi.removeClass('on').eq(2).addClass('on');
                    $section.removeClass('active').eq(2).addClass('active');
                    $sec02_title.removeClass('on').eq(0).addClass('on');
                    
                    if( scTop < _sec02Posi01 ){ //3614 미만

                        if($secInfo.eq(1).hasClass('active')){
                            $secInfo.eq(1).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }

                        if(!$secInfo.eq(0).hasClass('active')){
                            $secInfo.removeClass('active').eq(0).addClass('active').css('top', '-30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0',
                            }, 200);
                        }

                        setTimeout(function(){
                            _count01Flag = false;
                            _count01.reset();
                        },200);

                    }else if( scTop < _sec02Posi02 ){
                        if($secInfo.eq(2).hasClass('active') ){
                            $secInfo.eq(2).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }

                        if($secInfo.eq(0).hasClass('active')){
                            $secInfo.eq(0).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1',
                            }, 200);
                        }
                    
                        if(!$secInfo.eq(1).hasClass('active')){
                            $secInfo.removeClass('active').eq(1).addClass('active').css('top', '30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }else{
                            setTimeout(function(){
                                if ( !_count01Flag ) {
                                    _count01.start();
                                    _count01Flag = true;
                                } 

                                _count02Flag = false;
                                _count02.reset();    
                            },400);
                        }

                    }else if( scTop < _sec02Posi03 ){

                        if($secInfo.eq(3).hasClass('active')){
                            $secInfo.eq(3).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }

                        if($secInfo.eq(1).hasClass('active')){
                            $secInfo.eq(1).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }

                        if(!$secInfo.eq(2).hasClass('active')){
                            $secInfo.removeClass('active').eq(2).addClass('active').css('top', '-30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }else{
                            setTimeout(function(){
                                if ( !_count02Flag ) {
                                    _count02.start();
                                    _count02Flag = true;
                                } 

                                _count01Flag = false;
                                _count01.reset();    
                            },400);
                        }
                        

                    }else if( _sec02Posi03 < scTop ){ 
                        $sec02_title.removeClass('on').eq(1).addClass('on');

                        setTimeout(function(){
                            _count02Flag = false;
                            _count02.reset();
                        },200);

                        if($secInfo.eq(2).hasClass('active') ){
                            $secInfo.eq(2).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);    
                        }
                        if($secInfo.eq(0).hasClass('active')){
                            $secInfo.eq(0).removeClass('active').css({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            });
                        }

                        if($secInfo.eq(1).hasClass('active')){
                            $secInfo.eq(1).removeClass('active').css({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            });
                        }


                        if ( !$secInfo.eq(3).hasClass('active') ) {
                            $secInfo.removeClass('active').eq(3).addClass('active').css('top', '80%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }

                    }
                } else if( scTop < _top03 && $window.width() < 767 ){
                    // mobile section02
                    $sec02_title = $('.mo-view .section-02-title'),
                    $secInfo = $('.mo-view .section-02-text');
                    _count01Flag = false,
                    _count02Flag = false;
                    
                    $mainVisual.css({'opacity':0});
                    $sec02_title.removeClass('on').eq(0).addClass('on');
                    $secInfo.each(function(){
                        if($(this).hasClass('slick-current') === true){
                            $(this).addClass('active').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }
                    });
                } else {
                    $('.main-indi').addClass('color-change');
                    $section.removeClass('active').eq(3).addClass('active');
                    $sec02_title.removeClass('on');
                    $secInfo.removeClass('active').css({
                        'top':'-80%',
                        'opacity':'0',
                        'z-index':'-1'
                    });
                }
            });

        }
    };
    mainUi.boardCtr = {
        init: function(){
            const $mainTab = $('.main-tab-list__item'),
                $mainTabConts = $('.main-layout__conts');
                $mainTab.on('click',function(){
                    $(this).addClass('on').siblings().removeClass('on');
                    let tabItem = $(this).attr('data-tab');
                    $mainTabConts.find('.'+tabItem).addClass('on').siblings().removeClass('on');
                });
        }
    };
    mainUi.mobile = {
        init: function(){
            const $winH = $window.height(),
                  $main = $('.section.main-visual');

            $main.css({'height' : $winH + 'px'});
            

            if( $window.width() < 767 ){
                this.moSlick();
                this.moQuick();
                this.bgScroll();
                $('.main .slick-arrow').css({'display':'none'});
                $('.main .section-02 .mo-view').show();
                $('.main .section-02 .pc-view').hide();
            }else{
                $('.main .section-02 .pc-view').show();
                $('.main .section-02 .mo-view').hide();
            }
        },
        moQuick : function(){
            const $quickClick = $('.main-visual .mo-view'),
                    $quickMenu = $('.main .quick-menu');

            setTimeout(function(){
                $('.main .quick-menu').animate({
                    'height' : '10rem'
                }, 700);
            },300);

            $quickClick.on('click', function(){
                $(this).hide();
                $quickMenu.stop().animate({
                    'height': $('.quick-menu').find('li').length * 10 +'rem'
                },500);
            });

            $('html').on('click',function(e){
                if(!$(e.target).is('.quick-menu, .mo-view')){
                    $quickClick.show();
                    $quickMenu.stop().animate({
                        'height': '10rem'
                    },500);
                }
            });
        },
        moSlick : function(){
            let $secInfo = $('.mo-view .section-02-text'),
                $sec02_title = $('.mo-view .section-02-title'),
                _count01 = new countUp.CountUp('count01-mo', 5000),
                _count02 = new countUp.CountUp('count02-mo', 5000),
                _count01Flag = false,
                _count02Flag = false;

            $('.mo-view-slider').not('.slick-initialized').slick({
                dots: true,
                arrows: false,
                pauseOnHover: false,
                infinite: false,
                speed: 1000,
                slidesToShow: 1,
                slidesToScroll: 1,
                autoplay: false,
            });
            $('.mo-view-slider').on({
                afterChange : function(event, slick, currentSlide){
                    $secInfo.each(function(){
                        if($(this).hasClass('slick-current') === true){
                            $(this).stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 100);
                            if( $secInfo.eq(1).hasClass('slick-current')  === true){
                                setTimeout(function(){
                                    if ( !_count01Flag ) {
                                        _count01.start();
                                        _count01Flag = true;
                                    } 
        
                                    _count02Flag = false;
                                    _count02.reset();    
                                },100);
                            }
                            if( $secInfo.eq(2).hasClass('slick-current') === true){
                                setTimeout(function(){
                                    if ( !_count02Flag ) {
                                        _count02.start();
                                        _count02Flag = true;
                                    } 
        
                                    _count01Flag = false;
                                    _count01.reset();    
                                },100);
                            }
                            if( $secInfo.eq(3).hasClass('slick-current') === true ){
                                $sec02_title.removeClass('on').eq(1).addClass('on');
                            }else{
                                $sec02_title.removeClass('on').eq(0).addClass('on');
                            }

                        }else{
                            $(this).stop().animate({
                                'top':'10%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 100);
                        }
                    });
                    
                }
            });
        },
        bgScroll : function(){
            const $mainVideo = $('.section.main-visual .main-slider video');
            $window.on('scroll',function(){
                const scTop = $window.scrollTop();
                $mainVideo.css({
                    'transform': 'translateY(' + scTop/2 + 'px)'
                });
                if( scTop > $('.section-01').offset().top ){
                    $mainVideo.css({
                        'transform': 'translateY(0)'
                    });
                }
            })
        }
    }
    return mainUi;
})(window.mainUi || {}, $(window));