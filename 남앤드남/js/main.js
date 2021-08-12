'use strict';

$(document).ready(function(){
    App.Main.init();
});

$(window).on('beforeunload', function () {
    $(window).scrollTop(0);
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

            $('.btnMenu').on('click', function(){
                $('#gnb').stop().fadeIn('fast');
            });
            $('#gnb').on('click', function(){
                $(this).stop().fadeOut('fast');
            });
        },
        sectionInit: function() {
            var sumHeight = 0,
                footerHeight = $('footer').height();

            setTimeout(function(){
                $('.typeList').animate({
                    scrollTop : 800
                }, 1400);
            }, 200);

            $('.progressBar span').css({'height':'25%'});

            $('section').each(function(index, item){
                var height = $(item).index() * $(window).height();
                if ( index == 3 ) {
                    height = height + 2000;
                }
                sumHeight = sumHeight + height;
                $(item).css({ 'top' :  height});
            });
            $('#wrap').css({'height' : sumHeight + footerHeight + 'px'});
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

                if ( a > _sec01Top ) {
                    $('.scrollProgress > span').css({'opacity':'0'});
                } else {
                    $('.scrollProgress > span').css({'opacity':'1'});
                }

                _sec01Value > -50 && $mainVi.css('top', _sec01Value + "%");
                if ( a > _sec01Top && a < _sec02Top) {
                    $('.progressBar span').css({'height':'50%'});
                    a = a - $(window).height();
                    var _sec02Value = a * ( d - c ) / _sec01Top + c;
                    $header.addClass('index01');
                    $mainVi.css({'opacity':'0'});
                    $sec01.css({
                        'position' : 'fixed',
                        'top' : _sec02Value + "%",
                    });
                } else {
                    $('.progressBar span').css({'height':'25%'});
                    $header.removeClass('index01');
                    $mainVi.css({'opacity':'1'});
                    $sec01.css({
                        'position' : 'absolute',
                        'top' : _sec01Top,
                    });
                }

                if ( a > _sec02Top && a < _sec03Top ) {
                    $('.progressBar span').css({'height':'75%'});
                    $sec02.css({
                        'position' : 'fixed',
                        'top' : 0
                    });
                    a = a - $(window).height() * 2 - 2000;
                    var _sec03Value = a * ( d - c ) / _sec01Top + c;
                    $mainVi.css({'opacity':'0'});
                    if ( $(window).scrollTop() > _sec02Top + 2000 ) {
                        $sec02.css({
                            'top' : _sec03Value + "%"
                        });
                    }
                } else {
                    $sec02.css({
                        'position' : 'absolute',
                        'top' : _sec02Top,
                    });
                }

                if ( a > _sec03Top ) {
                    $('.progressBar span').css({'height':'100%'});
                    a = a - $(window).height() * 3 - 2000;
                    var _sec04Value = a * ( d - c ) / _sec01Top + c;
                    $sec03.css({
                        'position' : 'fixed',
                        'top' : _sec04Value + "%"
                    });
                    $mainVi.css({'opacity':'0'});
                } else {
                    $sec03.css({
                        'position' : 'absolute',
                        'top' : _sec03Top,
                    });
                }                
            });
        },
        scrollAni: function() {
            var $sec01 = $('.sec01'),
                $sec02 = $('.sec02'),
                $sec03 = $('.sec03'),
                $footer = $('footer'),
                $secInfo = $('.sec02 .sec02Info'),
                _sec01Top = $sec01.offset().top - 400,
                _sec02Top = $sec02.offset().top - 400,
                _sec03Top = $sec03.offset().top - 400,
                _sec02Posi01 = $sec02.offset().top + 200,
                _sec02Posi02 = $sec02.offset().top + 1000,
                _sec02Posi03 = $sec02.offset().top + 1800,
                _sec03Posi = $sec03.offset().top + 1500,
                _sec03Posi02 = $sec03.offset().top + 2200,
                _count01 = new countUp.CountUp('count01', 120),
                _count02 = new countUp.CountUp('count02', 2000),
                _count03 = new countUp.CountUp('count03', 40),
                _count01Flag = false,
                _count02Flag = false,
                _count03Flag = false;
                
            
            $(window).on('scroll', function(e) {
                var scTop = $(window).scrollTop();

                scTop > _sec01Top ? $sec01.addClass('ani') : $sec01.removeClass('ani');
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
                            if ( !_count01Flag ) {
                                _count01.start();
                                _count01Flag = true;
                            } else {
                                _count01.reset();
                                _count01.update(120);
                            }
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
                            if ( !_count02Flag ) {
                                _count02.start();
                                _count02Flag = true;
                            } else {
                                _count02.reset();
                                _count02.update(2000);
                            }
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
                            if ( !_count03Flag ) {
                                setTimeout(function() {
                                    _count03.start();
                                    _count03Flag = true;
                                }, 700);
                            } else {
                                setTimeout(function() {
                                    _count03.reset();
                                    _count03.update(40);
                                }, 700);
                            }
                        }
                    }

                    if ( scTop > _sec03Top ) {
                        $sec03.addClass('ani');
                        if ( scTop > $sec03.offset().top ) {
                            $footer.css({
                                'opacity':'1',
                                'z-index':'0'
                            });
                        } else {
                            $footer.css({
                                'opacity':'0',
                                'z-index':'-1'
                            });
                        }
                    } else {
                        $sec03.removeClass('ani');
                    }

                    scTop > _sec03Posi02 ? $footer.addClass('ani') : $footer.removeClass('ani');
                    
                } else {
                    $sec02.removeClass('ani');
                    $secInfo.eq(0).removeClass('active').stop().animate({
                        'top':'-80%',
                        'opacity':'0',
                        'z-index':'-1'
                    }, 200);
                }
            });
        },
    }
})();