;const uiCommon = (function (uiCommon, $window) {
    uiCommon.init = () => {
        $window.on('beforeunload', function () {
            $window.scrollTop(0);
        });

        uiCommon.gnb.init(); // GNB
        uiCommon.eventBind.init(); // 이벤트 바인딩

        // plugin
        // AOS.init({easing: 'ease-in-out-sine',duration: 1000,startEvent: 'load', once: false}); // AOS

        // component
        if ( $('[target-layer-open]').length > 0 || $('[target-layer-bottom-open]').length > 0 ) {
            uiCommon.layer.init(); // layer popup
        }
    };

    // Toast Popup
    uiCommon.toast = {
        init(text) {
            let $el;

            if ( $('.toast-popup').length == 0 ) {
                $el = $('<strong class="toast-popup">' + text + '</strong>');
            }
            $('body').append($el);
            $($el).fadeIn();
            
            setTimeout(() => $($el).fadeOut(), 1000);
            setTimeout(() => $($el).remove(), 1500);
        },
    };

    // Share
    uiCommon.share = {
        sns(snsUrl) {
            let thisUrl = document.URL;
            // console.log(thisUrl);

            let snsTitle = "공유하기", 
                url;

            if (snsUrl == 'facebook') {
                url = "http://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(thisUrl);
                window.open(url, "", "width=486, height=286");
            } else if (snsUrl == 'band') {
                url = "http://www.band.us/plugin/share?body=" + encodeURIComponent(snsTitle)
                    + encodeURIComponent("\n")+ thisUrl + "&route=" + encodeURIComponent(thisUrl);
                window.open(url, "shareBand", "width=400, height=500, resizable=yes");
            } 
            // else if (sns == 'instagram') {
            //     url = "http://twitter.com/share?url=" + encodeURIComponent(thisUrl) + "&text=" + encodeURIComponent(snsTitle);
            //     window.open(url, "tweetPop", "width=486, height=286,scrollbars=yes");
            // }
        },
        copy() {
            let url = '',
                textarea = document.createElement("textarea");

            document.body.appendChild(textarea);
            url = window.document.location.href;
            textarea.value = url;
            textarea.select();
            document.execCommand("copy");
            document.body.removeChild(textarea);
            uiCommon.toast.init('주소가 복사되었습니다.');
        },
    };

    // Body Fix
    uiCommon.bodyFix = {
        progressW: 0,
        on() {
            const $pgBar = $('.progressbar .in-progress'),
                  $wrap = $('#wrap');

            let wScroll = $(window).scrollTop(), 
                pgW = $pgBar.width();

            $pgBar.attr('style', 'width: ' + pgW + 'px !important');
            $('body').addClass('scrOff').css({'top': -wScroll});
        },
        off() {
            const $pgBar = $('.progressbar .in-progress');
            let wScroll = Math.abs(parseInt($('body').css('top')));

            $('body').removeClass('scrOff').removeAttr('style');
            $(window).scrollTop(wScroll);
            $pgBar.removeAttr('style');
        }
    };

    // Layer Popup
    uiCommon.layer = {
        obj: null,
        init() {
            const self = uiCommon.layer;

            $(".layer").attr({ role: "dialog", "aria-hidden": "true" });

            $("[target-layer-open]").on("click", function () {
                const pop_name = $(this).attr("target-layer-open");
                self.open(pop_name);
                self.obj = $(this);
            });

            $("[target-layer-close]").on("click", function () {
                const pop_name = $(this).attr("target-layer-close");
                self.close(pop_name);
            });

            $("[target-layer-bottom-open]").on("click", function () {
                const pop_name = $(this).attr("target-layer-bottom-open");
                self.bottomOpen(pop_name);
                self.obj = $(this);
            });

            $("[target-layer-bottom-close]").on("click", function () {
                const pop_name = $(this).attr("target-layer-bottom-close");
                self.bottomClose(pop_name);
            });

            $(".layer").on("click", function(e) {
                const pop_name = $(this).attr("id");
                if ( e.target.className == 'layer open' ) {
                    if ( $(this).find('.layer-pop').hasClass('bottom-pop') ) {
                        self.bottomClose(pop_name);
                    } else {
                        self.close(pop_name);
                    }
                }
            });

        },
        open(t) {
            uiCommon.bodyFix.on();
            $("#" + t)
                .attr({ tabindex: 0, "aria-hidden": "false" })
                .addClass('open')
                .focus();
        },
        close(t) {
            uiCommon.bodyFix.off();
            $("#" + t)
                .attr({ tabindex: "", "aria-hidden": "true" })
                .removeClass('open');
            uiCommon.layer.obj && uiCommon.layer.obj.focus();
        },
        bottomOpen(t) {
            // uiCommon.bodyFix.on();

            $("#" + t)
                .attr({ tabindex: 0, "aria-hidden": "false" })
                .addClass('open')
                .focus();
            
            setTimeout(() => {
                $("#" + t).find('.bottom-pop').css({
                    'transform' : 'translateY(0)'
                });
            }, 100);
        },
        bottomClose(t) {
            // uiCommon.bodyFix.off();

            $("#" + t).find('.bottom-pop').css({
                'transform' : 'translateY(100%)'
            });
            
            setTimeout(() => {
                $("#" + t)
                    .attr({ tabindex: "", "aria-hidden": "true" })
                    .removeClass('open');
                uiCommon.layer.obj && uiCommon.layer.obj.focus();
            }, 300);
        },
    };

    // GNB
    uiCommon.gnb = {
        init() {
            uiCommon.gnb.mobile();
        },
        mobile() {
            const $wrap = $('#wrap'),
                  $btnMenu = $('.btn-hamburger'),
                  $menu = $('.moMenu');

            $btnMenu.on('click', function() {
                $wrap.toggleClass('menu-active');
                $(this).toggleClass('active');
                if ( $(this).hasClass('active') ) {
                    $menu.addClass('open');
                    uiCommon.bodyFix.on();
                } else {
                    $menu.removeClass('open');
                    uiCommon.bodyFix.off();
                }
            });
            
        },
    };

    // slick 생성 객체
    uiCommon.slick = {
        init(el, opt) {
            return el.not('.slick-initialized').slick(opt);
        },
        destory(el) {
            el.filter('.slick-initialized').slick('unslick');
        },
    };

    // swiper 생성 객체
    uiCommon.swiper = {
        init(el, opt) {
            if ( !$(el).hasClass('swiper-container-initialized') ) {
                return new Swiper(el, opt);
            }
        }
    };

    uiCommon.eventBind = {
        init() {
            const self = uiCommon.eventBind;

            // 공통 이벤트
            $(".btn-top").length > 0 && self.topMove.init(); // topMove
            self.path.init(); // path
            $('.sub-wrap').length > 0 && self.progressBar.init(); // sub page progressbar

            // timeline 관련 이벤트
            $('.timeline').length > 0 && self.timeline.init();
            // webtoon view 관련 이벤트
            $('.webtoon-view-container').length > 0 && self.webtoon.init();
            // story 관련 이벤트
            $('.story').length > 0 && self.story.init();
        },
        topMove: {
            init () {
                const $btn = $(".btn-top");
                $btn.on("click", () => $("html,body").animate({scrollTop: 0},400));
            },
        },
        path: {
            init() {
                const path = window.location.pathname,
                  $gnb = $('#gnb li');

                if ( path.indexOf('timeline') != -1 ) $gnb.eq(0).find('a').addClass('active');
                if ( path.indexOf('webtoon') != -1 ) $gnb.eq(1).find('a').addClass('active');
                if ( path.indexOf('story') != -1 ) $gnb.eq(2).find('a').addClass('active');
            }
        },
        progressBar: {
            init() {
                const $el = $('.progressbar .in-progress');
                let scTop, b, c = 0, d = 100, el_width;
    
                $window.on('scroll', () => {
                    scTop = $(window).scrollTop(),
                    b = $(document).height() - $(window).height();
    
                    el_width = scTop * ( d - c ) / b + c;
                    $el.css('width', el_width + '%');
                });
            }
        },
        timeline: {
            init() {
                const self = uiCommon.eventBind.timeline;
                self.evt();
                self.pop();
            },
            evt() {
                const $wrap = $('#wrap'),
                      $tab = $('.timeline-year-list'),
                      $tab_top = $tab.offset().top,
                      $pop_ul = $('#selectYear .pop-cnt ul'),
                      $el = $('[data-year]'),
                      $btn = $('.btn-anchor-select span'),
                      $2020_posi = $('[data-year="2021"]').offset().top - 230,
                      $2010_posi = $('[data-year="2019"]').offset().top - 230,
                      $2000_posi = $('[data-year="2009"]').offset().top - 230;
                let scTop, year_arr = [], timer;

                $el.each((index, item) => {
                    year_arr.push({
                        year: $(item).attr('data-year'),
                        posi: $(item)
                    });
                });

                $tab.find('button').on('click', function() {
                    const value = $(this).attr('data-move');
                    let item = year_arr.filter(x => {
                        return x.year == value;
                    });

                    $("html,body").animate({scrollTop: item[0].posi.offset().top - 190},400);
                });

                $window.on('scroll', () => {
                    if ( !timer ) {
                        timer = setTimeout(() => {
                            timer = null;
                            scTop = $(window).scrollTop();
                            scTop >= $tab_top ? $wrap.addClass('tab-sticky') : $wrap.removeClass('tab-sticky');
                            $pop_ul.find('li button').removeClass('active');
                            
                            if ( scTop >= $2020_posi ) {
                                if ( scTop == 0 || scTop < $2010_posi) {
                                    $wrap.addClass('beige');
                                    $tab.find('button').removeClass('active');
                                    $tab.find("[data-move='2021']").addClass('active');
                                } 
                                if ( scTop >= $2010_posi ) {
                                    $wrap.removeClass('beige');
                                    $tab.find('button').removeClass('active');
                                    $tab.find("[data-move='2019']").addClass('active');
                                }
                                if ( scTop >= $2000_posi ) {
                                    $wrap.addClass('beige');
                                    $tab.find('button').removeClass('active');
                                    $tab.find("[data-move='2009']").addClass('active');
                                }
                                let item = year_arr.filter(x => {
                                    return x.posi.offset().top-180 < scTop;
                                });
                                $btn.text(item[item.length-1].year);
                                $pop_ul.find('li button[data-move="' + item[item.length-1].year + '"]').addClass('active');
                            }
                        }, 500);
                    }
                });

                $pop_ul.find('li button').on('click', function() {
                    const value = $(this).attr('data-move');
                    let item = year_arr.filter(x => {
                        return x.year == value;
                    });

                    $pop_ul.find('li button').removeClass('active');
                    $(this).addClass('active');
                    $btn.text($(this).text());

                    uiCommon.layer.bottomClose("selectYear");
                    $("html,body").animate({scrollTop: item[0].posi.offset().top - 190},400);
                });
            },
            pop() {
                const $slide = $('.sm-status .swiper-slide');

                let $sm = uiCommon.swiper.init('.sm-status', {
                    slidesPerView: 'auto',
                    spaceBetween: 15,
                    freeMode: true,
                    watchSlidesProgress: true,
                });
                let $bg = uiCommon.swiper.init('.bg-slider', {
                    effect: "fade",
                    thumbs: {
                        swiper: $sm,
                    },
                });

                $slide.on('click', function(){
                    $slide.removeClass('pick-slide');
                    $(this).addClass('pick-slide');
                });
            }
        },
        webtoon: {
            init() {
                const self = uiCommon.eventBind.webtoon;
                self.srcEvt();
            },
            srcEvt() {
                const $wrap = $('.webtoon'),
                      $header = $('header'),
                      $v_header = $('.view-header'),
                      $v_body = $('.view-body'),
                      $v_footer = $('.view-footer');
                let beforePosi = $(window).scrollTop(),
                    afterPosi;

                $v_body.on('click', () => $wrap.hasClass('isBar') ? $wrap.removeClass('isBar') : $wrap.addClass('isBar'));
                $window.on('scroll', () => {
                    afterPosi = $(window).scrollTop();
                    beforePosi < afterPosi ? $wrap.addClass('isHead') : $wrap.removeClass('isHead');
                    beforePosi = afterPosi;
                });
            },
        },
        story: {
            init() {
                const self = uiCommon.eventBind.story;
                self.evt();
            },
            evt() {
                const $wrap = $('#wrap'),
                      $tab = $('.box-page-move'),
                      $tab_top = $tab.offset().top,
                      $pop_ul = $('#selectMove .pop-cnt ul'),
                      $el = $('[data-move]'),
                      $btn = $('.btn-anchor-select span'),
                      $first = $('.story-contents dl').eq(0).offset().top;
                let scTop, move_arr = [], timer;

                $el.each((index, item) => {
                    move_arr.push({
                        move: $(item).attr('data-move'),
                        posi: $(item),
                        txt: $(item).find('h3').text()
                    });
                });

                $window.on('scroll', () => {
                    if ( !timer ) {
                        timer = setTimeout(() => {
                            timer = null;
                            scTop = $(window).scrollTop();
                            scTop >= $tab_top ? $wrap.addClass('tab-sticky') : $wrap.removeClass('tab-sticky');
                            $pop_ul.find('li button').removeClass('active');
                            
                            let item = move_arr.filter(x => {
                                return x.posi.offset().top-180 < scTop;
                            });

                            if ( scTop == 0 || scTop < $first) {
                                $pop_ul.find("li:first-of-type button").addClass('active');
                                $btn.text($pop_ul.find("li:first-of-type button").text());
                            } 

                            if ( item.length > 0 ) {
                                $btn.text(item[item.length-1].txt);
                                $pop_ul.find('li button[data-move-sec="' + item[item.length-1].move + '"]').addClass('active');
                            }
                        }, 500);
                    }
                });

                $pop_ul.find('li button').on('click', function() {
                    const value = $(this).attr('data-move-sec');
                    let item = move_arr.filter(x => {
                        return x.move == value;
                    });

                    $pop_ul.find('li button').removeClass('active');
                    $(this).addClass('active');
                    $btn.text($(this).text());

                    uiCommon.layer.bottomClose("selectMove");
                    $("html,body").animate({scrollTop: item[0].posi.offset().top - 120},400);
                });
            },
        },
    };

    uiCommon.init();
    return uiCommon;
})(window.uiCommon || {}, $(window)); 
