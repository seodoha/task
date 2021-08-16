;const ctrlMain = (function(ui){

	const uiScrollTrigger = {
		init(){
			gsap.registerPlugin(ScrollTrigger);
			uiScrollTrigger.scrollAction('.feed-list');
//			this.ctrlScroll();
		},
		scrollAction(el){

			ScrollTrigger.defaults({
			  toggleActions: "play none none reset"
			});

		
		//	let arr = gsap.utils.toArray('.feed');
			let animWrap = document.querySelector(el),
				arr = animWrap.getElementsByClassName('feed-item');

			for(let i of arr){
				gsap.to(i, {
					y: -20,
					opacity: 1,
					scale: '1',
					duration: '0.5',
					scrollTrigger: {
						trigger: i,
						start: "top bottom",
					}
				});
			};
		},
		ctrlScroll() {
			let scrollInterval = setInterval(function(){ window.scrollTo(0,0) }, 10);
			setTimeout(function(){ clearInterval(scrollInterval) }, 300);
		}
	};

	const ctrlCard = {
		wrap: null,
		layer: null,
		feedInform: null,
		feed: null,
		kv: null,
		feedContent: null,
		graph: null,
		graphBar: null,
		isFliping: true,
		st: 0,
		
		init(){

			gsap.registerPlugin(Flip);
			this.setting();
			this.binding();
			this.moveBar('50%', 0);

		},
		setting(){
			this.wrap = document.querySelector('.page-wrap'),
			this.layer = document.querySelector('.layer'),
			this.feedInform = document.querySelector('.feed-inform'),
			this.feedContent = document.querySelector('.feed-content'),
			this.graph = this.feedInform.querySelector('.progress-area'),
			this.graphWrap = document.querySelectorAll('.progress-inform'),
			this.graphBar = document.querySelectorAll('.progress-bar'),
			this.feed = this.wrap.querySelector('.card-benefits'),
			this.close = document.querySelector('.layer-close');
		},
		binding(){
			
			this.feed.addEventListener('click', (e) => { this.change(e); });
			this.close.addEventListener('click', (e) => { this.change(e); });

		},
		change(e){

			this.layer.classList.add("on");
			this.feedInform.classList.toggle("active");

			gsap.set(this.graphWrap, {width: 0});
			gsap.set(this.graphBar, {width: 0});

			if(e.target.parentNode.className.indexOf('layer-close') > -1){ //�ݱ��ư ��������
				gsap.set(this.feedContent, {display: 'none'});
				gsap.fromTo(this.layer, {opacity: 1},{opacity: 0, duration: 0.2, onComplete: () => {this.layer.classList.remove("on")}});
				gsap.set(this.wrap, {height: 'auto', overflow: 'visible', zIndex: '20'});
				window.scrollTo(0,this.st);
				this.flip();
				
			} else { // feed ������ ��
				this.flip();
				gsap.fromTo(this.layer, {opacity: 0},{opacity: 1, duration: 0.2});
				gsap.fromTo(this.feedContent, {display: 'block', y: 0, opacity: 0},{y: -30, opacity: 1, duration: 0.7, delay: 0.4});

				this.st = window.scrollY;
				setTimeout(() => { 
					gsap.set(this.wrap, {height: window.innerHeight, overflow: 'hidden'}); 
				}, 300);
				
			};


		},
		flip(){

			let state = Flip.getState(this.feedInform);
			(this.feedInform.parentNode === this.feed ? this.layer : this.feed).appendChild(this.feedInform);

			Flip.from(state, {
				duration: 0.6,
				ease: 'power4.out',
				onComplete: () => {
					this.moveBar('50%', 0);
				}
			});	
			
		},
		moveBar(per, second){
			gsap.to(this.graphWrap, {width: per, duration: 0.5, delay: second});
			gsap.to(this.graphBar, {width: '100%', duration: 0.5, delay: second});
		}
		
	};


	const ctrlBoard = {
		isMy: true,
		feedDisplay: null,
		myBoard: null,
		feedBoard: null,
		header: null,
		myBtn: null,
		myBalloon: null,
		myBtnWrap: null,
		footerBtn: null,
		footerNavi: null,
		wh: window.innerHeight,
		init(){
			this.setting();
			this.bind();
		},
		setting(){

			this.header = document.querySelector('.local-head'),
			this.myBoard = document.querySelector('.usage-details'),
			this.feedBoard = document.querySelector('.feed-display'),
			this.myBtn = document.querySelector('.btn-my'),
			this.myBalloon = document.querySelector('.my-balloon'),
			this.myBtnWrap = document.querySelector('.my-btn-wrap'),
			this.footerBtn = document.querySelector('.btn-report'),
			this.footerNavi = document.querySelector('.footer-navigation');

			gsap.to(this.myBoard, {top: 0, opacity: 1, delay: 0, duration: 0.5});
			gsap.to(this.header, {marginTop: 0, opacity: 1, delay: 0, duration: 0.5});

		},
		bind(){
			this.myBoard.addEventListener('click', (e) => { 
				this.showMyBoard();
				this.downScroll();
			});

			this.myBtn.addEventListener('click', (e) => { 
				event.stopPropagation();
				this.hideMyBoard();
				this.showHeader();
			});
			
			window.addEventListener('scroll', function() {

				if(ctrlBoard.isMy){
					if(this.oldScroll > this.scrollY){
						ctrlBoard.upScroll();
					} else {
						ctrlBoard.downScroll();
					};
				};
				this.oldScroll = this.scrollY;

			});
		},
		showMyBoard(){
			this.isMy = false;
			this.hideHeader();
			gsap.set(this.myBoard, {className: 'content-seciton usage-details active', delay: 0.1});
			gsap.to(this.feedBoard, {marginTop: this.wh, duration: 0.3, delay: 0, onComplete: () => {
				gsap.to(this.myBtn, {bottom: 0, duration: 0.2});
				gsap.set(ctrlCard.graphBar, {width: 0});
				gsap.set(this.feedBoard, {height: 0});
			}});
			gsap.to(this.myBalloon, {opacity: 0, duration: 0.2, onComplete: () => {
				gsap.to(this.myBtnWrap, {opacity: 1, duration: 0.2});
			}});
		},
		hideMyBoard(){
			this.isMy = true;
			gsap.set(this.myBoard, {className: 'content-seciton usage-details', delay: 0.1})
			gsap.set(this.feedBoard, {height: 'auto'});
			gsap.to(this.feedBoard, {marginTop: 295, duration: 0.3, delay: 0, onComplete: () => {
				gsap.to(this.myBtn, {bottom: -46, duration: 0.2});
				ctrlCard.moveBar('50%', 0);
				this.upScroll();
			}});
			gsap.to(this.myBtnWrap, {opacity: 0, duration: 0.2, onComplete: () => {
				gsap.to(this.myBalloon, {opacity: 1, duration: 0.2});
			}});
		},
		showHeader(){
			gsap.to(this.header, {marginTop: 0, duration: 0.1});
		},
		hideHeader(){
			gsap.to(this.header, {marginTop: -48, duration: 0.1});
		},
		upScroll(){
			gsap.to(this.footerBtn, {bottom: 56, duration: 0.5});
			gsap.to(this.footerNavi, {bottom: 0, duration: 0.5});
		},
		downScroll(){
			gsap.to(this.footerBtn, {bottom: -56, duration: 0.5});
			gsap.to(this.footerNavi, {bottom: -56, duration: 0.5});
		}

	};


	const ctrlBenefits = {
		header: null,
		myBoard: null,
		feedDisplay: null,
		init(){
			this.setting();
			this.action();
//			this.ctrlScroll();
		},
		setting(){
			this.header = document.querySelector('.local-head'),
			this.myBoard = document.querySelector('.usage-details'),
			this.feedDisplay = document.querySelector('.feed-display');
		},
		action(){
			this.header.classList.add('active');
			this.myBoard.classList.add('active');
			this.feedDisplay.classList.add('active');
		},
		ctrlScroll() {
			let scrollInterval = setInterval(function(){ window.scrollTo(0,0) }, 10);
			setTimeout(function(){ clearInterval(scrollInterval) }, 300);
		}

	}

	if(document.querySelector('.main-my')){
		ctrlBoard.init();
		uiScrollTrigger.init();
		ctrlCard.init();
	};

	if(document.querySelector('.main-benefits')){
		ctrlBenefits.init();
	};


	return {
		ctrlBoard: ctrlBoard,
		uiScrollTrigger: uiScrollTrigger,
		ctrlCard: ctrlCard
	};

//	return ui;

}(window.ctrlUI || {}));

console.log(ctrlMain.uiScrollTrigger)

