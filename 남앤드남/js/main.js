/**	Main 퍼블 사용 js **/

'use strict';

$(document).ready(function(){
    App.Main.init();

    
});

//---------------------------------------------------------------------------------------
// Main
//---------------------------------------------------------------------------------------
App.Main = (function () {
    var self;

    return {
        init: function () {
            self = this;
            self.sectionInit();
            self.sectionScroll();
            self.scrollAni();
            
            new Swiper('.mainViSlide', {
                slidesPerView: 1,
                effect: "fade",
                loop: true,
                autoplay: {
                    delay: 5000,
                },
            });
        },
        sectionInit: function() {
            $('section').each(function(index, item){
                var height = $(item).index() * $(window).height();
                if ( index == 3 ) {
                    height = height + 600;
                }
                $(item).css({ 'top' :  height});
            });
        },
        sectionScroll: function() {
            var $header = $('header'),
                $mainVi = $('.mainVi'),
                $sec01 = $('.sec01'),
                $sec02 = $('.sec02'),
                $sec03 = $('.sec03'),
                _sec01Top = $sec01.offset().top,
                _sec02Top = $sec02.offset().top,
                _sec03Top = $sec03.offset().top;

            $(window).on('scroll', function() {
                var a = $(window).scrollTop(),
                    c = 0,
                    d = -50,
                    _sec01Value = a * ( d - c ) / _sec01Top + c;
                    
                // console.log(a);

                _sec01Value > -50 && $mainVi.css('top', _sec01Value + "%");
                if ( a > _sec01Top && a < _sec02Top) {
                    a = a - $(window).height();
                    var _sec02Value = a * ( d - c ) / _sec01Top + c;
                    $header.addClass('index01');
                    $sec01.css({'position' : 'fixed', 'top' : _sec02Value + "%"});
                } else {
                    $header.removeClass('index01');
                    $sec01.css({'position' : 'absolute', 'top' : _sec01Top});
                }

                if ( a > _sec02Top && a < _sec03Top ) {
                    $sec02.css({'position' : 'fixed', 'top' : 0});
                    a = a - $(window).height() * 2 - 600;
                    var _sec03Value = a * ( d - c ) / _sec01Top + c;
                    
                    if ( $(window).scrollTop() > _sec02Top + 600 ) {
                        $sec02.css({'top' : _sec03Value + "%"});
                    }

                } else {
                    $sec02.css({'position' : 'absolute', 'top' : _sec02Top});
                }

                if ( a > _sec03Top ) {
                    a = a - $(window).height() * 3;
                    var _sec04Value = a * ( d - c ) / _sec01Top + c;
                    $sec03.css({'position' : 'fixed', 'top' : _sec04Value + "%"});
                } else {
                    $sec03.css({'position' : 'absolute', 'top' : _sec03Top});
                }                
            });
        },
        scrollAni: function() {
            var $sec01 = $('.sec01'),
                $sec02 = $('.sec02'),
                $secInfo = $('.sec02 .sec02Info'),
                _sec01Top = $sec01.offset().top - 400,
                _sec02Top = $sec02.offset().top - 400,
                _sec02Posi01 = $sec02.offset().top + 100,
                _sec02Posi02 = $sec02.offset().top + 300,
                _sec02Posi03 = $sec02.offset().top + 500;
            
            $(window).on('scroll', function(e) {
                var scTop = $(window).scrollTop();

                scTop > _sec01Top && $sec01.addClass('ani');
                if ( scTop > _sec02Top ) {
                    $sec02.addClass('ani');
                    
                    if ( scTop < _sec02Posi01 ) {
                        if ( !$secInfo.eq(0).hasClass('active') ) {
                            $secInfo.eq(0).addClass('active').css('top', '-30%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                        }
                        if ( $secInfo.eq(1).hasClass('active') ) {
                            $secInfo.eq(1).removeClass('active').stop().animate({
                                'top':'80%', 
                                'opacity': '0',
                                'z-index': '-1'
                            }, 200);
                        }
                    }
                        
                    if ( scTop > _sec02Posi01 && scTop < _sec02Posi02 ) {
                        if ( $secInfo.eq(0).hasClass('active') ) {
                            $secInfo.eq(0).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }
                        if ( !$secInfo.eq(1).hasClass('active') ) {
                            $secInfo.eq(1).addClass('active').css('top', '80%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                            $('.odometer').text(0);
                            setTimeout(function(){
                                $secInfo.eq(1).find('.odometer').text(120);
                            }, 1000);
                        }
                        if ( $secInfo.eq(2).hasClass('active') ) {
                            $secInfo.eq(2).removeClass('active').stop().animate({
                                'top':'80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }
                    }

                    if ( scTop > _sec02Posi02 && scTop < _sec02Posi03 ) {
                        if ( $secInfo.eq(1).hasClass('active') ) {
                            $secInfo.eq(1).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }
                        if ( !$secInfo.eq(2).hasClass('active') ) {
                            $secInfo.eq(2).addClass('active').css('top', '80%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                            $('.odometer02').text(0);
                            setTimeout(function(){
                                $secInfo.eq(2).find('.odometer02').text(2000);
                            }, 1000);
                        }
                        if ( $secInfo.eq(3).hasClass('active') ) {
                            $secInfo.eq(3).removeClass('active').stop().animate({
                                'top':'80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }
                    }

                    if ( scTop > _sec02Posi03 ) {
                        if ( $secInfo.eq(2).hasClass('active') ) {
                            $secInfo.eq(2).removeClass('active').stop().animate({
                                'top':'-80%',
                                'opacity':'0',
                                'z-index':'-1'
                            }, 200);
                        }
                        if ( !$secInfo.eq(3).hasClass('active') ) {
                            $secInfo.eq(3).addClass('active').css('top', '80%').stop().animate({
                                'top':'0', 
                                'opacity': '1',
                                'z-index': '0'
                            }, 200);
                            $('.odometer03').text(0);
                            setTimeout(function(){
                                $secInfo.eq(3).find('.odometer03').text(40);
                            }, 1000);
                        }
                    }
    
                }


            });
        },
    }
})();