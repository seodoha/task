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
            self.slide();
            self.scrollAni();
        },
        sectionInit: function() {
            $('section').each(function(index, item){
                $(item).css({ 'top' : $(item).index() * $(window).height() });    
            });
        },
        sectionScroll: function() {
            var $header = $('header'),
                $mainVi = $('.mainVi'),
                $sec01 = $('.sec01'),
                $sec02 = $('.sec02'),
                $sec03 = $('.sec03'),
                $sec04 = $('.sec04'),
                _sec01Top = $('.sec01').offset().top,
                _sec02Top = $('.sec02').offset().top,
                _sec03Top = $('.sec03').offset().top,
                _sec04Top = $('.sec04').offset().top;

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
                    $sec01.addClass('ani').css({'position' : 'fixed', 'top' : _sec02Value + "%"});
                    $header.addClass('index01');
                } else {
                    $sec01.css({'position' : 'absolute', 'top' : _sec01Top});
                    $header.removeClass('index01');
                }

                if ( a > _sec02Top && a < _sec03Top ) {
                    a = a - $(window).height() * 2;
                    var _sec03Value = a * ( d - c ) / _sec01Top + c;
                    $sec02.css({'position' : 'fixed', 'top' : _sec03Value + "%"});
                } else {
                    $sec02.css({'position' : 'absolute', 'top' : _sec02Top});
                }

                if ( a > _sec03Top && a < _sec04Top ) {
                    a = a - $(window).height() * 3;
                    var _sec04Value = a * ( d - c ) / _sec01Top + c;
                    $sec03.css({'position' : 'fixed', 'top' : _sec04Value + "%"});
                } else {
                    $sec03.css({'position' : 'absolute', 'top' : _sec03Top});
                }
            });
        },
        slide: function() {
            var mainSwiper, 
                main_opt;

            /** 메인 비주얼 **/
            main_opt = {
                slidesPerView: 1,
                effect: "fade",
                loop: true,
                autoplay: {
                    delay: 5000,
                },
            };
            mainSwiper = new Swiper('.mainViSlide', main_opt);
            
        },
        scrollAni: function() {

        },
    }
})();