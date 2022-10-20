"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;

var uiCommon = function (uiCommon, $window) {
  uiCommon.init = function () {
    uiCommon.eventBind.init(); // 이벤트 바인딩

    uiCommon.screenSize.init(); // 스크린 사이즈 세팅
    // component

    $('[data-pop]').length > 0 && uiCommon.layer.init(); // layer popup

    $('[data-toast-pop]').length > 0 && uiCommon.toast.init(); // toast popup
  }; // 로딩 호출


  uiCommon.loading = {
    open: function open() {
      $('.loading-wrap').addClass('show'); // uiCommon.bodyFix.on();

      $('#loading-bar svg').length === 0 && uiCommon.lottie.init('loading-bar', '10_infinite_scroll');
    },
    close: function close() {
      $('.loading-wrap').removeClass('show'); // uiCommon.bodyFix.off();
    }
  };
  uiCommon.screenSize = {
    init: function init() {
      var _this = this;

      this.set();
      $window.on('resize', function () {
        return _this.set();
      });
    },
    set: function set() {
      //먼저 뷰포트 높이를 얻고 1%를 곱하여 vh 단위 값을 얻습니다.
      var vh = window.innerHeight * 0.01; //그런 다음 --vh 사용자 정의 속성의 값을 문서의 루트로 설정합니다.

      document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
    }
  }; // Body Scroll Fix

  uiCommon.bodyFix = {
    on: function on() {
      var $wrap = $('#wrap');
      var wScroll = $window.scrollTop();
      $('body').addClass('scrOff').css({
        'top': -wScroll
      });
    },
    off: function off() {
      var wScroll = Math.abs(parseInt($('body').css('top')));
      $('body').removeClass('scrOff').removeAttr('style');
      $window.scrollTop(wScroll);
    }
  }; // slick 생성 객체

  uiCommon.slick = {
    init: function init(el, opt) {
      return el.not('.slick-initialized').slick(opt);
    },
    destory: function destory(el) {
      el.filter('.slick-initialized').slick('unslick');
    },
    editorSlider: function editorSlider(el) {
      var _length = el.find('> div').length,
          $countEl = el.find('.slider-count'); // 팝업 슬라이더

      setTimeout(function () {
        $countEl.find('.total').text(_length);
        el.on({
          init: function init(event, slick) {
            $countEl.find('.total').text(_length);
          },
          beforeChange: function beforeChange(event, _ref, currentSlide, nextSlide) {
            var count = _ref.slideCount;
            $countEl.find('.current').text(nextSlide + 1);
          }
        });
        uiCommon.slick.init(el, {
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          dots: false,
          arrows: false,
          variableWidth: true
        });
      }, 100);
    }
  }; // lottie 생성 객체

  uiCommon.lottie = {
    init: function init($el, file) {
      lottie.loadAnimation({
        container: document.getElementById($el),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '../../../assets/mobile/images/lottie/' + file + '.json'
      });
    }
  }; // Layer Popup

  uiCommon.layer = {
    init: function init() {
      var _this2 = this;

      $('[data-pop]').on('click', function (e) {
        e.preventDefault();

        _this2.open(e);
      });
      $('body').on('click', '.popup-close', function (e) {
        return _this2.close(e);
      });
      document.addEventListener("click", function (e) {
        var _self = $(e.target);

        if (_self.hasClass('layer-popup-wrap')) {
          _self.attr({
            tabindex: "",
            "aria-hidden": "true"
          }).stop().fadeOut().removeClass('show');
        }
      });
    },
    open: function open($target) {
      var _id;

      if (_typeof($target) == 'object') {
        _id = '#' + $($target.currentTarget).attr('data-pop');
      } else {
        _id = '#' + $target;
      }

      this.obj = $($target.currentTarget);
      uiCommon.bodyFix.on();

      if (!$(_id).find('.layer-popup').hasClass('alert-popup') && !$(_id).find('.layer-popup').hasClass('slide-popup') && !$(_id).find('.layer-popup').hasClass('img-popup') && !$(_id).find('.layout-comment-wrap').length) {
        this.scroll($(_id));
      }

      if ($(_id).find('.layer-popup').hasClass('slide-popup')) {
        this.slider($(_id));
      }

      $(_id).attr({
        tabindex: 0,
        "aria-hidden": "false"
      }).stop().fadeIn().css('display', 'flex').addClass('show').focus();
    },
    close: function close($target) {
      if (_typeof($target) == 'object') {
        $($target.currentTarget).closest('.layer-popup-wrap').attr({
          tabindex: "",
          "aria-hidden": "true"
        }).stop().fadeOut().removeClass('show');
      } else {
        $('#' + $target).attr({
          tabindex: "",
          "aria-hidden": "true"
        }).stop().fadeOut().removeClass('show');
      }

      uiCommon.bodyFix.off();
      this.obj.focus();
    },
    scroll: function scroll($target) {
      var $popWrap = $target.find('.layer-popup'),
          $popBody = $target.find('.popup-body');

      $.fn.hasScrollBar = function () {
        return this.get(0).scrollHeight > this.innerHeight();
      };

      setTimeout(function () {
        if ($popBody.hasScrollBar()) {
          $popWrap.addClass('isScroll');
          $popBody.on('wheel scroll', function () {
            $(this).scrollTop() > 0 ? $popWrap.addClass('down') : $popWrap.removeClass('down');
          });
        }
      }, 100);
    },
    slider: function slider($target) {
      var $el = $target.find('.popup-slider'),
          _length = $el.find('> div').length; // 팝업 슬라이더

      setTimeout(function () {
        if ($el) {
          $el.on({
            init: function init(event, slick) {
              $('.slider-count .total').text(_length);
            },
            beforeChange: function beforeChange(event, _ref2, currentSlide, nextSlide) {
              var count = _ref2.slideCount;
              $('.slider-count .current').text(nextSlide + 1);
            }
          });
          uiCommon.slick.init($el, {
            infinite: true,
            speed: 500,
            slidesToShow: 1,
            dots: false,
            arrows: false
          });
        }
      }, 100);
    }
  }; // Toast Popup

  uiCommon.toast = {
    init: function init() {
      var _this3 = this;

      $('[data-toast-pop]').on('click', function (e) {
        return _this3.open(e);
      });
      var $btn = $('.btn-toast');
      $btn.on('click', function () {
        if (!$(this).siblings('.pop-toast').hasClass('show')) {
          $(this).siblings('.pop-toast').addClass('show');
          setTimeout(function () {
            $('.pop-toast').removeClass('show');
          }, 2000);
        }
      });
    },
    open: function open($target) {
      var _id;

      if (_typeof($target) == 'object') {
        _id = '#' + $($target.currentTarget).attr('data-toast-pop');
      } else {
        _id = '#' + $target;
      }

      if (!$(_id).hasClass('show')) {
        $(_id).addClass('show');
        setTimeout(function () {
          $(_id).removeClass('show');
        }, 2000);
      }
    }
  };
  uiCommon.eventBind = {
    init: function init() {
      // 공통 이벤트
      $('header').length > 0 && this.header.init(); // 헤더 관련 이벤트

      $('.sub-page-header').length > 0 && this.subHeader.init(); // 서브페이지 헤더 관련 이벤트

      $('.tab-wrap').length > 0 && this.tab.init(); // 탭 관련 이벤트

      $('.box-tooltip').length > 0 && this.tooltip.init(); // 툴팁 이벤트

      $('.accordion-head button').length > 0 && this.accordion.init(); // 아코디언 이벤트

      $('.rolling-list').length > 0 && this.rolling.init(); // 롤링 이벤트

      $('.text-input-wrap').length > 0 && this.textField.init(); // 텍스트 필드 이벤트

      $('.fold-btn-wrap').length > 0 && this.fold.init(); // 접기 이벤트
      // $('.chips-editable').length > 0 && this.hashTag.init(); // 해시태그 삽입

      $('.box-search-word').length > 0 && this.popularSearchWord.init(); // 인기 검색어 이벤트

      $('.slider-wrap').length > 0 && this.slider.init(); // 슬라이드

      $('.layout-comment-wrap').length > 0 && this.comment.init(); // 댓글 관련 이벤트

      this.writeEvent.init(); // 작성 페이지 관련 이벤트
      // 각 플러그인 객체 생성 호출

      this.lottie.init(); // 로티 생성호출 이벤트

      this.floatingBtn.init(); // 플로팅 버튼
      // 메뉴별 이벤트

      $('#main').length > 0 && this.main.init(); // 메인 페이지 관련 이벤트

      $('.story-detail').length > 0 && this.storyDetail.init(); // 스토리 상세 페이지 관련 이벤트
    },
    comment: {
      init: function init() {
        var $el = $('.main-comment');
        var $list = $('.list-comment > li'); // $list.each((index, item) => {
        //     if ( $(item).find('.sub-comment').length ) {
        //         $(item).addClass('boder-none');
        //     }
        // });

        $el.each(function (index, item) {
          var _self = $(item),
              _isBest = _self.closest('.best-comment').length;

          if (!_isBest) {
            _self.find('.btn-comment-more').addClass('on').text('답글 접기');

            _self.siblings('.sub-comment').show();
          }
        });
        setTimeout(function () {
          var $btn = $('.main-comment .btn-comment-more');
          $btn.on('click', function () {
            var _sub = $(this).closest('li').find('.sub-comment');

            if ($(this).hasClass('on')) {
              $(this).removeClass('on').text('답글 보기');

              _sub.stop().slideUp('fast');
            } else {
              $(this).addClass('on').text('답글 접기');

              _sub.stop().slideDown('fast');
            }
          });
        }, 50);
      }
    },
    header: {
      init: function init() {
        this.gnb(); // gnb

        $('.event-main').length > 0 && this.scroll();
      },
      gnb: function gnb() {
        var $hamburger = $('.btn-hamburger'),
            $menu = $('.gnb-wrap'),
            $dep1 = $('.dep1.isDep2'); // gnb menu open

        $hamburger.on('click', function () {
          $menu.fadeIn().addClass('open'); // uiCommon.bodyFix.on();
        }); // gnb menu close

        $menu.on('click', function (event) {
          var $className = event.target.className;

          if ($className === 'gnb-wrap open') {
            $menu.hide().removeClass('open'); // uiCommon.bodyFix.off();
          }
        }); // dep2 slide

        $dep1.on('click', function () {
          $(this).toggleClass('open');
          $(this).siblings('.dep2-list').slideToggle('fast');
        });
      },
      scroll: function scroll() {
        $window.on('scroll', function () {
          $(window).scrollTop() > 0 ? $('header').addClass('scrolling') : $('header').removeClass('scrolling');
        });
      }
    },
    subHeader: {
      init: function init() {
        $('.shadow-bg').length > 0 && this.detailScroll();
      },
      detailScroll: function detailScroll() {
        $window.on('scroll', function () {
          $(window).scrollTop() > 0 ? $('.sub-page-header').addClass('white-bg') : $('.sub-page-header').removeClass('white-bg');
        });
      }
    },
    tab: {
      init: function init() {
        $('.tab-wrap').hasClass('tab-ctrl') && this.tabEvent(); // 탭 조작 이벤트

        $('.tab-wrap .ico-1depth-close').length > 0 && this.tabDropDown(); // dropdown 이벤트
      },
      tabEvent: function tabEvent() {
        $(".tab-wrap").each(function (index, item) {
          $(item).find(".tab-list > li").eq(0).find("a, button").attr({
            title: "현재 탭",
            "aria-selected": "true",
            role: "tab"
          }).addClass('on');
          $(item).find(".tab-content").find("> div").eq(0).attr("aria-hidden", "false").siblings("div").attr("aria-hidden", "true");
        });
        $(".tab-ctrl .tab-list > li > *").on("focusin click", function () {
          var i = $(this).closest("li").index();
          $(this).addClass("on").attr({
            title: "현재 탭",
            "aria-selected": "true"
          }).closest("li").siblings("li").find("a").removeClass("on").attr({
            title: "",
            "aria-selected": "false"
          });
          $(this).closest(".tab-list").siblings(".tab-content").children("div").attr("aria-hidden", "false").eq(i).show().siblings("div").hide().attr("aria-hidden", "true");
        });
      },
      tabDropDown: function tabDropDown() {
        var $list = $('.tab-list'),
            $btn = $('.ico-1depth-close'); // click event

        $btn.on('click', function () {
          $(this).closest('.btn-tab-wrap').siblings('.tab-list').toggleClass('active');
        }); // tab more btn show? hide?

        $list.each(function (index, item) {
          var tabW = $(item).width(),
              arrTab = $(item).find('> li');

          var sumW = 0,
              _index; // wheel event


          $(item).on('wheel', function (event) {
            event.preventDefault();
            var scrollY = $(this).scrollLeft();
            $(this).scrollLeft(scrollY += event.originalEvent.deltaY);
          });
          arrTab.each(function (index, listItem) {
            var itemW = $(listItem).width();

            if ($(listItem).find('.on').parent().index() != -1) {
              _index = $(listItem).find('.on').parent().index() - 1;
            }

            sumW += itemW;
          });

          if (tabW <= sumW) {
            $(item).siblings('.btn-tab-wrap').show();
            $(item).addClass('isScroll');

            if (_index > 6) {
              // $(item).animate({ scrollLeft: _index * 90 }, 400);
              setTimeout(function () {
                $(item).scrollLeft(_index * 90);
              }, 160);
            }
          }
        });
      }
    },
    floatingBtn: {
      init: function init() {
        var $write = $(".btn-write-bottom");

        if ($('#container').hasClass('isWriteBtn')) {
          $write.show().css('display', 'flex');
          setTimeout(function () {
            $write.addClass('on');
          }, 1000);
        }
      }
    },
    tooltip: {
      init: function init() {
        this.open();
        this.close();
      },
      open: function open() {
        var $btn = $('.btn-tooltip');
        $btn.on('click', function () {
          $(this).siblings('.active-toolBox').toggleClass('active');
        });
      },
      close: function close() {
        document.querySelector('body').addEventListener('click', function (_ref3) {
          var target = _ref3.target;
          !target.closest('.box-tooltip') && $('.active-toolBox').removeClass('active');
        });
      }
    },
    toast: {
      init: function init() {
        var $btn = $('.btn-toast');
        $btn.on('click', function () {
          if (!$(this).siblings('.pop-toast').hasClass('show')) {
            $(this).siblings('.pop-toast').addClass('show');
            setTimeout(function () {
              $('.pop-toast').removeClass('show');
            }, 2000);
          }
        });
      }
    },
    lottie: {
      init: function init() {
        // 검색결과가 없습니다./관심작가가 없습니다.
        $('#not-search').length > 0 && uiCommon.lottie.init('not-search', '01_coffee_cup'); //웰카페

        $('#not-pin').length > 0 && uiCommon.lottie.init('not-pin', '02_wellcafe_pin'); //페이지를 찾을 수 없습니다.

        $('#not-page').length > 0 && uiCommon.lottie.init('not-page', '03_error_page'); //일시적으로 서비스가 원활하지 않습니다.

        $('#not-service').length > 0 && uiCommon.lottie.init('not-service', '04_error_service'); //이벤트-챌린지

        $('#not-challenge').length > 0 && uiCommon.lottie.init('not-challenge', '06_challenge');
        $('#not-challenge02').length > 0 && uiCommon.lottie.init('not-challenge02', '06_challenge');
        $('#not-challenge03').length > 0 && uiCommon.lottie.init('not-challenge03', '06_challenge');
        $('#not-challenge04').length > 0 && uiCommon.lottie.init('not-challenge04', '06_challenge');
        $('#not-challenge05').length > 0 && uiCommon.lottie.init('not-challenge05', '06_challenge'); // 등록된 게시물이 없습니다.

        $('#not-board').length > 0 && uiCommon.lottie.init('not-board', '08_community_empty'); // 완료 체크 로티

        $('#icon-lottie06').length > 0 && uiCommon.lottie.init('icon-lottie06', '07_complete'); //쿠폰

        $('#not-coupon').length > 0 && uiCommon.lottie.init('not-coupon', '09_coupon'); // 휴면회원

        $('#dormant-member').length > 0 && uiCommon.lottie.init('dormant-member', '05_login_dormant'); // 세라체크

        $('#not-ceracheck').length > 0 && uiCommon.lottie.init('not-ceracheck', '11_ceracheck');
      }
    },
    accordion: {
      init: function init() {
        var $btn = $('.accordion-head button'),
            $head = $('.accordion-head h3, .rolling-wrap'),
            // 모바일 검색어 영역
        $body = $('.accordion-body');
        $btn.on('click', function () {
          if (!$(this).hasClass('open')) {
            $btn.removeClass('open');
            $head.addClass('fold');
            $body.stop().slideUp(200);
            $(this).addClass('open');
            $(this).closest('.accordion-wrap').find('.accordion-body').stop().slideDown('fast');
          } else {
            $btn.removeClass('open');
            $head.removeClass('fold');
            $body.stop().slideUp(100);
          }
        });
      }
    },
    rolling: {
      init: function init() {
        var $list = $('.rolling-list');
        uiCommon.slick.init($list, {
          infinite: true,
          speed: 500,
          slidesToShow: 1,
          dots: false,
          arrows: false,
          autoplay: true,
          autoplaySpeed: 3000,
          vertical: true
        });
      }
    },
    writeEvent: {
      init: function init() {
        $('.box-guide').length > 0 && this.guideBox();
        $('.layout-write-wrap').length > 0 && this.selectConv();
      },
      guideBox: function guideBox() {
        var $el = $('.box-guide');
        setTimeout(function () {
          return $el.addClass('hide');
        }, 3000);
      },
      selectConv: function selectConv() {
        var $select = $('.box-board-head select');

        if ($select.find('option:selected').index() != 0) {
          $select.closest('.box-select-wrap').addClass('on');
        }

        $select.on('change', function () {
          if ($(this).find('option:selected').index() != 0) {
            $(this).closest('.box-select-wrap').addClass('on');
          } else {
            $(this).closest('.box-select-wrap').removeClass('on');
          }
        });
      }
    },
    textField: {
      init: function init() {
        this["delete"]();
        $('.text-input-wrap.isBtn').length > 0 && this.actBtn();
      },
      actBtn: function actBtn() {
        var $el = $('.text-input-wrap'),
            $input = $el.find('input'); // input 타이핑 이벤트

        setTimeout(function () {
          $input.on('change keyup', function () {
            var currentVal = $(this).val(),
                btn = $(this).siblings('.btn-action');

            if (currentVal !== '') {
              btn.removeAttr('disabled');
              btn.addClass('btn-black');
              btn.show();
            } else {
              btn.attr('disabled', '');
              btn.removeClass('btn-black');
              btn.hide();
            }
          });
        }, 100);
      },
      "delete": function _delete() {
        var $el = $('.text-input-wrap'),
            $input = $el.find('input'),
            $del = $el.find('.ico-search-delete'); // input 타이핑 이벤트

        setTimeout(function () {
          $input.on('change keyup', function () {
            var currentVal = $(this).val(),
                btn = $(this).siblings('.ico-search-delete');
            currentVal !== '' ? btn.show() : btn.hide();
          });
        }, 100);
        $input.on('click', function () {
          return $('.ico-search-delete').hide();
        });
        $del.on('click', function () {
          $(this).hide();
          $(this).siblings('input').val('').focus();
        });
        document.querySelector('body').addEventListener('click', function (_ref4) {
          var target = _ref4.target;

          if (!target.closest('.text-input-wrap')) {
            $del.hide();
          }
        });
      }
    },
    storyDetail: {
      init: function init() {
        $('.sub-visual .video-js').length > 0 && this.coverVideo();
      },
      coverVideo: function coverVideo() {
        var $el = $('.sub-visual'),
            $txt = $el.find('.box-txt'),
            $video = videojs('#cover-video');
        $txt.on('click', function () {
          $video.paused() ? $video.play() : $video.pause();
          ;
        });
      }
    },
    fold: {
      init: function init() {
        this.fold();
      },
      fold: function fold() {
        var $btn = $('.fold-btn-wrap button');
        $btn.on('click', function () {
          if ($(this).hasClass('on')) {
            $(this).removeClass('on');
            $(this).closest('.fold-btn-wrap').siblings('.fold-wrap').removeClass('on');
          } else {
            $(this).addClass('on');
            $(this).closest('.fold-btn-wrap').siblings('.fold-wrap').addClass('on');
          }
        });
      }
    },
    hashTag: {
      init: function init() {
        var $wrap = $('.chips-editable'),
            $input = $wrap.find('.edit-input-wrap .chip-edit'),
            $temp = $wrap.find('#input-width-calc'),
            regExp = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

        var keywords = [],
            _tempW = $temp.innerWidth();

        $input.css('width', _tempW);
        $(document).on("click", ".chip-edit-done", function () {
          var index = $(this).index();
          keywords.splice(index, 1);
          $(this).remove();
          $input.focus();
        }); // 입력 이벤트

        $input.on('propertychange change keyup paste input', function (event) {
          var _value = $(this).val(); // 엔터키 입력


          if (event.keyCode === 13) {
            event.preventDefault();
            var isExists = keywords.findIndex(function (x) {
              return x === _value;
            }) > -1;

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

        function changeWidth(value) {
          $temp.text(value);
          $input.css('width', $temp.innerWidth());
        }

        function keywordSet(value) {
          var $el = $wrap.find('.edit-input-wrap'),
              $btn = "<button class=\"chip-edit chip-edit-done\">".concat(value, "</button>");
          $el.before($btn);
        }

        function errorSet() {
          var $btn = "<strong class=\"error\">\uD574\uC2DC\uD0DC\uADF8\uC5D0\uB294 \uD2B9\uC218\uBB38\uC790\uB97C \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4.</strong>";
          errorDel();
          $wrap.after($btn);
        }

        function errorDel() {
          console.log();
          $wrap.siblings('.error').remove();
        }
      }
    },
    popularSearchWord: {
      init: function init() {
        this.rolling();
      },
      rolling: function rolling() {
        var $el = $('.box-search-word .rolling-wrap'),
            _elH = $el.height(),
            _count = $el.find('li').length,
            _totalH = _elH * _count;

        var move = 0;

        function rollingEvent() {
          move += _elH;
          $el.find('ul').animate({
            'top': -move
          }, 600, function () {
            if (move >= _totalH) {
              $(this).css('top', 0);
              move = 0;
            }
          });
        }

        setInterval(rollingEvent, 3000);
        $el.find('ul').append($el.find('li').first().clone());
      }
    },
    slider: {
      init: function init() {
        this.welcafe();
        this.chart();
      },
      welcafe: function welcafe() {
        // 자주찾는 웰카페
        var $el = uiCommon.slick.init($('.list-place'), {
          speed: 700,
          slidesToShow: 1,
          dots: false,
          autoplay: false,
          autoplaySpeed: 3000,
          variableWidth: true,
          arrows: false
        });
      },
      chart: function chart() {
        var $el = uiCommon.slick.init($('.chart-slider'), {
          speed: 700,
          slidesToShow: 1,
          dots: false,
          autoplay: false,
          arrows: false
        });
      }
    },
    main: {
      init: function init() {
        // $('.bottom-inner').length > 0 && this.userSlide();
        this.viSlider();
        $window.on('scroll', function () {
          $(window).scrollTop() > 0 ? $('header').addClass('scrolling') : $('header').removeClass('scrolling');
        });
      },
      userSlide: function userSlide() {
        var $inner = $('.bottom-inner'),
            $list = $('.user-list'),
            _length = $list.find('li').length,
            _width = $list.find('li').width(),
            _total = -(_width * _length + 12 * (_length - 1) + 10);

        var posi = 0;
        $inner.append($list.clone());
        $inner.append($list.clone());

        function loop() {
          $inner.css('left', 0).animate({
            left: _total
          }, 15000, 'linear', loop);
        }

        loop();
      },
      viSlider: function viSlider() {
        setTimeout(function () {
          $('.main-kv').on({
            init: function init(event, slick) {
              if ($('.slick-slide.slick-active').find('video').length > 0) {
                var $video = $('.slick-slide.slick-active').find('video')[0],
                    _duration = $video.duration * 1000;

                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', _duration);
              } else {
                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', 5000);
              }
            },
            afterChange: function afterChange(event, _ref5, currentSlide, nextSlide) {
              var count = _ref5.slideCount;

              if ($('.slick-slide.slick-active').find('video').length > 0) {
                var $video = $('.slick-slide.slick-active').find('video')[0],
                    _duration = $video.duration * 1000;

                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', _duration);
              } else {
                $('.main-kv').slick('slickSetOption', 'autoplaySpeed', 5000);
              }
            }
          });
        }, 100);

        if ($('.main-kv > *').eq(0).find('video')[0]) {
          var _duration = $('.main-kv > *').eq(0).find('video')[0].duration * 999;

          uiCommon.slick.init($('.main-kv'), {
            infinite: true,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: _duration,
            dots: true,
            fade: true
          });
        } else {
          uiCommon.slick.init($('.main-kv'), {
            infinite: true,
            slidesToShow: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            dots: true,
            fade: true
          });
        }
      }
    }
  };
  uiCommon.init();
  return uiCommon;
}(window.uiCommon || {}, $(window));