let moDevice = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream;

;const app = (function(app, $jq, $window){

    app.init = function () {
        $jq('[data-module="customSelect"]').length && app.customSelect.init();
    };
    
    app.customSelect = {
        wheelCount: 0,
        scrollWheel: 0,
        itemH: 41,
        init: function () {
            this.madeSelect();
            this.clickEvent();
            moDevice ? this.touchScroll() : this.selectScroll();
            $window.on('resize', function(){
                moDevice = /iPad|iPhone|iPod|Android/.test(navigator.userAgent) && !window.MSStream;
                $jq('.select-item').off();
                moDevice ? app.customSelect.touchScroll() : app.customSelect.selectScroll();
            });
        },
        madeSelect: function() {
            let $el = $jq('[data-module="customSelect"]');

            $el.each(function(index, elItem) {
                let $customSelect = '<div class="customSelectWrap">',
                    $lab = '<button class="label">',
                    $opt = '<div class="select-item"><ul>';

                if ( $jq(elItem).find('option').length > 0 ) {
                    $jq(elItem).find('option').each(function(index, item) {
                        let itemTxt = $jq(item).text();

                        if ( $jq(item).prop('selected') ) {
                            $lab += (itemTxt + '</button>');
                            $opt += '<li data-index="' + index + '" class="select">' + itemTxt + '</li>';
                        } else {
                            $opt += '<li data-index="' + index + '">' + itemTxt + '</li>';
                        }

                    });
                    $opt += '</ul></div>';
                }
                
                $customSelect = $customSelect + $lab + $opt + '</div>';
                $jq(elItem).addClass('hide-select').after($customSelect);
            });
        },
        clickEvent: function() {
            $jq('.customSelectWrap button').on('click', function(){
                let $custom = $jq(this).parent(),
                    $list = $jq(this).siblings('.select-item').find('ul'),
                    $track = $list.siblings('.scrollBar').find('.track'),
                    listLength = $jq(this).siblings('.select-item').find('ul > li').length,
                    scrollCount = $custom.prev().attr('data-scroll'),
                    selectIndex = $list.find('li.select').index(),
                    listHeight = app.customSelect.itemH * scrollCount,
                    scrollH = app.customSelect.itemH * scrollCount,
                    maxCount = Number('-' + ($list.find('li').length - scrollCount));
                    
                $jq('.select-item').stop().slideUp('fast');
                $list.parent().css({'height' : listHeight});
                
                $jq(this).parent().toggleClass('on');
                $jq(this).siblings('.select-item').stop().slideToggle('fast');
                    
                app.customSelect.scrollWheel = parseInt(((scrollH - app.customSelect.itemH) / maxCount) / scrollH * 100);
                app.customSelect.wheelCount = selectIndex - (scrollCount - 1) > 0 ? '-' + (selectIndex - (scrollCount - 1)) : 0;
                $list.css({'top': app.customSelect.wheelCount * 41});
    
                if ( scrollCount < listLength && $custom.find('.scrollBar').length <= 0 ) {
                    if ( app.customSelect.wheelCount != maxCount ) {
                        $list.after('<span class="scrollBar"><span class="track" style="top:' + app.customSelect.scrollWheel * app.customSelect.wheelCount + '%"></span></span>');
                    } else {
                        $list.after('<span class="scrollBar"><span class="track" style="top:calc(100% - 40px)"></span></span>');
                    }
                } else {
                    if ( app.customSelect.wheelCount != maxCount ) {
                        $track.css({'top':app.customSelect.scrollWheel * app.customSelect.wheelCount + '%'});
                    } else {
                        $track.css({'top':'calc(100% - 40px)'});
                    }
                }
                // console.log(`maxCount : ${maxCount}`);
                // console.log(`버튼 클릭 후 wheelCount : ${wheelCount}`);
    
            });
    
            $jq('.select-item li').on('click', function(){
                let $parent = $jq(this).closest('.select-item'),
                    $select = $jq(this).closest('.customSelectWrap').prev(),
                    txt = $jq(this).text(),
                    scrollCount = $jq(this).closest('.customSelectWrap').prev().attr('data-scroll'),
                    index = $jq(this).index();
    
                console.log(index);

                $parent.find('li').removeClass('select');
                $jq(this).addClass('select');
                $parent.stop().slideUp('fast').siblings('.label').text(txt);
                $jq('.customSelectWrap').removeClass('on');
                $select.find('option').eq(index).prop('selected', true);
                
                app.customSelect.wheelCount = '-' + (index - (scrollCount - 1));
                $jq(this).parent().css({'top': app.customSelect.wheelCount * 40});
            });
    
            $jq('body').on('click', function(e){
                let $target = $jq(e.target).parent();
                if ( !$target.hasClass('customSelectWrap') ) {
                    $jq('.customSelectWrap').removeClass('on');
                    $jq('.select-item').stop().slideUp('fast');
                }
            });
        },
        selectScroll: function() {
            let wheel, viewCount, maxCount, $track, scrollH;

            $jq('.select-item').on('scroll mousewheel', function(e){
                $track = $jq('.scrollBar .track',this),
                wheel = e.originalEvent.wheelDelta,
                viewCount = $jq(this).parent().prev().attr('data-scroll'),
                maxCount = Number('-' + ($jq('li', this).length - viewCount)),
                scrollH = app.customSelect.itemH * viewCount,
                app.customSelect.scrollWheel = parseInt(((scrollH - app.customSelect.itemH) / maxCount) / scrollH * 100);

                if ( wheel > 0 ) {    // 위로
                    if ( app.customSelect.wheelCount < 0 ) app.customSelect.wheelCount++;
                } else {    // 아래로
                    if ( app.customSelect.wheelCount > maxCount ) app.customSelect.wheelCount--;
                }
                
                $jq('ul', this).css({'top': app.customSelect.wheelCount * 41});
                app.customSelect.wheelCount != maxCount ? $track.css({'top':app.customSelect.scrollWheel * app.customSelect.wheelCount + '%'}) : $track.css({'top':'calc(100% - 40px)'});
                console.log(`스크롤 wheelCount : ${app.customSelect.wheelCount}`);
                console.log(`maxCount : ${maxCount}`);
            });
        },
        touchScroll: function() {
            let touchStartY,
                touchEndY,
                viewCount, 
                maxCount, 
                $track, 
                scrollH;

            $jq('.select-item').on('touchstart', function(e){
                // console.log(`터치 스타트 : ${e.originalEvent.touches[0]}`);
                touchStartY = e.originalEvent.touches[0].pageY;
            });
            
            $jq('.select-item').on('touchend', function(e){
                // console.log(`터치 후 : ${e.originalEvent.changedTouches[0].pageY}`);
                
                touchEndY = e.originalEvent.changedTouches[0].pageY,
                $track = $jq('.scrollBar .track',this),
                viewCount = $jq(this).parent().prev().attr('data-scroll'),
                maxCount = Number('-' + ($jq('li', this).length - viewCount)),
                scrollH = app.customSelect.itemH * viewCount,
                app.customSelect.scrollWheel = parseInt(((scrollH - app.customSelect.itemH) / maxCount) / scrollH * 100);

                if ( touchStartY < touchEndY && app.customSelect.wheelCount < 0 ) {    // 위로
                    if ( Math.abs(touchStartY - touchEndY) > 20 ) app.customSelect.wheelCount++;
                } else {    // 아래로
                    if ( app.customSelect.wheelCount > maxCount && Math.abs(touchStartY - touchEndY) > 20 ) app.customSelect.wheelCount--;
                }

                $jq('ul', this).css({'top': app.customSelect.wheelCount * 41});
                app.customSelect.wheelCount != maxCount ? $track.css({'top':app.customSelect.scrollWheel * app.customSelect.wheelCount + '%'}) : $track.css({'top':'calc(100% - 40px)'});
                // console.log(`스크롤 wheelCount : ${app.customSelect.wheelCount}`);
                // console.log(`maxCount : ${maxCount}`);
            });
        },
    };

    return app.init();

}(window.app || {}, jQuery, $(window)));