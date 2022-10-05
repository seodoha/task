(function () {
    let codeview = new Array();
    codeview.push({ url: "../../../assets/ko/js/libraries/jquery-1.11.1.min.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/slick.min.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/swiper.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/aos.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/gsap.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/ScrollTrigger.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/ScrollToPlugin.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/plugins/jquery.scrollbar.min.js", cashbuster: false });
    codeview.push({ url: "../../../assets/ko/js/ui.common.js", cashbuster: true });

    for (let a = 0, atotal = codeview.length; a < atotal; a++) {
        document.write(
            '<script src="' + codeview[a].url + (codeview[a].cashbuster ? "?cb=" + new Date().getTime() : "") + '" charset="utf-8"></' + "script>"
        );
    }
})();
