(function () {
    let codeview = new Array();
    codeview.push({ url: "../../../assets/en/js/libraries/jquery-1.11.1.min.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/slick.min.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/swiper.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/aos.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/gsap.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/ScrollTrigger.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/ScrollToPlugin.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/plugins/jquery.scrollbar.min.js", cashbuster: false });
    codeview.push({ url: "../../../assets/en/js/ui.common.js", cashbuster: true });

    for (let a = 0, atotal = codeview.length; a < atotal; a++) {
        document.write(
            '<script src="' + codeview[a].url + (codeview[a].cashbuster ? "?cb=" + new Date().getTime() : "") + '" charset="utf-8"></' + "script>"
        );
    }
})();
