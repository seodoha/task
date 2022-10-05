const uiMain = (function (uiMain, $window) {
    uiMain.init = () => {
        uiMain.progress.init();
        uiMain.mainVisual.init();
        uiMain.slider.init();
        uiMain.aniScroll.init();
        uiMain.banner.init();
        if (!uiCommon.mobileCheck.init()) {
            uiMain.hover.init();
        }
    };

    uiMain.hover = {
        init() {
            const $el = $(".arti01");

            $el.mousemove((e) => {
                parallax_me(e, ".arti01 .box-circle .left", 30);
                parallax_me(e, ".arti01 .box-circle .right", -30);
            });

            function parallax_me(e, target, movement) {
                let $this = $(e.currentTarget),
                    relX = e.pageX - $this.offset().left,
                    relY = e.pageY - $this.offset().top;

                gsap.to(target, 1.5, {
                    x: ((relX - $this.width() / 2) / $this.width()) * movement,
                    y: ((relY - $this.height() / 2) / $this.height()) * movement,
                    ease: "power3",
                });
            }
        },
    };

    uiMain.progress = {
        init() {
            const $el = $(".progress-bar"),
                $cur = $el.find(".current");
            let scTop,
                b,
                c = 0,
                d = 100,
                el_height;

            $window.on("scroll", () => {
                (scTop = $(window).scrollTop()), (b = $(document).height() - $(window).height());

                el_height = (scTop * (d - c)) / b + c;
                $cur.css("height", el_height + "%");
            });
        },
    };

    uiMain.mainVisual = {
        init() {
            const $el = $(".arti01 .box-circle .right"),
                $video = $el.find("video"),
                _length = $video.length - 1;

            setTimeout(() => {
                setInterval(() => {
                    const _index = $el.find(".on").index();
                    $video.removeClass("on");
                    if (_index == _length) {
                        $video.eq(0).addClass("on");
                    } else {
                        $video.eq(_index + 1).addClass("on");
                    }
                }, 5000);
            }, 5000);
        },
    };

    uiMain.slider = {
        init() {
            this.highlight();
            this.center();
            this.insights();
            this.careers();
        },
        highlight() {
            uiCommon.swiper.init(".highlight-slider", {
                slidesPerView: "2",
                spaceBetween: 144,
                scrollbar: {
                    el: ".highlight-slider .swiper-scrollbar",
                    hide: false,
                    draggable: true,
                },
                breakpoints: {
                    769: {
                        slidesPerView: "auto",
                        spaceBetween: 8,
                    },
                },
            });
        },
        center() {
            const _el = $(".center-slider"),
                _current = _el.find(".current"),
                _total = _el.find(".total"),
                _prev = _el.find(".btn-prev"),
                _next = _el.find(".btn-next"),
                _tCount = _el.find("> div").length;

            _total.text(_tCount);
            uiCommon.slick.init(_el, {
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                dots: false,
                arrows: false,
                fade: true,
            });

            _el.on({
                afterChange(slick, currentSlide, nextSlide) {
                    let index = nextSlide + 1;
                    _current.text(index);
                },
            });

            _prev.on("click", () => _el.slick("slickPrev"));
            _next.on("click", () => _el.slick("slickNext"));
        },
        insights() {
            const _el = $(".insights-slider"),
                _prev = $(".arti04 .btn-prev"),
                _next = $(".arti04 .btn-next");

            uiCommon.slick.init(_el, {
                infinite: true,
                speed: 500,
                slidesToShow: 2,
                dots: false,
                arrows: false,
                variableWidth: true,
            });

            _prev.on("click", () => _el.slick("slickPrev"));
            _next.on("click", () => _el.slick("slickNext"));
        },
        careers() {
            const _el = $(".careers-slider"),
                _current = _el.find(".current"),
                _total = _el.find(".total"),
                _prev = _el.find(".btn-prev"),
                _next = _el.find(".btn-next"),
                _tCount = _el.find("> div").length;

            _total.text(_tCount);
            uiCommon.slick.init(_el, {
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                dots: false,
                arrows: false,
                fade: true,
            });

            _el.on({
                afterChange(slick, currentSlide, nextSlide) {
                    let index = nextSlide + 1;
                    _current.text(index);
                },
            });

            _prev.on("click", () => _el.slick("slickPrev"));
            _next.on("click", () => _el.slick("slickNext"));
        },
    };

    uiMain.aniScroll = {
        init() {
            this.afterTxt();
            this.sectionBg();
        },
        sectionBg() {
            gsap.to(".arti02 .bg", {
                scale: 1,
                duration: 1,
                ease: "power1",
                scrollTrigger: {
                    trigger: ".arti01",
                    start: "top 30%",
                },
            });

            gsap.to(".arti04 .bg", {
                width: "100%",
                duration: 1,
                ease: "power1",
                scrollTrigger: {
                    trigger: ".arti04",
                    start: "top 40%",
                },
            });

            gsap.to(".arti06 .bg", {
                width: "100%",
                duration: 1,
                ease: "power1",
                scrollTrigger: {
                    trigger: ".arti06",
                    start: "top 40%",
                },
            });
        },
        afterTxt() {
            const winW = $window.width();

            gsap.to(".flow-txt", {
                x: -winW * 1,
                duration: 1,
                ease: "power1",
                scrollTrigger: {
                    trigger: ".arti01",
                    scrub: true,
                    start: "top 10%",
                },
            });
            gsap.to(".flow-txt2", {
                x: -winW * 1,
                duration: 1,
                ease: "power1",
                scrollTrigger: {
                    trigger: ".arti02",
                    scrub: true,
                    start: "top 10%",
                },
            });
            gsap.to(".flow-txt3", {
                x: -winW * 1,
                duration: 1,
                ease: "power1",
                scrollTrigger: {
                    trigger: ".arti06",
                    scrub: true,
                    start: "top 65%",
                },
            });
        },
    };

    uiMain.banner = {
        init() {
            const $inner = $(".box-banner"),
                $list = $(".list-banner"),
                $ele = document.querySelector(".box-banner");
            let count = 0;

            $inner.append($list.clone());
            $inner.append($list.clone());

            function animate() {
                count++;

                if (count > $list.innerWidth()) {
                    $ele.style.transform = `translate3d(0, 0, 0)`;
                    count = 0;
                }
                $ele.style.transform = `translate3d(${-1 * count}px, 0, 0)`;
                requestAnimationFrame(animate);
            }
            animate();
        },
    };

    uiMain.init();
    return uiMain;
})(window.uiMain || {}, $(window));
