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
    App.Popup.init();
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
            $('.mainWrap').length && self.fullpage();
        },
        common : function() {
            /** 상위 이동 버튼 event **/
            $('.btnTop').on('click', function() {
                $('html, body').animate({scrollTop : 0}, 400);
            });
            
            /** 하단 협력기관 소개 event **/
            $('.selTxt').on('click', function(){
                var selBox = $(this).closest('.selBox');
                selBox.toggleClass('on');
            });
            
        },
        fullpage : function() {
            var wheel, 
                $article = $('article'),
                index = 0, 
                lastIndex = $article.length - 1,
                $aside = $('aside'),
                isScrolling = true;
            
            /** indicator **/
            for ( var i = 0;i < lastIndex + 1;i++ ) {
                $aside.find('ul').append('<li><a href="javascript:;">메뉴</a></li>');
            }
            $aside.find('li').eq(0).addClass('on');

            /** event **/
            $(window).on('mousewheel',function(e){
                wheel = e.originalEvent.wheelDelta;
                if ( isScrolling ) {
                    if( wheel > 0 ){
                        if ( index > 0 ) wheelEvent('up', index, --index);
                    } else {
                        if ( index < lastIndex ) wheelEvent('down', index, ++index);
                    }
                }
            });

            $aside.find('a').on('click', function(){
                var asideIndex = $(this).parent().index();
                if ( isScrolling ) {
                    index > asideIndex ? wheelEvent('up', index, asideIndex) : wheelEvent('down', index, asideIndex);
                    index = asideIndex;
                }
            });
            
            function wheelEvent (direction, oldIndex, activeIndex) {
                if ( direction == 'up' ) {
                    $article.eq(oldIndex).stop().animate({'top':'100%'}, 'fast');
                    $article.eq(activeIndex).css('top', '-100%').stop().animate({'top':'0'}, 'fast');
                } else {
                    $article.eq(oldIndex).stop().animate({'top':'-100%'}, 'fast');
                    $article.eq(activeIndex).css('top', '100%').stop().animate({'top':'0'}, 'fast');
                }
                $aside.find('li').removeClass('on').eq(activeIndex).addClass('on');
                isScrolling = false;
                setTimeout(function(){
                    isScrolling = true;
                }, 500);
            }
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
            /** gnb hover event **/
            var $gnb = $('.gnbList > li');

            $gnb.on('mouseover focusin', function(){
                $('header').addClass('is-hover');
                $(this).addClass('on');
                $(this).find('.gnb_2dep').stop().slideDown('fast');
            }).on('mouseout focusout', function(){
                $('header').removeClass('is-hover');
                $(this).removeClass('on');
                $(this).find('.gnb_2dep').stop().slideUp('fast');
            });
        },
        mobile: function () {
            var $mo_menu = $('.mo-menu'),
                $mo_gnb = $('.mo-gnb'),
                $close = $('.btnClose'),
                $mo_dep1 = $('.mo-depth1 > li'),
                $mo_dep1Txt = $mo_dep1.find('> a'),
                $mo_dep2 = $('.mo-depth2'),
                scrollTop,
                $contentsPosi = $('#contents').offset().top,
                $header = $('header');

            $mo_menu.on('click', function() {
                $mo_gnb.fadeIn('fast');
                scrollDisable();
            });

            $close.on('click', function() {
                $mo_gnb.fadeOut('fast');
                scrollAble();
            });

            $mo_dep1Txt.on('click', function() {
                var parent = $(this).parent();
                $mo_dep2.stop().slideUp('fast');

                if ( parent.hasClass('on') ) {
                    parent.removeClass('on');
                } else {
                    $mo_dep1.removeClass('on');
                    parent.addClass('on');
                    $(this).siblings('.mo-depth2').stop().slideDown('fast');
                }
            });
            
            $(window).width() > 768 ? $header.removeClass('fixed') : fixHeader();

            $(window).on('load resize', function(){
                if ( $(window).width() > 768 ) {
                    $mo_gnb.fadeOut('fast');
                    scrollAble();
                    $(window).off('mousewheel');
                    $header.removeClass('fixed');
                } else {
                    fixHeader();
                }
            });

            function fixHeader() {
                $(window).on('mousewheel', function(e){
                    scrollTop = $(this).scrollTop();
                    scrollTop >= $contentsPosi ? $header.addClass('fixed') : $header.removeClass('fixed');
                });
            }
            
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
            self.tab_access();

			$('.tab-ty > li > a').on('click', function(e){
                e.preventDefault();
                $activeTab = $(this);
				$tabIndex = $activeTab.closest('li').index();
                $activeParents = $activeTab.closest('.tab-wrap');
                
                $activeTab.closest('.tab-ty').find('li').removeClass('active');
				$activeTab.closest('li').addClass('active');
                $activeParents.find('.cnt-tab > li').removeClass('active');
                $activeParents.find('.cnt-tab > li:eq(' + $tabIndex + ')').addClass('active');
			});
            
            $('.tab-ty > li').eq(0).find('> a').trigger('click');
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
