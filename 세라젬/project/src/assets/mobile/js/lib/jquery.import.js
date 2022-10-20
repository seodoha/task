(function () {
    let codeview = new Array();
    codeview.push({ 'url': '../../../assets/mobile/js/lib/jquery-1.11.1.min.js', 'cashbuster': false });
    codeview.push({ 'url': '../../../assets/mobile/js/lib/ripples.js', 'cashbuster': false });
    codeview.push({ 'url': '../../../assets/mobile/js/lib/slick.min.js', 'cashbuster': false });
    codeview.push({ 'url': '../../../assets/mobile/js/lib/lottie.min.js', 'cashbuster': false });
    codeview.push({ 'url': '../../../assets/mobile/js/lib/video.min.js', 'cashbuster': false });
    codeview.push({ 'url': '../../../assets/mobile/js/ui.common.js', 'cashbuster': true });

    for (let a = 0, atotal = codeview.length; a < atotal; a++) {
        document.write('<script src="' + codeview[a].url + ((codeview[a].cashbuster) ? '?cb=' + new Date().getTime() : '') + '" charset="utf-8"></' + 'script>');
    };
})();
