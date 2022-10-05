const uiCommon = (function (uiCommon, $window) {
    uiCommon.init = () => {
        uiCommon.screenSize.init();
        uiCommon.gnb.init();
        uiCommon.eventBind.init(); // 이벤트 바인딩

        // component
        $(".tab-wrap").length > 0 && uiCommon.tab.init(); // 탭 관련 이벤트
        $("[data-pop]").length > 0 && uiCommon.layer.init(); // layer popup
        $("[data-aos]").length > 0 && AOS.init({ once: true });
    };

    uiCommon.mobileCheck = {
        init() {
            let result;
            let userAgent = navigator.userAgent;

            if (window.innerWidth < 769 && userAgent.match(/iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i) != null || userAgent.match(/LG|SAMSUNG|Samsung/) != null) {
                result = true;
            } else {
                result = false;
            }

            return result;
        },
    };

    uiCommon.screenSize = {
        init() {
            this.set();
            $window.on("resize", () => this.set());
        },
        set() {
            const _head = $("header").innerHeight(),
                _footer = $("footer").innerHeight(),
                _mfooter = "-" + $("footer").innerHeight(),
                _height = $(window).height();

            setTimeout(() => {
                document.documentElement.style.setProperty("--head", `${_head}px`);
                document.documentElement.style.setProperty("--footer", `${_footer}px`);
                document.documentElement.style.setProperty("--mfooter", `${_mfooter}px`);
                document.documentElement.style.setProperty("--height", `${_height}px`);
            }, 50);
        },
    };

    // GNB
    uiCommon.gnb = {
        init() {
            this.gnbToggle();
            this.moMenu();
        },
        gnbToggle() {
            const $el = $("#gnb"),
                $btn = $(".btn-hamburger"),
                $close = $el.find(".icon-close");

            $btn.on("click", () => {
                $el.addClass("open");
                uiCommon.bodyFix.on();
            });
            $close.on("click", () => {
                $el.removeClass("open");
                uiCommon.bodyFix.off();
            });
        },
        moMenu() {
            const $el = $(".mo-gnb-menu"),
                $btn = $el.find(".dep1");

            $btn.on("click", (e) => {
                const _self = $(e.target),
                    $list = _self.closest("li"),
                    $dep2 = _self.siblings(".dep2");

                if ($list.hasClass("on")) {
                    $el.find("li").removeClass("on");
                    $el.find(".dep2").stop().slideUp("fast");
                } else {
                    $el.find("li").removeClass("on");
                    $el.find(".dep2").stop().slideUp("fast");
                    $list.addClass("on");
                    $dep2.stop().slideDown("fast");
                }
            });
        },
    };

    // Body Scroll Fix
    uiCommon.bodyFix = {
        on() {
            let wScroll = $window.scrollTop();
            $("body").addClass("scrOff").css({ top: -wScroll });
        },
        off() {
            $("body").removeClass("scrOff").removeAttr("style");
        },
    };

    // slick 생성 객체
    uiCommon.slick = {
        init(el, opt) {
            const obj = el;
            obj.not(".slick-initialized").slick(opt);
            return obj;
        },
        destory(el) {
            el.filter(".slick-initialized").slick("unslick");
        },
    };

    // swiper 생성 객체
    uiCommon.swiper = {
        init(el, opt) {
            let obj;

            obj = new Swiper(el, opt);
            if ($(el).find(".swiper-drag-scroll")) {
                let _scroll = $(el).find(".swiper-drag-scroll");
                setTimeout(() => {
                    if (_scroll.find(".swiper-scrollbar").is(":visible")) {
                        _scroll.addClass("active");
                    } else {
                        _scroll.removeClass("active");
                    }
                }, 100);
            }

            return obj;
        },
    };

    // Layer Popup
    uiCommon.layer = {
        init() {
            $("[data-pop]").on("click", (e) => this.open(e));
            $("body").on("click", ".popup-close", (e) => this.close(e));
        },
        open($target) {
            let _id;
            if (typeof $target == "object") {
                _id = "#" + $($target.currentTarget).attr("data-pop");
            } else {
                _id = "#" + $target;
            }

            this.obj = $($target.currentTarget);
            uiCommon.bodyFix.on();

            $(_id).attr({ tabindex: 0, "aria-hidden": "false" }).addClass("show").focus();
        },
        close($target) {
            if (typeof $target == "object") {
                $($target.currentTarget).closest(".layer-popup-wrap").attr({ tabindex: "", "aria-hidden": "true" }).removeClass("show");
            } else {
                $("#" + $target)
                    .attr({ tabindex: "", "aria-hidden": "true" })
                    .removeClass("show");
            }
            uiCommon.bodyFix.off();
            this.obj.focus();
        },
    };

    // Tab
    uiCommon.tab = {
        init() {
            $(".tab-wrap").hasClass("tab-ctrl") && this.tabEvent(); // 탭 조작 이벤트
            this.tabActiveFocus(); // 스크롤 생겼을 경우 활성화된 버튼이 보이게
        },
        tabEvent() {
            $(".tab-wrap").each(function (index, item) {
                $(item)
                    .find(".tab-list > li")
                    .eq(0)
                    .find("a, button")
                    .attr({ title: "현재 탭", "aria-selected": "true", role: "tab" })
                    .addClass("on");
                $(item).find(".tab-content").find("> div").eq(0).attr("aria-hidden", "false").siblings("div").attr("aria-hidden", "true");
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
        tabActiveFocus() {
            const $list = $(".tab-list");

            $list.each((index, item) => {
                const tabW = $(item).width(),
                    arrTab = $(item).find("> li");
                let sumW = 0,
                    _index;

                arrTab.each((index, listItem) => {
                    const itemW = $(listItem).width();
                    if ($(listItem).find(".on").parent().index() != -1) {
                        _index = $(listItem).find(".on").parent().index();
                    }
                    sumW += itemW;
                });

                if (tabW <= sumW) {
                    _index >= 2 && $(item).scrollLeft(_index * 100);
                }
            });
        },
    };

    uiCommon.eventBind = {
        init() {
            // 공통 이벤트
            $("header").length > 0 && this.header.init(); // 헤더
            $("footer").length > 0 && this.footer.init(); // 푸터
            this.form.init(); // 폼 이벤트
            $(".box-tooltip").length > 0 && this.tooltip.init(); // 레이어 툴팁
            $(".accordion-list").length > 0 && this.accordion.init(); // 아코디언
            $(".icon-print").length > 0 && this.print.init(); // 프린트
            if ($(".custom-scroll").length) {
                if ($(".breadcrumbs").length) {
                    setTimeout(() => {
                        $(".breadcrumbs").find('.view-tooltip').css({
                            'opacity' : 1,
                            'visibility' : 'visible',
                            'display' : 'none'
                        });
                    }, 100);
                }
                $(".custom-scroll").scrollbar(); // 커스텀 스크롤바
            }
            $(".btn-circle-ani").length > 0 && this.btnAnimation.init(); // 버튼 호버 애니메이션
            $(".box-fold").length > 0 && this.fold.init(); // 컨텐츠 양에 따라 동적으로 접기 기능 이벤트 삽입
            $(".breadcrumbs").length > 0 && this.breadcrumbs.init(); // 서브 네비

            // 메뉴별 이벤트
            $(".solutions-wrap").length > 0 && this.solutions.init(); // 솔루션 페이지 이벤트
            $(".firm-wrap").length > 0 && this.firm.init(); // firm 페이지 이벤트
            $(".insights-wrap").length > 0 && this.insights.init(); // insights 페이지 이벤트
            $(".careers-wrap").length > 0 && this.careers.init(); // careers 페이지 이벤트
            $(".probono-wrap").length > 0 && this.probono.init(); // probono 페이지 이벤트
            $(".professonals-wrap").length > 0 && this.professonals.init(); // professonals 페이지 이벤트
        },
        header: {
            init() {
                this.search();
                this.scroll();
            },
            search() {
                const $box = $(".hd-search-wrap"),
                    $btn = $("#hd-btn-search"),
                    $close = $box.find(".icon-close");

                $btn.on("click", () => $box.addClass("active"));
                $close.on("click", () => $box.removeClass("active"));
            },
            scroll() {
                const $wrap = $("#wrap");
                let beforePosi = $(window).scrollTop();
                let timer;

                window.addEventListener("scroll", (e) => {
                    // if (!timer) {
                    //     timer = setTimeout(() => {
                    //         timer = null;
                    //         if (window.scrollY > 70) {
                    //             $wrap.addClass("isScroll");
                    //         } else {
                    //             $wrap.removeClass("isScroll");
                    //         }

                    //         if (beforePosi < window.scrollY && window.scrollY > 70) {
                    //             $wrap.addClass("scrollDown");
                    //         }
                    //         else if (beforePosi > window.scrollY) {
                    //             $wrap.removeClass("scrollDown");
                    //         }
                    //         beforePosi = window.scrollY;
                    //     }, 200);
                    // }

                    if (window.scrollY > 70) {
                        $wrap.addClass("isScroll");
                    } else {
                        $wrap.removeClass("isScroll");
                    }

                    if (beforePosi < window.scrollY && window.scrollY > 70) {
                        $wrap.addClass("scrollDown");
                    }
                    else if (beforePosi > window.scrollY) {
                        $wrap.removeClass("scrollDown");
                    }
                    beforePosi = window.scrollY;
                });
            },
        },
        footer: {
            init() {
                $(".btn-top-move").on("click", () => {
                    $("html,body").stop().animate({scrollTop: 0}, 300);
                });
            },
        },
        breadcrumbs: {
            init() {
                const _self = this;

                setTimeout(() => _self.sticky(), 400);
                _self.mobile();
                $(window).on("resize", () => _self.mobile());
            },
            sticky() {
                const $head = $(".page-heading-layout");
                const $el = $(".breadcrumbs");
                const _height = $el.height();
                const _posi = $el.offset().top;

                $(window).on("scroll", ()=>{
                    let _winTop = $(window).scrollTop();

                    if (_winTop > _posi) {
                        $head.css('padding-top', _height);
                        $el.addClass('sticky');
                    } else {
                        $head.removeAttr('style');
                        $el.removeClass('sticky');
                    }
                });
            },
            mobile() {
                const $el = $(".breadcrumbs > li");
                const _length = $el.length;

                if (uiCommon.mobileCheck.init() && _length > 2) {
                    $el.hide();
                    $el.eq(_length-1).show();
                    $el.eq(_length-2).addClass('beforeHide').show();
                } else {
                    $el.show();
                    $el.eq(_length-2).removeClass('beforeHide');
                }
            },
        },
        form: {
            init() {
                $(".box-input-wrap").length > 0 && this.resetBtn();
            },
            resetBtn() {
                const $el = $(".box-input-wrap"),
                    $input = $el.find(".box-input input"),
                    $reset = $el.find(".icon-text-reset");

                // input 타이핑 이벤트
                setTimeout(() => {
                    $input.on("change keyup", function () {
                        let currentVal = $(this).val(),
                            btn = $(this).siblings(".icon-text-reset");

                        currentVal !== "" ? btn.show() : btn.hide();
                    });
                }, 100);

                $reset.on("click", function () {
                    $(this).hide();
                    $(this).siblings("input").val("").focus();
                });

                document.querySelector("body").addEventListener("click", ({ target }) => {
                    if (!target.closest(".box-input-wrap")) {
                        $reset.hide();
                    }
                });
            },
        },
        tooltip: {
            init() {
                const $box = $(".box-tooltip"),
                    $btn = $box.find("> button, > a"),
                    $list = $box.find(".view-tooltip");

                $btn.on("click", function () {
                    const _self = $(this),
                        _parent = _self.closest(".box-tooltip"),
                        _list = _self.siblings(".view-tooltip");

                    // console.log(_self.closest('.breadcrumbs'));
                    if (!_parent.hasClass("active")) {
                        $box.removeClass("active");
                        $list.stop().slideUp("fast");
                        _parent.addClass("active");
                        _list.stop().slideDown("fast");
                    } else {
                        _parent.removeClass("active");
                        _list.stop().slideUp("fast");
                    }
                });
                document.querySelector("body").addEventListener("click", ({ target }) => {
                    if (!target.closest(".box-tooltip")) {
                        $box.removeClass("active");
                        $list.stop().slideUp("fast");
                    }
                });
            },
        },
        accordion: {
            init() {
                $(document).on("click", ".accordion-tit button", (e) => {
                    const _self = $(e.target),
                        _list = _self.closest("li"),
                        _txt = _list.find(".accordion-txt");

                    _self.toggleClass("on");
                    _list.toggleClass("on");
                    _txt.stop().slideToggle("fast").css("display", "flex");
                });
            },
        },
        print: {
            init() {
                $(".icon-print").on("click", () => window.print());
            },
        },
        btnAnimation: {
            init() {
                funcInit();

                function funcInit() {
                    const $el = $(".btn-circle-ani");
                    let tl = null;
                    let arr = [];

                    setTimeout(() => {
                        arrInit();
                        $(window).on("resize", () => {
                            arr = [];
                            arrInit();
                        });

                        $el.on("mouseenter", function (e) {
                            const _self = $(this),
                                _index = $el.index(this),
                                _circle = _self.find("i"),
                                selW = arr[_index].self_w,
                                cirW = arr[_index].circle_w,
                                after_left = selW - cirW + 6.5;

                            _circle.css("width", cirW);
                            tl = gsap.timeline({ paused: true, ease: "power2.out" });
                            tl.to(_circle, 0.3, { width: selW + "px", x: "0" });
                            tl.to(_circle, 0.3, { width: cirW + "px", x: after_left });
                            tl.play();
                        }).on("mouseleave", () => {
                            let currentTime = tl.time();
                            tl.reverse(currentTime);
                        });
                    }, 200);

                    function arrInit() {
                        $el.each((index, item) => {
                            const _self = $(item),
                                _self_w = _self.innerWidth(),
                                _circle = _self.find("i"),
                                _circle_w = _circle.innerWidth();
                            let obj;

                            _circle.removeAttr("style");
                            obj = {
                                self_w: _self_w,
                                circle_w: _circle_w,
                            };
                            arr.push(obj);
                        });
                    }
                }
            },
        },
        fold: {
            init() {
                this.isFold();
                this.foldEvent();
            },
            isFold() {
                // 컨텐츠 길이에 따라 접기 기능 생김
                let $fold = $(".box-fold");
                let $fold_max_h = 445;

                $fold.each((index, item) => {
                    const _self = $(item),
                        _height = _self.height();

                    if (_self.closest(".box-fold-wrap").hasClass("short")) {
                        $fold_max_h = 210;
                    }
                    if (_self.closest(".box-fold-wrap").hasClass("long")) {
                        $fold_max_h = 1000;
                    }
                    $fold_max_h < _height && _self.addClass("isFold");
                });
            },
            foldEvent() {
                // 더보기 or 접기
                $(document).on("click", ".btn-fold", (e) => {
                    const _self = $(e.target).closest(".box-fold-wrap"),
                        _fold = _self.find(".box-fold"),
                        _btn = _self.find(".btn-fold");

                    if (_btn.hasClass("on")) {
                        _btn.removeClass("on");
                        _btn.find("span").text("MORE");
                    } else {
                        _btn.addClass("on");
                        _btn.find("span").text("FOLD");
                    }
                    _fold.toggleClass("active");
                });
            },
        },
        solutions: {
            init() {
                if ($(".btn-accrd-all").length) {
                    $(document).on("click", ".btn-accrd-all", (e) => {
                        const _self = $(e.target);
                        const _list = $('.accordion-list.ty02 > li'),
                            _btn = _list.find('.accordion-tit button'),
                            _txt = _list.find('.accordion-txt');

                        if (_self.hasClass("on")) {
                            _self.text("EXPAND ALL").removeClass("on");
                            _list.removeClass("on");
                            _btn.removeClass("on");
                            _txt.stop().slideUp("fast");
                        } else {
                            _self.text("COLLAPSE ALL").addClass("on");
                            _list.addClass("on");
                            _btn.addClass("on");
                            _txt.stop().slideDown("fast").css("display", "flex");
                        }
                    });
                }

                if ($(".detail-main").length) {
                    this.sideNavi();
                    $(".mo-nav-wrap").length > 0 && this.moNav();
                    $(".slider-wrap").length > 0 && this.slider();
                }
            },
            sideNavi() {
                // 상세화면 사이드 navi
                const $nav = $(".detail-nav ul"),
                    $list = $nav.find("li"),
                    $nav_btn = $nav.find("li a, li button");

                let article_heights;

                arrInit();
                $nav_btn.on("click", (e) => {
                    e.preventDefault();
                    const _index = $(e.target).closest("li").index();
                    $("html,body").stop().animate({scrollTop: article_heights[_index]}, 300);
                });

                function arrInit() {
                    article_heights = [];
                    let activeIndex = 0;
                    let timer;

                    setTimeout(() => {
                        $(".detail-contents .move-section").each((index, item) => {
                            const _self = $(item);
                            const _self_top = _self.offset().top;
                            const _headerH = $("header").height();

                            article_heights.push(_self_top - _headerH - 50);
                        });
                    }, 50);

                    $window.on("scroll", (e) => {
                        if (!timer) {
                            timer = setTimeout(() => {
                                timer = null;
                                const _self = $(e.target);
                                let scTop = _self.scrollTop();

                                if (scTop + 100 >= article_heights[0]) {
                                    for (let i = 0; i < article_heights.length; i++) {
                                        if (scTop + 100 >= article_heights[i]) {
                                            activeIndex = i;
                                        }
                                    }
                                } else {
                                    activeIndex = 0;
                                }

                                activeMenu(activeIndex);
                                scrollingLeft(activeIndex);
                            }, 300);
                        }
                    });
                }

                function scrollingLeft(index) {
                    gsap.to($nav, 0.2, {
                        scrollTo: {
                            x: index * 180
                        },
                        ease: "Sine.easeOut",
                    });
                }

                function activeMenu(index) {
                    $nav_btn.removeClass("on");
                    $list.eq(index).find("a, button").addClass("on");
                }
            },
            moNav() {
                // 상세화면 모바일 네비
                const $el = $(".mo-nav-wrap"),
                    $btn = $el.find("> button"),
                    $isdep3 = $(".isDep3"),
                    $dep2_btn = $isdep3.find("> a");

                funcInit();

                $btn.on("click", (e) => {
                    const _self = $(e.target);

                    if (_self.hasClass("on")) {
                        _self.removeClass("on");
                        _self.siblings(".mo-menu-wrap").removeClass("on");
                        $el.removeClass("scr-down");
                        uiCommon.bodyFix.off();
                    } else {
                        _self.addClass("on");
                        _self.siblings(".mo-menu-wrap").addClass("on");
                        if ($('#wrap').hasClass('scrollDown')) {
                            $el.addClass('scr-down');
                        }
                        uiCommon.bodyFix.on();
                    }
                });

                $dep2_btn.on("click", (e) => {
                    e.preventDefault();

                    const _self = $(e.target),
                        $dep3 = _self.siblings(".dep3");

                    if (_self.hasClass("on")) {
                        _self.removeClass("on");
                        $isdep3.find(".dep3").hide();
                    } else {
                        $dep2_btn.removeClass("on");
                        $isdep3.find(".dep3").stop().hide();
                        _self.addClass("on");
                        $dep3.stop().slideDown("fast");
                    }
                });

                function funcInit() {
                    let winTop = $(window).scrollTop();

                    if (uiCommon.mobileCheck.init()) {
                        winTop >= $(".page-heading-layout").offset().top ? $el.addClass('on') : $el.removeClass('on');

                        $window.on("scroll", (e) => {
                            const _self = $(e.target);
                            let scTop = _self.scrollTop();

                            scTop >= $(".page-heading-layout").offset().top ? $el.addClass('on') : $el.removeClass('on');
                        });
                    } else {
                        $btn.removeClass("on");
                        $btn.siblings(".mo-menu-wrap").removeClass("on");
                    }
                }
            },
            slider() {
                // 상세화면 슬라이더 관련 이벤트
                let timer;
                let $swip = null;

                funcInit();
                $(window).on("resize", () => {
                    if (!timer) {
                        timer = setTimeout(() => {
                            timer = null;
                            funcInit();
                        }, 200);
                    }
                });

                function funcInit() {
                    if ($(".board-card-list.ty02").length) {
                        if (uiCommon.mobileCheck.init()) {
                            $swip = uiCommon.swiper.init(".board-card-list.ty02", {
                                slidesPerView: "auto",
                                spaceBetween: 24,
                                scrollbar: {
                                    el: ".board-card-list.ty02 .swiper-scrollbar",
                                    hide: false,
                                    draggable: true,
                                },
                            });
                        } else {
                            $swip && $swip.destroy();
                        }
                    }

                    // 주요 구성원
                    uiCommon.swiper.init(".slider-lawyer", {
                        slidesPerView: "5",
                        spaceBetween: 24,
                        scrollbar: {
                            el: ".slider-lawyer .swiper-scrollbar",
                            hide: false,
                            draggable: true,
                        },
                        observer: true,
                        observeParents: true,
                        breakpoints: {
                            415: {
                                slidesPerView: "2",
                                spaceBetween: 6,
                            },
                            769: {
                                slidesPerView: "auto",
                                spaceBetween: 6,
                            },
                        },
                    });
                }
            },
        },
        insights: {
            init() {
                $(".detail-insights").length > 0 && this.slider();
            },
            slider() {
                uiCommon.swiper.init(".slider-lawyer", {
                    slidesPerView: "5",
                    spaceBetween: 24,
                    scrollbar: {
                        el: ".slider-lawyer .swiper-scrollbar",
                        hide: false,
                        draggable: true,
                    },
                    breakpoints: {
                        415: {
                            slidesPerView: "2",
                            spaceBetween: 6,
                        },
                        769: {
                            slidesPerView: "auto",
                            spaceBetween: 6,
                        },
                    },
                });
            },
        },
        firm: {
            init() {
                $(".intro-wrap").length > 0 && this.intro();
                $(".history-wrap").length > 0 && this.history();
            },
            intro() {
                $window.on('scroll', ()=>{
                    $(".box-visual .bg").css("background-position", "50% -" + $(window).scrollTop() / 4.8 + "px");
                });

                ScrollTrigger.create({
                    trigger: ".box-intro-txt",
                    start: "top 40%",
                    onEnter: () => {
                        $(".box-intro-txt .circle-ani").addClass("active");
                    },
                });
            },
            history() {
                const $nav = $(".box-layout nav ul"),
                    $list = $nav.find("li"),
                    $nav_btn = $nav.find("li a, li button");

                let article_heights;

                arrInit();
                $nav_btn.on("click", (e) => {
                    e.preventDefault();
                    const _index = $(e.target).closest("li").index();
                    $("html,body").stop().animate({scrollTop: article_heights[_index]}, 300);
                });

                function arrInit() {
                    article_heights = [];
                    let activeIndex = 0;
                    let timer;

                    setTimeout(() => {
                        $(".history-wrap article").each((index, item) => {
                            const _self = $(item);
                            const _self_top = _self.offset().top;
                            const _headerH = $("header").height();

                            article_heights.push(_self_top - _headerH);
                        });
                    }, 50);

                    $window.on("scroll", (e) => {
                        if (!timer) {
                            timer = setTimeout(() => {
                                timer = null;
                                const _self = $(e.target);
                                let scTop = _self.scrollTop();

                                if (scTop + 100 >= article_heights[0]) {
                                    for (let i = 0; i < article_heights.length; i++) {
                                        if (scTop + 100 >= article_heights[i]) {
                                            activeIndex = i;
                                        }
                                    }
                                } else {
                                    activeIndex = 0;
                                }

                                activeMenu(activeIndex);
                                scrollingLeft(activeIndex);
                            }, 300);
                        }
                    });
                }

                function scrollingLeft(index) {
                    gsap.to($nav, 0.2, {
                        scrollTo: {
                            x: index * 90
                        },
                        ease: "Sine.easeOut",
                    });
                }

                function activeMenu(index) {
                    $nav_btn.removeClass("on");
                    $list.eq(index).find("a, button").addClass("on");
                }

                // 섹션별 도형 애니메이션
                ScrollTrigger.create({
                    trigger: ".ch1",
                    start: "top 75%",
                    onEnter: () => {
                        $('.ch1 .ani-figure').addClass('active');
                    },
                });

                ScrollTrigger.create({
                    trigger: ".ch2",
                    start: "top 75%",
                    onEnter: () => {
                        $('.ch2 .ani-figure').addClass('active');
                    },
                });

                ScrollTrigger.create({
                    trigger: ".ch3",
                    start: "top 75%",
                    onEnter: () => {
                        $(".history-wrap .circle").addClass("active");
                        $('.ch3 .ani-figure').addClass('active');
                    },
                });

                ScrollTrigger.create({
                    trigger: ".ch4",
                    start: "top 75%",
                    onEnter: () => {
                        $('.ch4 .ani-figure').addClass('active');
                    },
                });
            },
        },
        careers: {
            init() {
                $(".intro-wrap").length > 0 && this.intro();
                $(".foreign-wrap").length > 0 && this.nav();
            },
            intro() {
                const winW = $window.width();

                $window.on('scroll', ()=>{
                    $(".bg").css("background-position", "50% -" + $(window).scrollTop() / 5 + "px");
                });

                gsap.to(".after-text", {
                    x: -winW * 1,
                    duration: 1,
                    ease: "power1",
                    scrollTrigger: {
                        trigger: ".after-text",
                        scrub: true,
                        start: "top 100%",
                    },
                });
            },
            nav() {
                const $nav = $(".box-layout nav ul"),
                    $list = $nav.find("li"),
                    $nav_btn = $nav.find("li a, li button");

                let article_heights;

                arrInit();
                $nav_btn.on("click", (e) => {
                    e.preventDefault();
                    const _index = $(e.target).closest("li").index();
                    $("html,body").stop().animate({scrollTop: article_heights[_index]}, 300);
                });

                function arrInit() {
                    article_heights = [];
                    let activeIndex = 0;
                    let timer;

                    setTimeout(() => {
                        $(".foreign-wrap article").each((index, item) => {
                            const _self = $(item);
                            const _self_top = _self.offset().top;
                            const _headerH = $("header").height();

                            article_heights.push(_self_top - _headerH);
                        });
                    }, 50);

                    $window.on("scroll", (e) => {
                        if (!timer) {
                            timer = setTimeout(() => {
                                timer = null;
                                const _self = $(e.target);
                                let scTop = _self.scrollTop();

                                if (scTop + 100 >= article_heights[0]) {
                                    for (let i = 0; i < article_heights.length; i++) {
                                        if (scTop + 100 >= article_heights[i]) {
                                            activeIndex = i;
                                        }
                                    }
                                } else {
                                    activeIndex = 0;
                                }

                                activeMenu(activeIndex);
                                scrollingLeft(activeIndex);
                            }, 300);
                        }
                    });
                }

                function scrollingLeft(index) {
                    gsap.to($nav, 0.2, {
                        scrollTo: {
                            x: index * 75
                        },
                        ease: "Sine.easeOut",
                    });
                }

                function activeMenu(index) {
                    $nav_btn.removeClass("on");
                    $list.eq(index).find("a, button").addClass("on");
                }
            },
        },
        probono: {
            init() {
                $(".intro-wrap").length > 0 && this.intro();
            },
            intro() {
                $window.on('scroll', ()=>{
                    $(".box-visual .bg").css("background-position", "50% -" + $(window).scrollTop() / 4.8 + "px");
                });

                ScrollTrigger.create({
                    trigger: ".box-intro-txt",
                    start: "top 40%",
                    onEnter: () => {
                        $(".box-intro-txt .circle-ani").addClass("active");
                    },
                });
            },
        },
        professonals: {
            init() {
                $(".detail-professonals").length > 0 && this.slider();
            },
            slider() {
                // 상세화면 슬라이더 관련 이벤트
                let timer;
                let $swip = null;

                funcInit();
                $(window).on("resize", () => {
                    if (!timer) {
                        timer = setTimeout(() => {
                            timer = null;
                            funcInit();
                        }, 200);
                    }
                });

                function funcInit() {
                    $swip = uiCommon.swiper.init(".board-card-list.ty02", {
                        slidesPerView: "auto",
                        spaceBetween: 24,
                        scrollbar: {
                            el: ".board-card-list.ty02 .swiper-scrollbar",
                            hide: false,
                            draggable: true,
                        },
                        breakpoints: {
                            768: {
                                slidesPerView: "auto",
                                spaceBetween: 24,
                            },
                            967: {
                                slidesPerView: "1",
                                spaceBetween: 24,
                            },
                        },
                    });

                }
            },
        }
    };

    uiCommon.init();
    return uiCommon;
})(window.uiCommon || {}, $(window));
