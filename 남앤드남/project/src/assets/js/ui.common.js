"use strict";

const uiCommon = (function (uiCommon, $window) {
  uiCommon.init = function () {
    uiCommon.mobileCheck.init();
    uiCommon.header.init();
    uiCommon.gnb.init();
    uiCommon.lnb.init();
    uiCommon.select.init();
    uiCommon.titImg.init();
    uiCommon.titText.init();
    uiCommon.titText2.init();
    uiCommon.goTop.init();
    uiCommon.accordion.init();
    uiCommon.lineDraw.init();
    uiCommon.component.init();
    uiCommon.printImg.init();
  };



  uiCommon.mobileCheck = {
    _isMobile: false,
    init:function(){
      this.setDefault();
    },
    setDefault(){
    	let mobile_filter = new Array('iPhone','iPod','iPad','Android','BlackBerry','Windows Phone','Windows CE','LG','MOT','SAMSUNG','SonyEricsson','Nokia');
      this._isMobile = false;
      for(var i in mobile_filter){
        if(navigator.userAgent.match(mobile_filter[i]) != null){
          this._isMobile = true;
        }
      }
      if(this._isMobile){
        $('body').addClass('dv-mobile');
      }
    },
    iosCheck(){
      var varUA = navigator.userAgent.toLowerCase();
      if ( varUA.indexOf('android') > -1) {
          //안드로이드
          return "android";
      } else if ( varUA.indexOf("iphone") > -1||varUA.indexOf("ipad") > -1||varUA.indexOf("ipod") > -1 ) {
          //IOS
          return "ios";
      } else {
          //아이폰, 안드로이드 외
          return "other";
      }
    }
  }
  uiCommon.header = {
    init:function(){
      this.event();
    },
    event:function(){
      let lastScroll = 0,
          _this = this;
      $(window).on('scroll', function(){
        var thisScroll = $(this).scrollTop();
        if(thisScroll > 0){
          $('.header').addClass('is-scroll');
          if(thisScroll < lastScroll){//up
            _this.scrollUp();
          }else{//down
            _this.scrollDown();
          }
        }else{
          $('.header').removeClass('is-scroll');
          _this.scrollUp();
        }
        lastScroll = thisScroll;
      });
    },
    scrollDown:function(){
      let lnbLen = $('.lnb').length;
      if(lnbLen > 0){
        setTimeout(function(){
          gsap.to('#header', {duration:0.2, marginTop: -($('.header-wrap').outerHeight()), ease:'power1', complete:function(){
            gsap.set('#header', {marginTop: -($('.header-wrap').outerHeight())});
          }});
        },10);
      }
    },
    scrollUp:function(){
      setTimeout(function(){
        gsap.to('#header', {duration:0.2, marginTop: 0, ease:'power1', complete:function(){
          gsap.set('#header', {marginTop: 0});
        }});
      },10);
    }
  }
  uiCommon.gnb = {
    init: function(){
      let gnbLen = $('.gnb').length;
      if(gnbLen > 0){
        this.setDefault('.gnb');
        this.event('.gnb', '.gnb-btn', '.gnb-close');
      }
    },
    setDefault:(elem) => {
      let el = $(elem),
        elPos = el.attr('data-gnb'),
        elString = elPos.split(',');
      $('.gnb-1depth__items').removeClass('on');
      if(!uiCommon.mobileCheck._isMobile) {
        $('.gnb-1depth__items.'+ elString[0]).addClass('on');
      }
      gsap.set('.gnb-1depth__items.on .gnb-2depth .gnb-2depth__items', {left:0});
      gsap.set('.gnb-1depth__items.on .gnb-2depth', {height:'auto'});

      !$('.wrap').hasClass('main') && $('.gnb-1depth__items.'+ elString[0]).find('.gnb-2depth__items').eq(elString[1]).addClass('on');

    },
    event:(elem, target1, target2) => {
      let tl1 = gsap.timeline();
      let tl2 = gsap.timeline();
      $(target1).on('click', function(){
        uiCommon.gnb.open('.gnb');
        $('.goTop').css({'z-index':-1});
      });
      $(target2).on('click', function(){
        uiCommon.gnb.close('.gnb');
        $('.goTop').css({'z-index':29});
      });
      uiCommon.gnb.itemEvent('.gnb-1depth__items');
    },
    close:(elem) => {
      gsap.to(elem, {duration:0.4, right:'-100%', ease: "power2", delay:0.4});
      gsap.to('.gnb-logo', {duration:0.4, opacity:0, ease: "power2"});
      gsap.to('.pc_gnbImage', {duration:0.4, left:'50%', ease: "power1", delay:0.2});
      let wScrollTop = $('.wrap').scrollTop();
      let hh = $('.header-wrap').outerHeight();
      $('body, .wrap').removeClass('scrollOff');
      gsap.set('.header-wrap', {marginTop:-($('.header-wrap').outerHeight())});
      $(window).scrollTop(wScrollTop);
      setTimeout(function(){
        $(window).scrollTop(wScrollTop - hh);
      }, 10);
      $('.header-wrap').css('margin-top', 0);
      if($('.header').hasClass('is-gnbOpen')){
        $('.header').removeClass('is-gnbOpen');
      };
    },
    open:(elem) => {
      let wScrollTop = $(window).scrollTop();
      setTimeout(function(){
        $('body').addClass('scrollOff');
        $('.wrap').addClass('scrollOff').scrollTop(wScrollTop);
      }, 200);
      gsap.to(elem, {duration:0.4, right:0, ease: "power2"});
      gsap.to('.pc_gnbImage', {duration:0.4, left:0, ease: "power2", delay:0.2});
      gsap.to('.gnb-logo', {duration:0.4, opacity:1, ease: "power2", delay:0.4});
      if($('.header').hasClass('is-scroll')){
        $('.header').addClass('is-gnbOpen');
        // gsap.to('.header-wrap', {duration:0.4, marginTop:0, ease:'power1'});
      };

    },
    itemEvent:(target) => {
      $(target + '>a').on('click', function(){
          let _this = $(this);
          $(target).removeClass('on');
          _this.parents('.gnb-1depth__items').addClass('on');
          gsap.set('.gnb-1depth__items .gnb-2depth .gnb-2depth__items', {left:'-100%'});
          gsap.fromTo('.gnb-1depth__items.on .gnb-2depth', {height:0}, {duration:0.4, height:'auto', ease: "power1"});
          let items = $('.gnb-1depth__items.on .gnb-2depth .gnb-2depth__items');
          let itemsLen = items.length;
          for(var i=0; i<itemsLen; i++){
            gsap.to(items.eq(i), {duration:0.4, left:0, ease: "power1", delay:i*0.2});
          }
      });
    }
  }
  uiCommon.lnb = {
    init: () => {
      uiCommon.lnb.setDefault('.lnb');
    },
    setDefault: (elem) => {
      let el = $(elem);
      if(el.length > 0){
        let elPos = el.attr('data-lnb');
        let elString = elPos.split(',');
        $('.lnb-1depth, .lnb-2depth').css({'display':'block'});
        $('.lnb-1depth .select-list__items, .lnb-2depth .select-list__items').removeClass('on');
        $('.lnb-1depth .select-list-wrap .select-list__items.' + elString[0]).addClass('on');
        $('.lnb-2depth .select-list-wrap .select-list.' + elString[0]).css({'display':'block'});
        $('.lnb-2depth .select-list-wrap .select-list.' + elString[0] + ' .select-list__items').eq(elString[1]).addClass('on');

        if(elString[0] == 'business' && elString[1] > 0){
          $('.lnb-3depth').css({'display':'block'});
          $('.lnb-3depth .select-list').eq(elString[2]).css({'display':'block'});
          $('.lnb-3depth .select-list').eq(elString[2]).find('.select-list__items').eq(elString[3]).addClass('on');
        }
      }
    }
  }
  uiCommon.titImg = {
    init: function(){
      let contlen = $('.container-header-fixImg').length;
      let contlenD = $('.container-subMain-fixImg').length;
      if(contlen > 0){
        this.setDefault();
        this.event();
      }else if(contlenD > 0){
        this.eventD();
      }

    },
    setDefault: function(){
      let h1 = $('.header').outerHeight();
      let h2 = $('.container-header').outerHeight();
      let h3 = Number($('.container-header').css('padding-bottom').replace(/[^-\d\.]/g,''));
      let h4 = Number($('.container-header').css('margin-bottom').replace(/[^-\d\.]/g,''));
      $('.container-header-fixImg').css('top', (h1 + h2 - h3 + h4));
    },
    event: function(){
      let _this = this;
      $(window).on('scroll', function(){
        var _thisTop = $(window).scrollTop();
        gsap.to('.container-header-fixImg>img', {duration:0, x:0, y:(_thisTop * 0.4), ease: "power1"});
      });
      $(window).on('resize', function(){
        setTimeout(function(){
          _this.setDefault();
        }, 100);
      });
    },
    eventD:function(){
      $(window).on('scroll', function(){
        var _thisTop = $(window).scrollTop();
        gsap.to('.container-subMain-fixImg>img', {duration:0, x:0, y:(_thisTop * 0.2), ease: "power1"});
      });
    }
  }
  uiCommon.titText = {
    init: function(){
      let flagLen = $('.container-header__text').length;
      if(flagLen > 0){
        this.event();
      }
    },
    event: function(){
      let tl;
      titEvent();
      function titEvent(){
        // ScrollTrigger.matchMedia({
        //   "(min-width: 768px)": function(){
        //     tl = gsap.timeline({
        //       scrollTrigger: {
        //         trigger: ".container-header__text",
        //         toggleActions: "restart reverse restart none"
        //       },
        //     });
        //   },"(max-width: 767px)": function(){
        //     tl = gsap.timeline({
        //       scrollTrigger: {
        //         trigger: ".container-header__text",
        //         toggleActions: "play complete complete complete",
        //       },
        //     });
        //   }
        // })
        tl = gsap.timeline({
          scrollTrigger: {
            trigger: ".container-header__title",
            // toggleActions: "play complete complete complete"
          },
        });

        function text1(name){
          var elemLen = $('.container-header__title').length;
          for(var d=1; d<(elemLen + 1); d++){
            if($('.container-header__title:nth-child(' + d +')').is(':visible')){
              var textLen = $('.container-header__title:nth-child(' + d +')>div').length;
              for(var i=1; i<(textLen + 1); i++){
                name.fromTo('.container-header__title:nth-child(' + d +')>div:nth-child(' + i +')>span', {top:'100px',  opacity:0}, {duration:0.5, top:0, opacity:1, ease:'power3', delay:(i-1)*0.2}, 0.4);
              }
            }
          }
        }

        tl.add(text1(tl));
        tl.fromTo('.container-header__text', {top:'40px',  opacity:0}, {duration:0.4, top:0, opacity:1, ease:'power3'}, 0.8);
        if($('.container-header__text .container-header__inImage').length > 0){
          tl.fromTo('.container-header__text .container-header__inImage', {opacity:0, right:'-30px'}, {duration:1, right:0, opacity:1, ease:'power3'}, 1);
        }
      }

      // $(window).on('resize', function(){
      //   tl.kill();
      //   titEvent();
      // });


    }
  }
  uiCommon.titText2 = {
    init: function(){
      let flagLen = $('.subMain-header-wrap').length;
      if(flagLen > 0){
        this.event();
      }
    },
    event: function(){
      let tl;
      // ScrollTrigger.matchMedia({
      //   "(min-width: 768px)": function(){
      //     tl = gsap.timeline({
      //       scrollTrigger: {
      //         trigger: ".subMain-header-wrap",
      //         toggleActions: "restart reverse restart none",
      //         onLeave:function(){
      //           $('.subMain-header__title .title-left i').removeClass('on');
      //           $('.subMain-header__title .title-right i').removeClass('on');
      //         },
      //         onLeaveBack:function(){
      //           $('.subMain-header__title .title-left i').removeClass('on');
      //           $('.subMain-header__title .title-right i').removeClass('on');
      //         }
      //       },
      //       onComplete: function(){
      //         $('.subMain-header__title .title-left i').addClass('on');
      //         $('.subMain-header__title .title-right i').addClass('on');
      //       }
      //     });
      //   },"(max-width: 767px)": function(){
      //     tl = gsap.timeline({
      //       scrollTrigger: {
      //         trigger: ".subMain-header-wrap",
      //         toggleActions: "play complete complete complete",
      //       },
      //       onComplete: function(){
      //         $('.subMain-header__title .title-left i').addClass('on');
      //         $('.subMain-header__title .title-right i').addClass('on');
      //       }
      //     });
      //   }
      // });

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".subMain-header-wrap",
          // toggleActions: "play complete complete complete",
        },
        onComplete: function(){
          $('.subMain-header__title .title-left i').addClass('on');
          $('.subMain-header__title .title-right i').addClass('on');
        }
      });


      tl.to('.subMain-header__title>div span', {duration:0.6, top:0, opacity:1, ease:'power3'}, 0.4);
      tl.to('.subMain-header__text', {duration:0.6, top:0, opacity:1, ease:'power1'}, 0.4);
    }
  }
  uiCommon.select = {
    init: () => {
      uiCommon.select.setDefault('.select-wrap');
      uiCommon.select.event('.select-title', '.select-list__items');
    },
    setDefault: (elem) => {
      let el = $(elem);
      el.each(function(i){
          let title = el.eq(i).find('.select-list__items.on').children('a').text();
          el.eq(i).find('.select-title').text(title);
      });
    },
    event : (elem1, elem2) => {
      let target = $(elem1);
      let elem = $(elem2);
      target.on('click', function(){
        let _this = $(this);
        let winW = $(window).width();
        let stateW = 768;
        if(_this.hasClass('is-active')){
          close();
        }else{
          open();
        }
        function open(){
          target.removeClass('is-active');
          target.next('.select-list-wrap').slideUp(200);
          _this.addClass('is-active');
          _this.next('.select-list-wrap').slideDown(200);
          if(winW < 768){
            $('.lnb .select-wrap .select-title').css({'color':'#999'});
            _this.css({'color':'#111'});
          }
        }
        function close(){
          target.removeClass('is-active');
          target.next('.select-list-wrap').slideUp(200);
          if(winW < 768){
            $('.lnb .select-wrap .select-title').css({'color':'#111'});
          }
        }
      });
      elem.children('a').on('click', function(){
        let _this = $(this);
        let winW = $(window).width();
        let stateW = 768;
        _this.parents('.select-list-wrap').slideUp(200);
        _this.parents('.select-list-wrap').find(elem2).removeClass('on');
        _this.closest(elem2).addClass('on');
        _this.parents('.select-wrap').find('.select-title').removeClass('is-active').text($(this).text());
        if(winW < 768){
          $('.lnb .select-wrap .select-title').css({'color':'#111'});
        }
      });
    }
  }
  uiCommon.goTop = {
    init: function(){
      let flagLen = $('.goTop').length;
      if(flagLen > 0){
        this.event('.goTop');
      }
    },

    event:function(elem){
      let h = $('.header').outerHeight();
      $(window).on('scroll', function(){
        let scrollTop = $(window).scrollTop();
        if(h<scrollTop){
          gsap.to('.goTop', {duration:1, opacity:1, ease:'power3'})
        }else{
          gsap.to('.goTop', {duration:1, opacity:0, ease:'power3'})
        }
      });
      $(elem).on('click', function(){
        if( uiCommon.mobileCheck.iosCheck() === 'ios') {
          $('body, html').animate({scrollTop:0},0);
        }else{
          $('body, html').animate({scrollTop:0}, 600);
        }
      });
    }
  }
  uiCommon.accordion = {
    init: function(){
      this.event('.accordion__items__title');
    },
    event:function(elem){
      $(elem).on('click', function(e){
        e.stopImmediatePropagation();
        let _this = $(this).parents('.accordion__items');
        let _thisParents = $(this).parents('.accordion-wrap');
        if(_this.hasClass('is-active')){//close
          close();
        }else{//open
          open();
        }
        function open(){
          _thisParents.find('.accordion__items').removeClass('is-active');
          _thisParents.find('.accordion__items__conts').slideUp(200);
          _this.addClass('is-active');
          _this.find('.accordion__items__conts').slideDown(200);
        }
        function close(){
          _this.removeClass('is-active');
          _thisParents.find('.accordion__items__conts').slideUp(200);
        }
      });
    }
  }
  uiCommon.lineDraw = {
    init:function(){
    let flagLen = $('.subMain-header-wrap').length;
        if(flagLen > 0){
        this.event();
      }
    },
    event:function(){
      let tl1;
      let tl2;
      let tl3;
      lineMove();
      $(window).on('resize', function(){
        tl1.kill();
        tl2.kill();
        tl3.kill();
        lineMove();
      });
      function lineMove(){
        tl1 = gsap.timeline({
          scrollTrigger:{
            trigger:'.lineDraw-wrap.type1',
            toggleActions:'restart none restart none'
          }
        });
        tl2 = gsap.timeline({
          scrollTrigger:{
            trigger:'.lineDraw-wrap.type2',
            toggleActions:'restart none restart none'
          }
        });
        tl3 = gsap.timeline({
          scrollTrigger:{
            trigger:'.lineDraw-wrap.type3',
            toggleActions:'restart none restart none'
          }
        });

        let gauge;
        let lineh;

        if($('.lineDraw-wrap.type1 .back-draw').width() < 150){//mobile size
          gauge = 30;
          lineh = 90;
        }else{
          gauge = 40;
          lineh = 118;
        }

        tl1.add(rectDraw(tl1, gauge, 4));
        tl1.add(lineDraw(tl1));
        tl3.add(lineDraw2(tl3));
        tl2.fromTo('.lineDraw-wrap.type2 .front-draw',{rotate:-45}, {duration:2, rotate:135, ease: Power4.easeInOut}, 0);
        tl2.fromTo('.lineDraw-wrap.type2 .midi-draw',{rotate:-45}, {duration:1.2, rotate:135, ease: Power4.easeInOut}, 0.8);
        tl2.fromTo('.lineDraw-wrap.type2 .back-draw',{rotate:0}, {duration:1.4, rotate:90, ease: Power4.easeInOut}, 0.6);
        function rectDraw(name, psNum, lineNum){
          let draws = document.querySelectorAll('.lineDraw-wrap.type1 .lineDraw-conts');
          for(var i=1; i<draws.length; i++){
              name.fromTo(draws[i], {x:0, y:0}, {duration:1.6, x:(i*psNum)+lineNum, y:(i*psNum)+lineNum , ease: Power4.easeInOut}, 0.2);
          }
        }
        function lineDraw(name){
          let draws = document.querySelectorAll('.lineDraw-wrap.type1 .line');
          let h;
          for(var i=0; i<draws.length; i++){
              h = lineh;
              name.fromTo(draws[i], {height:0},{duration:1.6, height:h, ease: Power4.easeInOut}, 0.2);
          }
        }
        function lineDraw2(name){
            let line1 = document.querySelectorAll('.lineDraw-wrap.type3 .front-line i');
            let line2 = document.querySelectorAll('.lineDraw-wrap.type3 .back-line i');
            name.fromTo('.lineDraw-wrap.type3 .front-line', {rotate:0}, {duration:1.2, rotate:90, ease: Power4.easeInOut});
            name.fromTo('.lineDraw-wrap.type3 .back-line', {rotate:180}, {duration:1.2, rotate:270 , ease: Power4.easeInOut}, 0);
            for(var i=0; i<line1.length; i++){
              let angle = 180 /line1.length;
              name.fromTo(line1[i], {rotate:0}, {duration:1.2, rotate: i*angle , ease: Power4.easeInOut}, 0);
            }
            for(var i=0; i<line2.length; i++){
              let angle = 180 /line2.length;
              name.fromTo(line2[i], {rotate:0}, {duration:1.2, rotate: i*angle ,ease: Power4.easeInOut}, 0);
            }
        }
      }

    }
  }
  uiCommon.component = {
    init: function(){
      this.search();
      this.accordion();
      this.selectChange();
      this.selectArrow();
    },
    search : function() {
        // 검색 스크립트
        let searchInput = $('.input-text-clear .input-default'),
            btnClear = $('.input-text-clear .btn-clear');

        btnClear.hide();
        searchInput.on('keyup focus',function(){
            $(this).siblings('.btn-clear').show();
            if($(this).val().length == 0){
                $(this).siblings('.btn-clear').hide();
            }else{
                $(this).siblings('.btn-clear').show();
            }
        })

        searchInput.on('blur',function(){
            let $this = $(this);
            setTimeout(function(){
                if($this.siblings('.btn-clear').is(':focus')){
            }else{
                $this.siblings('.btn-clear').hide();
            }
            }, 200);
        });

        btnClear.on('blur',function(){
            let $this = $(this);
            $this.hide();
        });

        btnClear.on('click',function(){
            $(this).siblings('.input-text-clear .input-default').val('').focus();
            $(this).hide();
        });

    },
    accordion : function() {
        $('.accordion__items__title').on('click', function(){
            let _this = $(this).parents('.accordion__items');
            let _thisParents = $(this).parents('.accordion-wrap');
            if(_this.hasClass('is-active')){//close
                close();
                console.log('close');
            }else{//open
                open();
                console.log('open');
            }
            function open(){
                _thisParents.find('.accordion__items').removeClass('is-active');
                _thisParents.find('.accordion__items__conts').slideUp(200);
                _this.addClass('is-active');
                _this.find('.accordion__items__conts').slideDown(200);
            }
            function close(){
                _this.removeClass('is-active');
                _thisParents.find('.accordion__items__conts').slideUp(200);
            }
        });
    },
    selectChange : function() {
        $('.select-wrap .select1').change(function(){
            if($(this).val() === '직접입력'){
                $('.input-email-text').parents('.input-email').addClass('show');
                if($('.input-email-text').parent('.input-text__wrap').hasClass('input-error')){
                    $('.input-email-text').siblings('.input-error__message').css({display:'block'});
                };
            } else{
                $('.input-email-text').parents('.input-email').removeClass('show');
                $('.input-email-text').siblings('.input-error__message').css({display:'none'});
            }
        });
    },
    selectArrow : function() {
        $('.select-wrap .select1').on('click',function(){
            $(this).parent('.select-box').toggleClass('is-active');
        })
    }
  }
  uiCommon.popup = {
    open:function(elem){
      let flag = $('.wrap.main').length;
      let wScrollTop = $(window).scrollTop();
      if(flag > 0){
        $('body').css({'overflow':'hidden'});
      }else{
        $('body').addClass('scrollOff');
        $('.wrap').addClass('scrollOff').scrollTop(wScrollTop);
      }
      $('.wrap').append('<div class="dimmed"></div>');
      $(elem).css({'display':'block'});
    },
    close:function(elem){
      let flag = $('.wrap.main').length;
      let wScrollTop = $('.wrap').scrollTop();
      if(flag > 0){
          $('body').css({'overflow':'auto'});
      }else{
          $('body, .wrap').removeClass('scrollOff');
          $(window).scrollTop(wScrollTop);
      }
      $(elem).css({'display':'none'});
      $('.dimmed').remove();
    }
  }
  uiCommon.printImg = {
    init: function(){
      const $el = $('.container-contents-wrap');

      $('.i-print').closest('.btns').on('click',function(){
        const $cloneEl = $el.clone();
        $cloneEl.find('.btns.icon').remove();
        $cloneEl.find('.imgMap-items').remove();
        $cloneEl.find('.custom-mouse-area').remove();
        $cloneEl.css({'padding-bottom': 0});
        $cloneEl.find('.imgMap-imgwrap').css({'text-align': 'center'});
        $cloneEl.find('.imgMap-imgwrap img').css({'width': '90%'});

        $cloneEl.printThis();
      });
    }
  }

  uiCommon.init();
  return uiCommon;
})(window.uiCommon || {}, $(window));