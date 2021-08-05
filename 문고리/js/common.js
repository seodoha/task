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
    $('.tabWrap').length && App.Tab.init();
    App.Popup.init();
});

//---------------------------------------------------------------------------------------
// Common
// : Header, Footer 이벤트들
//---------------------------------------------------------------------------------------
App.Common = (function() {
    var self, scrollTop, $body = $('body');
    
    return {
        init : function() {
            self = this;
            self.common();
        },
        common : function() {
            /** scroll floation event **/
            $(window).on('scroll', function(){
                scrollTop = $(this).scrollTop();
                scrollTop > 300 ? $('.floatingBtn').addClass('on') : $('.floatingBtn').removeClass('on');
            });

            /** 상위 이동 버튼 event **/
            $('.btnTop').on('click', function() {
                $('html, body').animate({scrollTop : 0}, 0);
            });
        },
    }
})();

//---------------------------------------------------------------------------------------
// GNB
//---------------------------------------------------------------------------------------
App.Gnb = (function () {
    var self, gnb, depth1, dep1Txt, depth2;
    return {
        init: function () {
            self = this;
            self.pc();
            self.mobile();
        },
        pc : function () {
            dep1Txt = $('.isDepth2 > a'), depth1 = $('.isDepth2'), depth2 = $('.depth2');

            // 하위 메뉴 뎁스 click event
            dep1Txt.on('click', function(){
                var flag = $(this).parent().hasClass('active');
                depth1.removeClass('active');
                depth2.stop().slideUp('fast');

                if ( flag ) {
                    $(this).siblings('.depth2').stop().slideUp('fast');
                } else {
                    $(this).parent().addClass('active');
                    $(this).siblings('.depth2').stop().slideDown('fast');
                }
            });

        },
        mobile: function () {
            var $depth1 = $('#gnb .depth1');
            /** mobile check **/
            if ( $(window).width() <= 768 ) {
                App.TextSlide.init($depth1);
            } else {
                App.TextSlide.destory($depth1);
            }
            $(window).on('load resize', function(){
                if ( $(window).width() <= 768 ) {
                    App.TextSlide.init($depth1);
                } else {
                    App.TextSlide.destory($depth1);
                }
            });

        }
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

//---------------------------------------------------------------------------------------
// Carousel (slick)
//---------------------------------------------------------------------------------------
App.TextSlide = (function(){
    var self;
    
    return { 
        init : function(slider) {
            self = this;
            slider.not('.slick-initialized').slick({variableWidth: true, infinite: false,});
        },
        destory : function(slider) {
            slider.filter('.slick-initialized').slick('unslick');
        },
    }
})();
//---------------------------------------------------------------------------------------
// Popup (레이어, iframe)
//---------------------------------------------------------------------------------------
App.Popup = (function(){
    var self, popName, hideYn;
    
    return {
        init : function() {
            self = this;
            self.pop_close();
            
            // 도움말 레이어 팝업
            if($('.btn-help').length > 0) {
                $('.btn-help').on('click', function(e){
                    e.preventDefault();
                    
                    $(this).siblings('.help-pop').stop().fadeIn('fast');
                });
            }
            
            // Layer Popup Open Event
            $('.btn-pop').on('click', function(e){
                e.preventDefault();
                var popName = $(this).attr('data-pop-name');
                $('.lay-pop[data-pop-name="' + popName + '"]').show();
            });
            
            
        },
        pop_close : function() {
            $('.help-pop-close').on('click', function(e) {
                e.preventDefault();
                $(this).closest('.help-pop').fadeOut('fast');
            });
            
            $('.btn-pop-close').on('click', function(e) {
                e.preventDefault();
                $(this).closest('.lay-pop').fadeOut('fast');
            });
            
        }
    }
})();

//---------------------------------------------------------------------------------------
// Tab
//---------------------------------------------------------------------------------------
App.Tab = (function(){
    var self, $activeTab, $activeParents, $tabIndex;
    
	return {
		init: function(){
            self = this;
            // self.tab_access();
            
			$('.tabList > li > a').on('click', function(e){
                $activeTab = $(this);
				$tabIndex = $activeTab.closest('li').index();
                $activeParents = $activeTab.closest('.tabWrap');
                
                $activeTab.closest('.tabWrap').find('li').removeClass('active');
				$activeTab.closest('li').addClass('active');
                $activeParents.find('.tabContents > li').removeClass('active');
                $activeParents.find('.tabContents > li:eq(' + $tabIndex + ')').addClass('active');
			});
            
		},
        tab_access: function() {
            $(document).on('keydown', function (event) {
                
				if (event.type == 'keydown') {
					if(event.keyCode == '9'){
						$('.tab-ty > li.active > a').focusin(function(){
                            $activeTab = $(this);
                            $activeParents = $activeTab.closest('.tab-wrap');
                            $activeParents.addClass('tab-ready');
						});
					}

					if (!event.shiftKey && event.keyCode == '9') {
						if($activeParents) {
							if ($activeParents.hasClass('tab-ready')){
								if($('.tab-ty > li.active > a').is(':focus') == true){
									setTimeout(function(){
										$activeParents.find('.cnt-tab').find('a').removeAttr('tabindex');
										$activeParents.find('.cnt-tab > li.active a:eq(0)').focus();
										$activeParents.removeClass('tab-ready');
									});
								} else if($('.tab-ty > li:not(.active) > a').is(':focus') == true){
									$activeParents.find('.cnt-tab').find('a').attr('tabindex', '-1');
								}

								$activeParents.find('.cnt-tab > li').find('a:last').focus(function(){
									setTimeout(function(){
										$activeParents.addClass('tab-end');
									});
								});

							} else if ($activeParents.hasClass('tab-end')){
								$activeParents.removeClass('tab-end');
								$activeParents.find('.cnt-tab > li').find('a:last').focusout(function(){
									setTimeout(function(){
										$activeParents.find('.tab-ty > li.active').next('li').find('a').focus();
										$activeParents.addClass('tab-ready');
									});
								});

								if($('.tab-ty > li:not(.active) > a').is(':focus') == true){
									setTimeout(function(){
										$activeParents.find('.cnt-tab').find('a').attr('tabindex', '-1');
										$activeParents.removeClass('tab-ready');
									});
								} else if($('.tab-ty > li:not(.active) > a').is(':focus') == false){
									setTimeout(function(){
										$activeParents.find('.cnt-tab').find('a').removeAttr('tabindex');
									});
								}
							}
						}
					} 
				}
			});

			$(document).on('keydown', '.tab-ty > li > a', function(event) {
				if (event.keyCode == '13') {
					$activeTab = $(this);
					$activeParents.addClass('tab-ready');
					$activeParents.find('.cnt-tab').find('a').removeAttr('tabindex');
				}
			});
        }
	}
})();
