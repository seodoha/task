$(function(){

	wheelAction = {
		$window: $(window),
		axisY : null,
		ST : null,
		init : function(){
			wheelAction.evtBinding();
		},
		evtBinding : function(){
			$('html, body').on('mousewheel', function( e ){
				wheelAction.ST = wheelAction.$window.scrollTop();
				wheelAction.axisY = e.deltaY ;
				console.log(e.deltaY);
				if(wheelAction.axisY > 0){
					wheelAction.wheelUp();
				} else{
					wheelAction.wheelDown();
				};
			});
		},
		wheelUp : function(){
			console.log('up');
		},
		wheelDown : function(){
			console.log('down');
		},
		wheelTest : {
			wheelTest01 : function(){
				console.log('test')
			}
		}
	};

	wheelAction.init();

	$(window).on('scroll', function(){

		// a가 b까지 변할때
		// c는 d까지 변한다.
		// a * ( d - c ) / b + c;

		// var a = 0;
		// var b = 100;
		// var c = 0;
		// var d = 200;

		var ST = $(window).scrollTop(),
			b = $(document).height() - $(window).height(),
			c = 0,
			d = 100


			valueT = ST * ( d - c ) / b + c,
			console.log(valueT);
			$('body > span').css('width', valueT + '%')

	});

});