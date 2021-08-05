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
            self.slide();
            self.timedeal();
            self.mobile();
        },
        slide : function() {
            var mainSwiper, 
                main_opt, 
                timeDeal_opt, 
                handle_opt, 
                hadware_opt, 
                tools_opt, 
                living_opt, 
                brand_opt, 
                remote = $('.mainVi .swiper-remote');

            /** 메인 비주얼 **/
            main_opt = {
                slidesPerView: 2,
                spaceBetween: 32,
                loop: true,
                navigation: {
                    nextEl: ".mainVi .swiper-button-next",
                    prevEl: ".mainVi .swiper-button-prev",
                },
                autoplay: {
                    delay: 3500,
                    pauseOnMouseEnter: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 0,
                    },
                },
                on: {
                    slideChangeTransitionEnd: function() {
                        var index = this.realIndex + 1,
                            count = $('.utilBox .count em');
                        count.html(index);
                    },
                },
            };
            mainSwiper = new Swiper('.mainViSlide', main_opt);
            /** remote event  **/
            remote.on('click', function() {
                if ( $(this).hasClass('play') ) {
                    mainSwiper.autoplay.start();
                    $(this).html('stop');    
                    $(this).removeClass('play');
                } else {
                    mainSwiper.autoplay.stop();
                    $(this).html('play');    
                    $(this).addClass('play');
                }
            });

            /** 타임딜 **/
            timeDeal_opt = {
                slidesPerView: 4,
                spaceBetween: 32,
                navigation: {
                    nextEl: ".arti03 .swiper-button-next",
                    prevEl: ".arti03 .swiper-button-prev",
                },
            };
            App.Slide.init('.arti03 .swiper-container',timeDeal_opt);

            /** 손잡이 **/
            handle_opt = {
                slidesPerView: 5,
                spaceBetween: 32,
                navigation: {
                    nextEl: ".handleSlide .swiper-button-next",
                    prevEl: ".handleSlide .swiper-button-prev",
                },
                breakpoints: {
                    768: {
                        slidesPerView: "auto",
                        spaceBetween: 8,
                    },
                },
            };
            App.Slide.init('.handleSlide .swiper-container',handle_opt);

            /** 철물 · 하드웨어 **/
            hadware_opt = {
                slidesPerView: 5,
                spaceBetween: 32,
                navigation: {
                    nextEl: ".hadwareSlide .swiper-button-next",
                    prevEl: ".hadwareSlide .swiper-button-prev",
                },
                breakpoints: {
                    768: {
                        slidesPerView: "auto",
                        spaceBetween: 8,
                    },
                },
            };
            App.Slide.init('.hadwareSlide .swiper-container',hadware_opt);

            /** 공구 · 전동공구 **/
            tools_opt = {
                slidesPerView: 5,
                spaceBetween: 32,
                navigation: {
                    nextEl: ".toolsSlide .swiper-button-next",
                    prevEl: ".toolsSlide .swiper-button-prev",
                },
                breakpoints: {
                    768: {
                        slidesPerView: "auto",
                        spaceBetween: 8,
                    },
                },
            };
            App.Slide.init('.toolsSlide .swiper-container',tools_opt);

            /** 인테리어 · 리빙 **/
            living_opt = {
                slidesPerView: 1,
                spaceBetween: 10,
                navigation: {
                    nextEl: ".livingSlide .swiper-button-next",
                    prevEl: ".livingSlide .swiper-button-prev",
                },
                pagination: {
                    el: ".livingSlide .swiper-pagination",
                    clickable: true,
                },
            };
            App.Slide.init('.livingSlide .swiper-container',living_opt);
            

            /** 추천 브랜드 **/
            brand_opt = {
                slidesPerView: 1,
                loop: true,
                navigation: {
                    nextEl: ".arti10 .swiper-button-next",
                    prevEl: ".arti10 .swiper-button-prev",
                },
                pagination: {
                    el: ".arti10 .swiper-pagination",
                    clickable: true,
                },
            };
            App.Slide.init('.brandSlide',brand_opt);
        },
        timedeal: function() {
            var hoursCurVal, 
                minuteCurVal,
                secondCurVal,
                remainDate, remainHours, remainMinute, remainSecond,
                goalDate = new Date("Aug 5, 2021, 09:00:00"),
                $hours = $('.hours span'),
                $minute = $('.minute span'),
                $second = $('.second span');
            
            var timeCount = setInterval(function(){
                hoursCurVal = $hours.eq(0).text(),
                minuteCurVal = $minute.eq(0).text(),
                secondCurVal = $second.eq(0).text(),
                remainDate = goalDate.getTime() - new Date().getTime();
                if ( remainDate < 0 ) {
                    clearInterval(timeCount);
                    return false;
                }
                remainHours = Math.floor(remainDate / (1000 * 60 * 60));
                remainMinute = Math.floor((remainDate % (1000 * 60 * 60)) / (1000 * 60));
                remainSecond = Math.floor((remainDate % (1000 * 60)) / 1000);

                if ( remainHours < 10 ) remainHours = '0' + remainHours;
                if ( remainMinute < 10 ) remainMinute = '0' + remainMinute;
                if ( remainSecond < 10 ) remainSecond = '0' + remainSecond;

                if ( remainHours != hoursCurVal ) {
                    animateCount($hours, remainHours);
                } else {
                    $hours.closest('em').removeClass('ani');
                }
                if ( remainMinute != minuteCurVal ) {
                    animateCount($minute, remainMinute);
                } else {
                    $minute.closest('em').removeClass('ani');
                }
                if ( remainSecond != secondCurVal ) {
                    animateCount($second, remainSecond);
                }

                $('.hours .old').text(hoursCurVal);
                $('.minute .old').text(minuteCurVal);
                $('.second .old').text(secondCurVal);
                // console.log($hours.text());
                // console.log(remainDate);
                // console.log(remainHours);
                // console.log(remainMinute);
                // console.log(remainSecond.length);
            }, 1000);

            function animateCount (selector, value) {
                var cur = selector.eq(0),
                    old = selector.eq(1);
                selector.closest('em').addClass('ani');
                cur.text(value);
            }

        },
        mobile : function() {
            var $hashTag = $('.arti01 ul'),
                $favorList = $('.arti02 .mo-el'),
                $brandList = $('.arti10 .mo-el'),
                favorOpt = {
                    slidesPerView: 1,
                    pagination: {
                        el: ".arti02 .swiper-pagination",
                        clickable: true,
                    },
                };
            /** mobile check **/
            if ( $(window).width() <= 768 ) {
                App.TextSlide.init($hashTag);

                /** 즐겨찾는 카테고리 **/
                App.Slide.init($favorList,favorOpt);

                /** 추천 브랜드 **/
                App.TextSlide.init($brandList);
            } else {
                App.TextSlide.destory($hashTag);
                App.TextSlide.destory($brandList);
            }
            $(window).on('load resize', function(){
                if ( $(window).width() <= 768 ) {
                    App.TextSlide.init($hashTag);

                    /** 즐겨찾는 카테고리 **/
                    App.Slide.init($favorList,favorOpt);

                    /** 추천 브랜드 **/
                App.TextSlide.init($brandList);
                } else {
                    App.TextSlide.destory($hashTag);
                    App.TextSlide.destory($brandList);
                }
            });
        },
    }
})();