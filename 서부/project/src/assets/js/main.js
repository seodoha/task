;const uiMain = (function(uiMain, $window){

    let slide_arr = [];

    uiMain.init = () => {
        let self = uiMain;
        self.bgSlide.init();  // 이미지 슬라이드 
        self.fullPage.init(); // 메인 풀페이지
    };

    uiMain.fullPage = {
        init() {
            const $el = $('#fullPage'),
                  $btnNext = $('.btn-sec-next'),
                  $btnTop = $('.btn-top-move'),
                  $prbar = $('.progressbar'),
                  sec_length = $('.section').length,
                  $sec03 = $('.sec3'),
                  video = $('.sec1 video')[0];

            // console.log(slide_arr);
            $prbar.css({'width' : (100 / sec_length) + '%'});
            slide_arr.map((obj) => obj.autoplay.stop());

            $el.fullpage({
                touchSensitivity: 20,
                onLeave: function(origin, nextIndex, direction){
                    $prbar.css({
                        'width' : (100 / sec_length) * nextIndex + '%'
                    });
                    slide_arr.map((obj) => obj.autoplay.stop());
                    switch ( nextIndex ) {
                        case 1:
                            video.currentTime = 0;
                            break;
                        case 3:
                            if ( !$sec03.hasClass('countActive') ) {
                                $sec03.addClass('countActive');
                                setTimeout(() => new countUp.CountUp('year', 20).start(), 400);
                            }
                            break;
                        case 4:
                            slide_arr[0].autoplay.start();
                            break;
                        case 5:
                            slide_arr[1].autoplay.start();
                            break;
                        case 6:
                            slide_arr[2].autoplay.start();
                            break;
                        default:
                            break;
                    }
                },
            });
            $btnNext.on('click', () => $.fn.fullpage.moveSectionDown());
            $btnTop.on('click', () => $.fn.fullpage.moveTo(1));
        },
    };

    uiMain.bgSlide = {
        init() {
            const opt = {
                    effect: "fade",
                    autoplay: {
                        delay: 7000,
                        disableOnInteraction: false,
                    },
                    loop: true,
                  };

            slide_arr.push(uiCommon.swiper.init('.bg-sec.ver1', opt));
            slide_arr.push(uiCommon.swiper.init('.bg-sec.ver2', opt));
            slide_arr.push(uiCommon.swiper.init('.bg-sec.ver3', opt));
        },
    };

    uiMain.init();
    return uiMain;
}(window.uiMain || {}, $(window)));