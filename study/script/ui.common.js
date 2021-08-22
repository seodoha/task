;const ctrlUI = (function (ui, $j, $window, $body) {

    ui.init = function () {
        ui.common.init();
        ui.gnb.init();
        $j('main').length > 0 && ui.main.init();
        $j('.main').length == 0 && ui.layer.init();

    };

    ui.common = {
        init: function(){
                this._partnerSite(); //푸터 협력기관소개
                this._pageTop(); // Top 버튼
        },
        _partnerSite: function(){

            let $btn = $j('.partnerSite button'),
                $obj = $j('.partnerSite ul'),
                $items = $obj.children('li'),
                p = 32,
                l = $items.length,
                h = $items.innerHeight();

                $btn.on('click', function()  {

                    $btn.toggleClass('on');
                    $obj.hasClass('on') ? $obj.toggleClass('on').css({height: 0}) : $obj.toggleClass('on').css({height: l * h + p});
                });

        },
        _pageTop: function(){

            let $btn = $j('footer .btnTop'),
                $obj = $j('html, body');

            $btn.on('click', function() {
                $obj.animate({scrollTop: 0});
            });
        }
    };

    ui.gnb = {
        $wrap: $j('#wrap'),
        $header: $j(".headerWrap"),
        $nav: $j('nav'),
        $items:  $j('.gnbWrap > li'),
        $subItems: $j('.dep2Gnb'),
        $obj: $j('.gnbWrap > li.on > .dep2Gnb'),
        st: null,
        _isPc: true,
        _isMo: true,
        init: function(){
            this._chkMo() ? this._mo() : this._pc();
            this._resize();
            this._open();
            this._close();
            this._moScroll();
            $j('.main').length == 0 && this._color();
        },
        _pc: function(){
            if(this._isPc){
                this._isPc = false;
                this._isMo = true;


                this.$wrap.addClass('pc').removeClass('mo');
                this.$items.unbind('click');
                ui.gnb.$header.find('nav').show();
                ui.main._evt();

                this.$items.hover(function() {
                    ui.gnb.$header.addClass("on");
                    $j(this).addClass("on").siblings(ui.gnb.$items).removeClass('on');

                    ui.gnb.$obj.animate({
                        "opacity":"1"
                    },  200);

                });

                this.$header.on('mouseleave', function(){
                    ui.gnb.$header.removeClass("on");
                    ui.gnb.$items.removeClass('on');
                });

            };

        },
        _mo: function(){
            if(this._isMo){
                this._isMo = false,
                this._isPc = true;

                this.$wrap.addClass('mo').removeClass('pc');
                this.$items.unbind('mouseenter mouseleave');
                this.$header.unbind('mouseleave');
                $window.off('mousewheel');
                ui.gnb.$header.find('nav').hide();

                this.$items.on('click', function(){
                    if($j(this).hasClass('on')){
                        $j(this).removeClass('on').find(ui.gnb.$subItems).slideUp(500);
                    } else {
                        $j(this).addClass('on').find(ui.gnb.$subItems).slideDown(500).end().siblings(ui.gnb.$items).removeClass('on').find(ui.gnb.$subItems).slideUp(500);
                    };
                });
            };

        },
        _moScroll: function(){

			try {

				let $top00 = $j('main > section').eq(0).offset().top,
					$top01 = $j('main > section').eq(1).offset().top,
					$top02 = $j('main > section').eq(2).offset().top,
					$top03 = $j('main > section').eq(3).offset().top;

				$window.on('scroll', function(){
					let st = $window.scrollTop();

					if($top01 > st){
						ui.gnb.$header.removeClass('active');
					};
					if($top01 < st){
						ui.gnb.$header.addClass('active');
					};
					if($top02 < st){
						ui.gnb.$header.removeClass('active');
					};
					if($top03 < st){
						ui.gnb.$header.addClass('active');
					};
				});

			} catch (err) {


			}
        },
        _open: function(){
            let $openBtn = $body.find('.btnGnb');

                $openBtn.on('click', function(){
                    ui.gnb.$header.find('nav').fadeIn();
                    $body.css({'height': $window.innerHeight(), 'overflow':'hidden'});
                    ui.gnb.st = $window.scrollTop();
                });
        },
        _close: function(){
            let $closeBtn = $body.find('.btnGnbClose');
            $closeBtn.on('click', function(){
                ui.gnb.$header.find('nav').fadeOut();
                ui.gnb.$items.removeClass('on').find('ul').hide();
                $body.css({'height': 'auto', 'overflow':'visible'});
                $window.scrollTop(ui.gnb.st);
            });
        },
        _color: function(){
            let $obj = $j('.content'),
                $div = $j('.logo').closest('div'),
                $logo = $j('.logo'),
                $btn = $j('.btnGnb'),
                t = $obj.offset().top;

			$window.on('scroll', function(){
                if($window.scrollTop() > t){
                    ui.gnb.$header.addClass('active');
                } else {
                    ui.gnb.$header.removeClass('active');
                };
            });
        },
        _resize: function(){
            $window.on('resize', function(){
                ui.gnb._chkMo() ? ui.gnb._mo() : ui.gnb._pc();
            });
        },
        _chkMo: function(){
            return $window.innerWidth() < 769 ? true : false;
        }

    }

    ui.layer = {
        dim: '<div class="dim"></div>',
        init: function(){
            this._open();
            this._close();
        },
        _open: function(){
            let $btn = $j('.ozChart a');

            $btn.on('click', function(){
                let str = $j(this).attr('class');
                ui.layer._openDim();
                $j('.'+ str +'Layer').fadeIn(300).addClass('on');
            });
        },
        _close: function(){

            $j('body').on('click', '.layer button', function(){
                $j(this).closest('.layer').fadeOut(300).removeClass('on');
                ui.layer._hideDim();
            });
        },
        _openDim: function(){
            $body.append(this.dim);
        },
        _hideDim: function(){
            $j('.dim').remove();
        }
    };

    ui.main ={
        _oldIdx: 0,
        _curIdx: 1,
        _isAnim: true,
        $main: null,
        $obj: null,
        $objLeng: null,
        $footer: null,
        $indicator: null,
        $scrollBar: null,
        init: function(){
            this._set();
            this._evt();
            this._indicator();
            this._top();
            this._slick();
            this._mainPop();
        },
        _set: function(){
            this.$main = $j('main'),
            this.$obj = $j('> section', this.$main),
            this.$objLeng = this.$obj.length,
            this.$footer = $j('footer'),
            this.$indicator = $j('.indicator'),
            this.$scrollBar = $j('.scrollAction');
        },
        _evt: function(){
            $j(document).on('mousewheel DOMMouseScroll', function(e){
                let d = e.originalEvent.wheelDelta;
                if(!ui.gnb._isPc){
                    d < 0 ? ui.main._down() : ui.main._up();
                };

            });
        },
        _up: function(i){

            if(ui.main._isAnim){
                if(this._oldIdx !== 0){
                    this._curIdx = this._oldIdx--;
                    i >= 0 ?  this._oldIdx = i : this._oldIdx;
                    this.$indicator.find('li').eq(this._oldIdx).find('button').addClass('active').closest('li').siblings('li').find('button').removeClass('active');
                    this.$obj.eq(this._curIdx).animate({'top':'100%'}, 700);
                    this.$obj.eq(this._oldIdx).css({'top': '-100%'}).animate({'top':'0'}, 700);
                    ui.main._isAnim = false;
                    this._checkAnim();
                    this._curIdx = this._oldIdx;
                    this._oldIdx = this._curIdx++;
                };
            };
            if(ui.main.$footer.hasClass('on')){
                ui.main.$footer.removeClass('on');
                setTimeout(function(){
                    ui.main._isAnim = true;
                }, 700);
            };
        },
        _down: function(i){
            if(ui.main._isAnim){
                if(this.$objLeng > this._curIdx){
                    this._curIdx = i || this._curIdx;
                    this.$indicator.find('li').eq(this._curIdx).find('button').addClass('active').closest('li').siblings('li').find('button').removeClass('active');
                    this.$obj.eq(this._oldIdx).animate({'top':'-100%'}, 700);
                    this.$obj.eq(this._curIdx).css({'top': '100%'}).animate({'top':'0'}, 700);
                    this._oldIdx = this._curIdx;
                    this._curIdx++;
                    ui.main._isAnim = false;
                    this._checkAnim();
                } else {
                    this._isAnim = false;
                    this.$footer.addClass('on');
                };
            };
        },
        _indicator: function(){

            for(let i = 0; i < this.$objLeng; i++){
                    this.$indicator.append('<li><button class="">'+ (i + 1) +'번째 섹션으로 이동</button></li>');
                };

            $j('li', this.$indicator).eq(0).find('button').addClass('active');

            let $items = $j('li button', this.$indicator);

            $items.on('click', function(){

                let $this = $j(this),
                    i = $this.parent('li').index();

                $this.addClass('active').closest('li').siblings('li').find('button').removeClass('active');
                ui.main.$footer.removeClass('on');
                ui.main._isAnim = true;
                if (i < ui.main._oldIdx){
                    ui.main._up(i);
                } else if(i > ui.main._oldIdx){
                    ui.main._down(i);
                } else {
                    return false;
                };
            });
        },
        _color: function(n){
            if( n%2 > 0){
                this.$indicator.addClass('bk');
                this.$scrollBar.addClass('bk');
                ui.gnb.$header.addClass('active');
            } else {
                this.$indicator.removeClass('bk');
                this.$scrollBar.removeClass('bk');
                ui.gnb.$header.removeClass('active');
            }
        },
        _top: function(){
            let $top = $j('.btnTop');

            $top.on('click', function(){
                ui.main.$footer.removeClass('on');
                ui.main._isAnim = true;
                ui.main._up(0);
            });
        },
        _checkAnim: function(){
            this._color(this._oldIdx);
            setTimeout(function(){
                ui.main._isAnim = true;
            }, 700);
        },
        _slick: function(){
            $j('.memberSlider').slick({
                vertical: true,
                slidesToShow: 3,
                slidesToScroll: 1,
                slidesPerRow: 3,
                autoplay: true,
                autoplaySpeed: 1500,
                arrows: false
            });

            $j('.videoSlick ul').slick({
                autoplay: true,
                autoplaySpeed: 6100,
                dots: true,
                pauseOnHover: false,
                arrows: false
            })

            $j('.listWrap').slick({
                dots: true,
                arrows: false
            });

            $j('.mainPopup .slickWrap').slick({
                dots: true,
                arrows: true
            });

            $j('.listWrap .slick-dots li').eq(0).find('button').text('공지사항');
            $j('.listWrap .slick-dots li').eq(1).find('button').text('회원사 소식');
            $j('.listWrap .slick-dots li').eq(2).find('button').text('보도자료');


            $j('.listWrap').on('afterChange', function(){

                var idx = $j('.listWrap .slick-dots li').index($j('.listWrap .slick-dots li.slick-active'));
                if(idx == 0){
                    $j('.listWrap .slick-list').height($j('.eventList').innerHeight());
                } else {
                    $j('.listWrap .slick-list').height($j('.noticeList').innerHeight());
                };

            });
        },
        _mainPop: function(){
            let $close = $j('.mainPopup .close');

            $close.on('click', function(){
                $j(this).closest('.mainPopup').fadeOut(300);
            });
        }
    }

    ui.init();
    return ui;

}(window.ctrlUI || {}, jQuery, $(window), $('body')));
