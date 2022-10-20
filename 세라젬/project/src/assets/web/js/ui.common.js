; const uiCommon = (function (uiCommon, $window) {
    uiCommon.init = () => {
        uiCommon.eventBind.init(); // 이벤트 바인딩

        // component
        $('[data-pop]').length > 0 && uiCommon.layer.init(); // layer popup
        $('[data-toast-pop]').length > 0 && uiCommon.toast.init(); // toast popup
    };

    // 로딩 호출
    uiCommon.loading = {
        open() {
            $('.loading-wrap').addClass('show');
            // uiCommon.bodyFix.on();
            $('#loading-bar svg').length === 0 && uiCommon.lottie.init('loading-bar', '10_infinite_scroll');
        },
        close() {
            $('.loading-wrap').removeClass('show');
            // uiCommon.bodyFix.off();
        },
    };

    // Body Scroll Fix
    uiCommon.bodyFix = {
        on() {
            const $wrap = $('#wrap');
            let wScroll = $window.scrollTop();

            $('body').addClass('scrOff').css({ 'top': -wScroll });
        },
        off() {
            let wScroll = Math.abs(parseInt($('body').css('top')));

            $('body').removeClass('scrOff').removeAttr('style');
            $window.scrollTop(wScroll);
        }
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

    // lottie 생성 객체
    uiCommon.lottie = {
        init($el, file) {
            lottie.loadAnimation({
                container: document.getElementById($el),
                renderer: 'svg',
                loop: true,
                autoplay: true,
                path: '../../../assets/web/images/lottie/' + file + '.json'
            });
        }
    };

    // Layer Popup
    uiCommon.layer = {
        init() {
            $('[data-pop]').on('click', (e) => this.open(e));
            $('body').on('click','.popup-close', (e) => this.close(e));
            document.addEventListener("click", (e) => {
                let _self = $(e.target);

                if (_self.hasClass('layer-popup-wrap')) {
                    _self.attr({ tabindex: "", "aria-hidden": "true" })
                        .stop().fadeOut()
                        .removeClass('show');
                }
            });
        },
        open($target) {
            let _id;
            if (typeof ($target) == 'object') {
                _id = '#' + $($target.currentTarget).attr('data-pop');
            } else {
                _id = '#' + $target;
            }

            // this.obj = $($target.currentTarget);
            // uiCommon.bodyFix.on();
            if (!$(_id).find('.layer-popup').hasClass('alert-popup') && !$(_id).find('.layer-popup').hasClass('slide-popup') && !$(_id).find('.layer-popup').hasClass('img-popup')) {
                this.scroll($(_id));
            }
            if ($(_id).find('.layer-popup').hasClass('slide-popup')) {
                this.slider($(_id));
            }

            $(_id).attr({ tabindex: 0, "aria-hidden": "false" })
                .stop().fadeIn()
                .css('display', 'flex')
                .addClass('show')
                .focus();
        },
        close($target) {
            console.log(typeof ($target));
            if (typeof ($target) == 'object') {
                $($target.currentTarget).closest('.layer-popup-wrap')
                    .attr({ tabindex: "", "aria-hidden": "true" })
                    .stop().fadeOut()
                    .removeClass('show');
            } else {
                $('#' + $target)
                    .attr({ tabindex: "", "aria-hidden": "true" })
                    .stop().fadeOut()
                    .removeClass('show');
            }
            // uiCommon.bodyFix.off();
            // this.obj.focus();
        },
        scroll($target) {
            const $popWrap = $target.find('.layer-popup'),
                $popBody = $target.find('.popup-body');

            // https://gromo.github.io/jquery.scrollbar/
            $($popBody).scrollbar();

            $.fn.hasScrollBar = function () {
                if ($popBody.length > 0) {
                    return this.get(0).scrollHeight > this.innerHeight();
                }
            };

            setTimeout(() => {
                if ($popBody.hasScrollBar()) {
                    $popWrap.addClass('isScroll');
                    $popBody.on('wheel scroll', function () {
                        $(this).scrollTop() > 0 ? $popWrap.addClass('down') : $popWrap.removeClass('down');
                    });
                }
            }, 100);
        },
        slider($target) {
            const $el = $target.find('.popup-slider'),
                _length = $el.find('> div').length;

            // 팝업 슬라이더
            setTimeout(() => {
                if ($el) {
                    $el.on({
                        init: function (event, slick) {
                            $('.slider-count .total').text(_length);
                        },
                        beforeChange: function (event, { slideCount: count }, currentSlide, nextSlide) {
                            $('.slider-count .current').text(nextSlide + 1);
                        },
                    });

                    uiCommon.slick.init($el, {
                        infinite: true,
                        speed: 500,
                        slidesToShow: 1,
                        dots: false,
                        arrows: false,
                    });
                }
            }, 100);
        },
    };

    // Toast Popup
    uiCommon.toast = {
        init() {

            $('[data-toast-pop]').on('click', (e) => this.open(e));
            const $btn = $('.btn-toast');

            $btn.on('click', function () {
                if (!$(this).siblings('.pop-toast').hasClass('show')) {
                    $(this).siblings('.pop-toast').addClass('show');
                    setTimeout(() => {
                        $('.pop-toast').removeClass('show');
                    }, 2000);
                }
            });
        },
        open($target) {
            let _id;
            if (typeof ($target) == 'object') {
                _id = '#' + $($target.currentTarget).attr('data-toast-pop');
            } else {
                _id = '#' + $target;
            }
            if (!$(_id).hasClass('show')) {
                $(_id).addClass('show');
                setTimeout(() => {
                    $(_id).removeClass('show');
                }, 2000);
            }
        },
    };

    uiCommon.eventBind = {
        init() {
            // 공통 이벤트
            $('header').length > 0 && this.header.init(); // 헤더 관련 이벤트
            $(".btn-top-move").length > 0 && this.floatingBtn.init(); // 플로팅 버튼
            $('.tab-wrap').length > 0 && this.tab.init(); // 탭 관련 이벤트
            $('.box-tooltip').length > 0 && this.tooltip.init(); // 툴팁 이벤트
            $('.detail-comment').length > 0 && this.commentMore.init(); // 댓글관련 이벤트
            $('.box-input-write .box-input textarea').length > 0 && this.commentInput.init(); // 댓글입력 관련 이벤트
            $('.accordion-head button').length > 0 && this.accordion.init(); // 아코디언 이벤트
            $('.rolling-list').length > 0 && this.rolling.init(); // 롤링 이벤트
            $('.text-input-wrap').length > 0 && this.textField.init(); // 텍스트 필드 이벤트
            $('.box-search-word').length > 0 && this.popularSearchWord.init(); // 인기 검색어 이벤트
            $('.custom-scroll').length > 0 && this.customScroll.init();
            // $('.chips-editable').length > 0 && this.hashTag.init(); // 해시태그 삽입

            // 각 플러그인 객체 생성 호출
            this.slider.init(); // 슬라이더 생성호출 이벤트
            this.lottie.init(); // 로티 생성호출 이벤트
            $('.plugin-select').length > 0 && this.selectric.init(); // 셀렉트 플러그인 생성호출 이벤트
            // this.videojs.init(); // video js 플러그인
            this.writeEvent.init(); // 작성 페이지 관련 이벤트

            // 메뉴별 이벤트
            $('#main').length > 0 && this.mainEvt.init(); // 메인 페이지 관련 이벤트
            $('.story-detail').length > 0 && this.storyDetail.init(); // 스토리 상세 페이지 관련 이벤트
            $('.login-layout').length > 0 && this.loginEvent.init(); // 로그인 페이지 관련 이벤트

        },
        mainEvt: {
            init() {
                this.viSlider();
                this.scroll();
            },
            viSlider() {
                setTimeout(() => {
                    $('.main-kv').on({
                        init: function (event, slick) {

                            if ( $('.slick-slide.slick-active').find('video').length > 0 ) {
                                const $video = $('.slick-slide.slick-active').find('video')[0],
                                      _duration = $video.duration * 1000;

                                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', _duration);
                            } else {
                                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', 5000);
                            }
                        },
                        afterChange: function (event, { slideCount: count }, currentSlide, nextSlide) {
                            if ( $('.slick-slide.slick-active').find('video').length > 0 ) {
                                const $video = $('.slick-slide.slick-active').find('video')[0],
                                       _duration = $video.duration * 1000;

                                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', _duration);
                            } else {
                                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', 5000);
                            }
                        },
                    });
                }, 100);

                if ($('.main-kv > *').eq(0).find('video')[0]) {
                    const _duration = $('.main-kv > *').eq(0).find('video')[0].duration * 999;

                    uiCommon.slick.init($('.main-kv'), {
                        infinite: true,
                        slidesToShow: 1,
                        autoplay: true,
                        autoplaySpeed: _duration,
                        dots: true,
                        fade: true,
                    });
                } else {
                    uiCommon.slick.init($('.main-kv'), {
                        infinite: true,
                        slidesToShow: 1,
                        autoplay: true,
                        autoplaySpeed: 5000,
                        dots: true,
                        fade: true,
                    });
                }

            },
            scroll() {
                const controller = new ScrollMagic.Controller({globalSceneOptions: {duration: 600}}),
                      $el = $('.box-story-wrap .box-thumb-list li');

                $el.each((index, item) => {
                    const twin = TweenMax.to('#' + $(item).attr('id'), 0.3, {y: 0,opacity: 1});

                    new ScrollMagic.Scene({
                        triggerElement: '#' + $(item).attr('id'),
                        offset: -500
                    })
                    .setTween(twin)
                    .addTo(controller);
                });
            }
        },
        header: {
            init() {
                this.gnb(); // gnb
                this.search(); // 헤더 검색 이벤트

                $window.on('scroll', () => {
                    $(window).scrollTop() > 0 ? $('header').addClass('scrolling') : $('header').removeClass('scrolling');
                });
            },
            search() {
                const $el = $('.box-hd-sch'),
                    $input = $el.find('.sch-input'),
                    $del = $el.find('.ico-search-delete'),
                    $schBox01 = $el.find('.box-sch-type1'),
                    $schBox02 = $el.find('.box-sch-type2');

                function validate() {
                    let currentVal = $input.val();

                    if (currentVal !== '') {
                        $del.show();
                        $schBox01.removeClass('on');
                        $schBox02.show();
                    } else {
                        $del.hide();
                        $schBox01.addClass('on');
                        $schBox02.hide();
                    }
                }

                // 검색 input 타이핑 이벤트
                setTimeout(() => {
                    $input.on('change keyup', () => validate());
                }, 100);

                // input 내용 초기화
                $del.on('click', function () {
                    $(this).hide();
                    $schBox02.hide();
                    $input.val('').focus();
                });

                // input 포커싱
                $input.on('focus', () => {
                    validate();
                    $input.addClass('isFocus');
                });

                document.querySelector('body').addEventListener('click', ({ target }) => {
                    if (target.closest('.box-hd-sch')) {
                        validate();
                        $input.addClass('isFocus');
                    } else {
                        $input.removeClass('isFocus');
                        $schBox01.removeClass('on');
                        $schBox02.hide();
                        $del.hide();
                    }
                });
            },
            gnb() {
                const $hamburger = $('.btn-hamburger'),
                    $menu = $('.gnb-wrap'),
                    $dep1 = $('.dep1.isDep2');

                // gnb menu open
                $hamburger.on('click', function () {
                    $menu.fadeIn().addClass('open');
                    // uiCommon.bodyFix.on();
                });

                // gnb menu close
                $menu.on('click', function (event) {
                    const $className = event.target.className;

                    if ($className === 'gnb-wrap open') {
                        $menu.hide().removeClass('open');
                        // uiCommon.bodyFix.off();
                    }
                });

                // dep2 slide
                $dep1.on('click', function () {
                    $(this).toggleClass('open');
                    $(this).siblings('.dep2-list').slideToggle('fast');
                });
            },
        },
        tab: {
            init() {
                $('.tab-wrap').hasClass('tab-ctrl') && this.tabEvent(); // 탭 조작 이벤트
                $('.tab-wrap .ico-1depth-close').length > 0 && this.tabDropDown(); // dropdown 이벤트
            },
            tabEvent() {
                $(".tab-wrap").each(function(index, item) {
                    $(item).find(".tab-list > li")
                        .eq(0)
                        .find("a, button")
                        .attr({ title: "현재 탭", "aria-selected": "true", role: "tab" })
                        .addClass('on');
                    $(item).find(".tab-content")
                        .find("> div")
                        .eq(0)
                        .attr("aria-hidden", "false")
                        .siblings("div")
                        .attr("aria-hidden", "true");
                });

                $(".tab-ctrl .tab-list > li > *").on("focusin click", function () {
                    let i = $(this).closest("li").index();

                    $(this)
                        .addClass("on")
                        .attr({ title: "현재 탭", "aria-selected": "true" })
                        .closest("li")
                        .siblings("li")
                        .find("a")
                        .removeClass("on")
                        .attr({ title: "", "aria-selected": "false" });
                    $(this)
                        .closest(".tab-list")
                        .siblings(".tab-content")
                        .children("div")
                        .attr("aria-hidden", "false")
                        .eq(i)
                        .show()
                        .siblings("div")
                        .hide()
                        .attr("aria-hidden", "true");
                });
            },
            tabDropDown() {
                const $list = $('.tab-list'),
                    $btn = $('.ico-1depth-close');

                // click event
                $btn.on('click', function () {
                    $(this).closest('.btn-tab-wrap').siblings('.tab-list').toggleClass('active')
                });

                // tab more btn show? hide?
                $list.each((index, item) => {
                    const tabW = $(item).width(),
                        arrTab = $(item).find('> li');
                    let sumW = 0, _index;

                    // wheel event
                    $(item).on('wheel', function (event) {
                        event.preventDefault();
                        let scrollY = $(this).scrollLeft();
                        $(this).scrollLeft(scrollY += event.originalEvent.deltaY);
                    });

                    arrTab.each((index, listItem) => {
                        const itemW = $(listItem).width();
                        if ($(listItem).find('.on').parent().index() != -1) {
                            _index = $(listItem).find('.on').parent().index();
                        }
                        sumW += itemW;
                    });

                    if (tabW <= sumW) {
                        $(item).siblings('.btn-tab-wrap').show();
                        $(item).addClass('isScroll');

                        if (_index > 6) {
                            // $(item).animate({ scrollLeft: _index * 90 }, 400);
                            setTimeout(() => {
                                $(item).scrollLeft(_index * 90);
                            }, 160);
                        }
                    }
                });

            },
        },
        floatingBtn: {
            init() {
                const $wrap = $('.footer-floating'),
                    $topMove = $(".btn-top-move"),
                    $write = $(".btn-write-bottom");
                let scTop, offsetY;

                $(".btn-write-head").length === 0 && $write.hide();
                $('#event.challenge').length > 0 && $write.show();
                $('#welcafe.dtCommunity').length > 0 && $write.show();
                $('.user-home').length > 0 && $write.show();

                setTimeout(() => {
                    offsetY = $('#container').innerHeight() - $(window).height() - $('footer').innerHeight() + 100;
                    $window.on('scroll', function () {
                        scTop = $(this).scrollTop();
                        if (scTop >= 140) {
                            $wrap.addClass('on');
                            // setTimeout(() => $write.addClass('reduce'), 1000);
                        } else {
                            $wrap.removeClass('on');
                        }
                        scTop >= offsetY ? $wrap.addClass('fix') : $wrap.removeClass('fix');
                    });
                }, 100);

                $topMove.on("click", () => $("html,body").animate({ scrollTop: 0 }, 400));
            },
        },
        tooltip: {
            init() {
                this.open();
                this.close();
            },
            open() {
                const $btn = $('.btn-tooltip');

                $btn.on('click', function () {
                    if ( !$(this).hasClass('disabled') ) {
                        $(this).siblings('.active-toolBox').toggleClass('active');
                    }
                });
            },
            close() {
                document.querySelector('body').addEventListener('click', ({ target }) => {
                    !target.closest('.box-tooltip') && $('.active-toolBox').removeClass('active');
                });
            },
        },
        slider: {
            init() {
                // 커뮤니티 메인
                if ($('.popular-list').length) {
                    const $el = uiCommon.slick.init($('.popular-list'), {
                        infinite: false,
                        speed: 500,
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        dots: false,
                    });

                    $('.slick-next').on('click', function () {
                        if ($(this).hasClass('slick-disabled')) {
                            $('.popular-list').slick('slickGoTo', 0);
                        }
                    });
                }

                // 챌린지 서브메인
                if ($('.ev-lg-slide').length) {
                    $('.tab-list-round a').on('click', function(){
                        $('.ev-lg-slide').slick('refresh');
                        $('.slick-next').on('click', function () {
                            if ($(this).hasClass('slick-disabled')) {
                                $(this).closest('.slick-slider').slick('slickGoTo', 0);
                            }
                        });
                    });
                    uiCommon.slick.init($('.ev-lg-slide'), {
                        infinite: false,
                        speed: 500,
                        slidesToShow: 1,
                        dots: false,
                    });
                    $('.slick-next').on('click', function () {
                        if ($(this).hasClass('slick-disabled')) {
                            $(this).closest('.slick-slider').slick('slickGoTo', 0);
                        }
                    });
                }
                if ($('.ev-slide').length) {
                    $('.tab-list-round a').on('click', function(){
                        $('.ev-slide').slick('refresh');
                        $('.slick-next').on('click', function () {
                            if ($(this).hasClass('slick-disabled')) {
                                $(this).closest('.slick-slider').slick('slickGoTo', 0);
                            }
                        });
                    });
                    uiCommon.slick.init($('.ev-slide'), {
                        infinite: false,
                        speed: 500,
                        slidesToShow: 4,
                        slidesToScroll: 4,
                        dots: false,
                    });

                    $('.slick-next').on('click', function () {
                        if ($(this).hasClass('slick-disabled')) {
                            $(this).closest('.slick-slider').slick('slickGoTo', 0);
                        }
                    });
                }

                // 공지사항 슬라이드
                if ($('.slider-wrap').length && $('.box-notice-list').length) {
                    const $el = uiCommon.slick.init($('.box-notice-list'), {
                        infinite: false,
                        speed: 500,
                        slidesToShow: 3,
                        slidesToScroll: 3,
                        dots: false,
                    });

                    $('.slick-next').on('click', function () {
                        if ($(this).hasClass('slick-disabled')) {
                            $('.box-notice-list').slick('slickGoTo', 0);
                        }
                    });
                }

                // 차트 슬라이드
                if ($('.chart-slider').length) {
                    const $el = uiCommon.slick.init($('.chart-slider'), {
                        infinite: false,
                        speed: 500,
                        slidesToShow: 1,
                        dots: false,
                    });

                    // $('.slick-next').on('click', function () {
                    //     if ($(this).hasClass('slick-disabled')) {
                    //         $('.popular-list').slick('slickGoTo', 0);
                    //     }
                    // });
                }
            },
        },
        lottie: {
            init() {
                // 검색결과가 없습니다./관심작가가 없습니다.
                $('#not-search').length > 0 && uiCommon.lottie.init('not-search', '01_coffee_cup');
                //이벤트-챌린지
                $('#not-challenge').length > 0 && uiCommon.lottie.init('not-challenge', '06_challenge');
                $('#not-challenge02').length > 0 && uiCommon.lottie.init('not-challenge02', '06_challenge');
                $('#not-challenge03').length > 0 && uiCommon.lottie.init('not-challenge03', '06_challenge');
                $('#not-challenge04').length > 0 && uiCommon.lottie.init('not-challenge04', '06_challenge');
                $('#not-challenge05').length > 0 && uiCommon.lottie.init('not-challenge05', '06_challenge');
                //페이지를 찾을 수 없습니다.
                $('#not-page').length > 0 && uiCommon.lottie.init('not-page', '03_error_page');
                //웰카페
                $('#not-pin').length > 0 && uiCommon.lottie.init('not-pin', '02_wellcafe_pin');
                // 등록된 게시물이 없습니다.
                $('#not-board').length > 0 && uiCommon.lottie.init('not-board', '08_community_empty');
                // 완료 체크 로티
                $('#icon-lottie06').length > 0 && uiCommon.lottie.init('icon-lottie06', '07_complete');
                // 비원활
                $('#icon-lottie04').length > 0 && uiCommon.lottie.init('icon-lottie04', '04_error_service');
                $('#ceracheck').length > 0 && uiCommon.lottie.init('ceracheck', '11_ceracheck');
                // 휴면회원
                $('#dormant-member').length > 0 && uiCommon.lottie.init('dormant-member', '05_login_dormant');
            }
        },
        accordion: {
            init() {
                const $btn = $('.accordion-head button'),
                    $body = $('.accordion-body');

                $btn.on('click', function () {

                    if (!$(this).hasClass('open')) {
                        $btn.removeClass('open');
                        $body.stop().slideUp('fast');
                        $(this).addClass('open');
                        $(this).closest('.accordion-wrap').find('.accordion-body').stop().slideDown('fast');
                    } else {
                        $btn.removeClass('open');
                        $body.stop().slideUp('fast');
                    }
                });
            },
        },
        commentMore: {
            init() {
                const $el = $('.main-comment');

                $el.each((index, item)=>{
                    const   _self = $(item),
                            _isBest = _self.closest('.best-comment').length,
                            _isComment = _self.siblings('.sub-comment').length;

                    if (_isComment) {
                        _self.find('.ico-comment').addClass('isComment');
                        if (!_isBest) {
                            _self.find('.ico-comment').addClass('on');
                            _self.siblings('.sub-comment').show();
                        }
                    }
                });

                setTimeout(() => {
                    const $btn = $('.main-comment .ico-comment.isComment');

                    $btn.on('click', function() {
                        const _sub = $(this).closest('li').find('.sub-comment');

                        $(this).toggleClass('on');
                        _sub.stop().slideToggle('fast');
                    });
                }, 50);
            }
        },
        commentInput: {
            init() {
                const $el = $('.box-input-write .box-input textarea'),
                    hiddenDiv = $(document.createElement('div'));
                let content = null;

                hiddenDiv.addClass('tarea-hidden');
                $el.after(hiddenDiv);
                $el.on('keyup', function () {
                    content = $(this).val();
                    content = content.replace(/\n/g, '<br>');
                    $(this).siblings('.tarea-hidden').html(content + '<br class="lbr">');
                    $(this).css('height', $(this).siblings('.tarea-hidden').height());

                });
            },
        },
        storyDetail: {
            init() {
                this.headerNavi();
                this.bottomNavi();
                $('.sub-visual .video-js').length > 0 && this.coverVideo();
            },
            coverVideo() {
                const $el = $('.sub-visual'),
                    $txt = $el.find('.box-txt'),
                    $video = videojs('#cover-video');

                $txt.hover(function () {
                    $el.addClass('video-hover');
                }, function () {
                    $el.removeClass('video-hover');
                });

                $txt.on('click', () => {
                    $video.paused() ? $video.play() : $video.pause();;
                });
            },
            headerNavi() {
                const $header = $('header'),
                    $storyHeader = $('.story-detail-header'),
                    $progressBar = $('.progressbar .in-progress');
                let b, c = 0, d = 100, pg_width;

                $window.on('scroll', function () {
                    let scTop = $(this).scrollTop();
                    b = $(document).height() - $(window).height();

                    pg_width = scTop * (d - c) / b + c;
                    $progressBar.css('width', pg_width + '%');

                    if (scTop > $header.height() || $('body').css('top') != '0px') {
                        $header.hide();
                        $storyHeader.stop().fadeIn('fast');
                    } else {
                        $header.show();
                        $storyHeader.stop().fadeOut('fast');
                    }
                });
            },
            bottomNavi() {
                const $el = $('.layout-detail-view');

                $el.addClass('sticky');
                setTimeout(function(){
                    let winH = $(window).height(),
                    $comment = $el.find('.detail-comment').offset().top - (winH * 1.2);

                    $window.on('resize',function(){
                        winH = $(window).height();
                        $comment = $el.find('.detail-comment').offset().top - (winH * 1.2);
                    });
                    $window.on('scroll', function () {
                        let scTop = $(this).scrollTop();

                        scTop > $comment ? $el.removeClass('sticky') : $el.addClass('sticky');
                    });
                },100);
            },
        },
        rolling: {
            init() {
                const $list = $('.rolling-list'),
                    $count = $('.rolling-count'),
                    $arrow = $('.rolling-arrow');

                $count.find('.total').text($list.find('> div').length);

                $list.on({
                    beforeChange: function (event, { slideCount: count }, currentSlide, nextSlide) {
                        $count.find('.current').text(nextSlide + 1);
                    },
                });

                uiCommon.slick.init($list, {
                    infinite: true,
                    speed: 500,
                    slidesToShow: 1,
                    dots: false,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    vertical: true,
                });

                $arrow.find('.prev').on('click', () => $list.slick('slickPrev'));
                $arrow.find('.next').on('click', () => $list.slick('slickNext'));



            }
        },
        selectric: {
            init() {
                // $('.plugin-select').selectric({
                //     maxHeight: 284,
                // });
                this.niceSelect();
            },
            niceSelect() {
                $('.plugin-select').niceSelect();

                setTimeout(() => {
                    const $select = $('.nice-select');

                    $select.each(function(index, item){
                        const $list = $(item).find('.list li');

                        console.log(item);

                        if (!$list.eq(0).hasClass('selected')) {
                            $(item).addClass('on');
                        }

                        $list.on('click', function(){
                            const _index = $(this).index();
                            _index == 0 ? $(item).removeClass('on') : $(item).addClass('on');
                        });
                    });
                }, 50);
            }
        },
        writeEvent: {
            init() {
                $('.box-guide').length > 0 && this.guideBox();
                $('.box-module-wrap').length > 0 && this.moduleList();
                $('.box-board-head .plugin-select').length > 0 && this.selectConv();
                $('.text-edit-bar').length > 0 && this.textEditBar();
            },
            guideBox() {
                const $el = $('.box-guide');
                setTimeout(() => $el.addClass('hide'), 3000);
            },
            moduleList() {
                const $wrap = $('.box-module-wrap'),
                    $list = $('.list-module'),
                    _top = $wrap.offset().top - 100;

                setTimeout(() => {
                    $list.find('> li').hover(function () {
                        $(this).siblings('li').find('button').addClass('unfocus');
                    }, function () {
                        $(this).siblings('li').find('button').removeClass('unfocus');
                    });
                }, 500);

                // $window.on('scroll', function () {
                //     let scTop = $(this).scrollTop();
                //     scTop >= _top ? $wrap.addClass('fix') : $wrap.removeClass('fix');
                //     // if ( scTop >= _top ) {
                //     //     $wrap.css('top', '70px');
                //     // }
                // });

                $('.ico-post-mov').on('click', function () {
                    $(this).siblings('.layer-module-select').toggleClass('on');
                });

                document.querySelector('body').addEventListener('click', ({ target }) => {
                    if (!target.closest('.ico-post-mov')) {
                        $('.layer-module-select').removeClass('on');
                    }
                });
            },
            selectConv() {
                const $select = $('.box-board-head .plugin-select');

                if ($select.find('option:selected').index() != 0) {
                    $('.selectric').addClass('on');
                }

                $select.on('change', function () {
                    if ($(this).find('option:selected').index() != 0) {
                        $('.selectric').addClass('on');
                    } else {
                        $('.selectric').removeClass('on');
                    }
                });
            },
            textEditBar() {
                const $el = $('.text-edit-bar'),
                      _posi = $('.box-edit-wrap').offset().top - 200;

                $window.on('scroll', function() {
                    let scTop = $(this).scrollTop();

                    scTop >= _posi ? $el.addClass('active') : $el.removeClass('active');
                });
            },
        },
        textField: {
            init() {
                this.delete();
            },
            delete() {
                const $el = $('.text-input-wrap'),
                    $input = $el.find('input'),
                    $del = $el.find('.ico-search-delete');

                // input 타이핑 이벤트
                setTimeout(() => {
                    $input.on('change keyup', function () {
                        let currentVal = $(this).val(),
                            btn = $(this).siblings('.ico-search-delete'),
                            btn02 = $(this).siblings('.btn-action');

                        console.log(btn02.length);
                        if ( currentVal !== '' ) {
                            btn.show();
                            btn02.length && btn02.show();
                        } else {
                            btn.hide();
                            btn02.length && btn02.hide();
                        }
                    });
                }, 100);

                $del.on('click', function () {
                    $(this).hide();
                    $(this).siblings('input').val('').focus();
                });

                document.querySelector('body').addEventListener('click', ({ target }) => {
                    if (!target.closest('.text-input-wrap')) {
                        $del.hide();
                    }
                });

            }
        },
        popularSearchWord: {
            init() {
                this.rolling();
                this.click();
            },
            rolling() {
                const $el = $('.box-search-word .rolling-wrap'),
                    _elH = $el.height(),
                    _count = $el.find('li').length,
                    _totalH = _elH * _count;

                let move = 0;

                function rollingEvent() {
                    move += _elH;

                    $el.find('ul').animate({ 'top': -move }, 600, function () {
                        if (move >= _totalH) {
                            $(this).css('top', 0);
                            move = 0;
                        }
                    });
                }

                setInterval(rollingEvent, 3000);
                $el.find('ul').append($el.find('li').first().clone());
            },
            click() {
                const $btn = $('.box-search-word .ico-black-arr-down'),
                    $list = $('.box-search-word .list-popular-wrap');

                $btn.on('click', () => { $list.addClass('show'); });

                $(document).mouseup(function (e) {
                    if ($list.has(e.target).length === 0) { $list.removeClass("show"); };
                });
            },

        },
        customScroll: {
            init() {
                $('.custom-scroll').scrollbar();
            },
        },
        hashTag: {
            init() {
                const $wrap = $('.chips-editable'),
                    $input = $wrap.find('.edit-input-wrap .chip-edit'),
                    $temp = $wrap.find('#input-width-calc'),
                    regExp = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

                let keywords = [],
                    _tempW = $temp.innerWidth();

                $input.css('width', _tempW);

                $(document).on("click", ".chip-edit-done", function () {
                    const index = $(this).index();

                    keywords.splice(index, 1);
                    $(this).remove();
                    $input.focus();
                });

                // 입력 이벤트
                $input.on('propertychange change keyup paste input', function (event) {
                    const _value = $(this).val();

                    // 엔터키 입력
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        const isExists = keywords.findIndex(x => x === _value) > -1;

                        if (_value && _value.length > 0 && !isExists) {

                            if (regExp.test(_value)) {
                                errorSet();
                            } else if (!regExp.test(_value)) {
                                errorDel();
                                keywords.push(_value);
                                keywordSet(_value);
                            }
                        }

                        $temp.text('');
                        $input.val('').focus();
                        $input.css('width', $temp.innerWidth());
                    } else {
                        changeWidth(_value);
                    }
                });

                $input.on('keydown', function (event) {
                    const _value = $(this).val();

                    if (event.keyCode === 8) {
                        if (_value === '') {
                            const index = $('.chip-edit-done').length - 1;

                            if (index >= 0) {
                                keywords.splice(index, 1);
                                $('.chip-edit-done').eq(index).remove();
                            }
                        }
                        changeWidth(_value);
                    }
                });

                function changeWidth(value) {
                    $temp.text(value);
                    $input.css('width', $temp.innerWidth());
                }

                function keywordSet(value) {
                    const $el = $wrap.find('.edit-input-wrap'),
                        $btn = `<button class="chip-edit chip-edit-done">${value}</button>`;
                    $el.before($btn);
                }

                function errorSet() {
                    const $btn = `<strong class="error">해시태그에는 특수문자를 사용할 수 없습니다.</strong>`;
                    errorDel();
                    $wrap.after($btn);
                }

                function errorDel() {
                    console.log();
                    $wrap.siblings('.error').remove();
                }
            },
        },
        loginEvent: {
            init() {
                this.inputEv();
            },
            inputEv() {
                const $input = $('.box-input input'),
                    $btnInput = $('.login-layout .btn-input'),
                    $login2depth = $('.login-layout .login-2depth'),
                    $time = $('.login-layout .access-time');

                // input focus 이벤트
                $input.focus(function () {
                    const thisBtn = $(this).parents('.box-input').find('.btn-input');
                    thisBtn.show();
                });
                // input 타이핑 이벤트
                setTimeout(() => {
                    $input.on('change keyup', function () {
                        let currentVal = $(this).val(),
                            thisBtn = $(this).parents('.box-input').find('.btn-input');
                        if (thisBtn.hasClass('complete') == false) {
                            currentVal !== '' ? thisBtn.addClass('on') : thisBtn.removeClass('on');
                        }
                    });
                }, 100);

                document.querySelector('body').addEventListener('click', ({ target }) => {
                    if (!target.closest('.box-input')) {
                        if ($input.val() == '' && !$btnInput.hasClass('complete')) {
                            $btnInput.hide();
                        }
                    }
                });

                // 인증하기 버튼 클릭
                $btnInput.on('click', function () {
                    if ($(this).hasClass('on')) {
                        $login2depth.show();
                    }
                });
            }
        }
    };

    uiCommon.init();
    return uiCommon;
})(window.uiCommon || {}, $(window));
