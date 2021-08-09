'use strict';

var App = App || {};
var mobileC = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream;

/** Scroll Off **/
function scrollDisable() {
    $('body').addClass('scrollOff').on('scroll touchmove mousewheel', function(e){
        e.preventDefault();
    });
}

function scrollAble() {
    $('body').removeClass('scrollOff').off('scroll touchmove mousewheel');
}


$(document).ready(function(){
    App.Common.init();
    App.Gnb.init();
    $('.tab-wrap').length && App.Tab.init();
    // App.Popup.init();
});

//---------------------------------------------------------------------------------------
// Common
// : Header, Footer 이벤트들
//---------------------------------------------------------------------------------------
App.Common = (function() {
    var self;
    
    return {
        init : function() {
            self = this;
            self.common();

            self.sectionInit();
            self.sectionScroll();
        },
        common : function() {
            
        },
        sectionInit: function() {
            $('main').css({'height' : $(window).height() * $('section').length})
            $('section').each(function(index, item){
                $(item).css({ 'top' : $(item).index() * $(window).height() });    
            });
        },
        sectionScroll : function() {
            var $mainVi = $('.mainVi'),
                $sec01 = $('.sec01'),
                $sec02 = $('.sec02'),
                $sec03 = $('.sec03'),
                $sec04 = $('.sec04'),
                _sec01Top = $('.sec01').offset().top,
                _sec02Top = $('.sec02').offset().top,
                _sec03Top = $('.sec03').offset().top,
                _sec04Top = $('.sec04').offset().top;

            $(window).on('scroll', function(){
                var a = $(window).scrollTop(),
                    c = 0,
                    d = -50,
                    _value = a * ( d - c ) / _sec01Top + c;
                    
                    _value > -50 && $mainVi.css('top', _value + "%");
                    a > _sec01Top ? $sec01.css({'position' : 'fixed', 'top' : '0'}) : $sec01.css({'position' : 'absolute', 'top' : _sec01Top});
                    a > _sec02Top ? $sec02.css({'position' : 'fixed', 'top' : '0'}) : $sec02.css({'position' : 'absolute', 'top' : _sec02Top});
                    a > _sec03Top ? $sec03.css({'position' : 'fixed', 'top' : '0'}) : $sec03.css({'position' : 'absolute', 'top' : _sec03Top});
                    a > _sec04Top ? $sec04.css({'position' : 'fixed', 'top' : '0'}) : $sec04.css({'position' : 'absolute', 'top' : _sec04Top});
        
            });
        },
    }
})();

//---------------------------------------------------------------------------------------
// GNB
//---------------------------------------------------------------------------------------
App.Gnb = (function () {
    var self;
    return {
        init: function () {
            self = this;
            self.mobile();
            self.pc();
            
        },
        pc : function () {
           
        },
        mobile: function () {
            
            
        }
    }
})();

//---------------------------------------------------------------------------------------
// Carousel (swiper)
//---------------------------------------------------------------------------------------
App.Carousel = (function(){
    var self, name, type;
    
    return { 
        init : function(carousel_name, option, type) {
            self = this;
            name = carousel_name;
            
            new Swiper(name, option);
        }
    }
})();
