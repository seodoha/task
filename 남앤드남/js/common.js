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
        },
        common : function() {
            $('.btnTop').on('click', function() {
                $('html,body').stop().animate({'scrollTop' : '0'});
                $('footer').css({
                    'opacity':'0',
                    'z-index':'-1'
                });
            });
        },
        
    }
})();

//---------------------------------------------------------------------------------------
// Carousel (swiper)
//---------------------------------------------------------------------------------------
App.Slide = (function(){
    var self;
    
    return { 
        init : function(slider, option) {
            self = this;
            if ( !$(slider).hasClass('swiper-container-initialized') ) {
                new Swiper(slider, option);
            }
        }
    }
})();