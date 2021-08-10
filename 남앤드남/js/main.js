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
                $sec05 = $('.sec05'),
                _sec01Top = $sec01.offset().top,
                _sec02Top = $sec02.offset().top,
                _sec03Top = $sec03.offset().top,
                _sec04Top = $sec04.offset().top,
                _sec05Top = $sec05.offset().top;

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
                    $sec01.css({'position' : 'fixed', 'top' : _sec02Value + "%"});
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

                if ( a > _sec04Top && a < _sec05Top ) {
                    a = a - $(window).height() * 4;
                    var _sec05Value = a * ( d - c ) / _sec01Top + c;
                    $sec04.css({'position' : 'fixed', 'top' : _sec05Value + "%"});
                } else {
                    $sec04.css({'position' : 'absolute', 'top' : _sec04Top});
                }
            });
        },
        scrollAni: function() {
            var $sec01 = $('.sec01'),
                $sec02 = $('.sec02'),
                $sec03 = $('.sec03'),
                $sec04 = $('.sec04'),
                $sec05 = $('.sec05'),
                _sec01Top = $sec01.offset().top - 500,
                _sec02Top = $sec02.offset().top - 500,
                _sec03Top = $sec03.offset().top - 500,
                _sec04Top = $sec04.offset().top - 500,
                _sec05Top = $sec05.offset().top - 500;

            $(window).on('scroll', function() {
                var scTop = $(window).scrollTop();

                scTop > _sec01Top && $sec01.addClass('ani');
                scTop > _sec02Top && $sec02.addClass('ani');
                scTop > _sec03Top && $sec03.addClass('ani');
                scTop > _sec04Top && $sec04.addClass('ani');
                scTop > _sec05Top && $sec05.addClass('ani');
            });
        },
    }
})();