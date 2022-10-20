

jQuery(document).ready(function() {
	var devMode = true;

	function progressList() {
		var $table = $(".progress-list");
		var tableTr = $table.find('tbody tr');
		var stateFields = $table.find("td.state");
		var historyFields = $table.find("td.history");

		// line number
		$table.find("tr td:first-child").each(function(i, v) {
			$(v).text(i + 1);
		});

		stateFields.each(function(i, v) {
			var current = $(v);
			var prop = {
				type: "../" + current.parents('.progress-list').attr('data-type'),
				url: current.siblings('.url').text()
				/*
				directory: current.siblings('.dir').text(),
				pageId: current.siblings('.page').text()
				*/
			};
			var wrapAnchor = $("<a>")
				.attr("target", "_blank")
				.attr("href", prop.url)
				.text(current.text());

			if (current.text() == "미정") {
				current.addClass("undecided");
				if (!devMode) wrapAnchor = current.text();
			} else if (current.text() == "진행") {
				current.addClass("working");
			} else if (current.text() == "완료") {
				current.addClass("complete");
			} else if (current.text() == "수정") {
				current.addClass("modify");
			} else if (current.text() == "대기") {
				current.addClass("hold");
			} else if (current.text() == "삭제") {
				current.addClass("delete");
				wrapAnchor = current.text();
				current.parent().css('background-color','#f1f1f1')
			} else if (current.text() == "검증") {
				current.addClass("validation");
			} else if (current.text() == "기존") {
				current.addClass("old");
			}
			current.html(wrapAnchor);
		});

		historyFields.each(function(i, v) {
			var current = $(v);
			if (current.text() != "" && current.text() != " ") {
				var wrap = $("<div class='fold-text fold'>");
				wrap.html(current.html());
				current.html(wrap);
				current.append($('<button class="fold-btn fold"></button>'));
			}
		})

		$('.fold-btn').bind('click', function(e) {
			e.preventDefault();

			var _this = $(e.currentTarget);
			_this.toggleClass('fold').prev().toggleClass('fold');
		})

	}
	function fullInspection(){ // 검수 추가
		var $fullWrap = $('.full-inspection');
		if(!$fullWrap.length) return;
		$fullWrap.bind('click', function(e){
			var $this = $(this);
			var $type = prompt('어떤타입을 검수하시겠습니까? \n 1.진행+완료 검수 \n 2.진행만 검수 \n 3.완료만 검수');

			var $list = $this.parents('.progress-list');
			var tableTr = $list.find('tbody tr');
			var stateFields = $list.find("td.state");

			tableTr.each(function(i) {
				var tr = tableTr.eq(i);
				var txt = tr.find('td:nth-last-child(2)').text();
				var href = tr.find('td:nth-last-child(2)').find('a').attr("href");
				// console.log(href, txt);

				if($type  == 1) { // 전체
					if(txt === '진행' || txt === '완료') {
						openWindow(href);
					}
				} else if($type  == 2) { // 진행만
					if(txt === '진행') {
						openWindow(href);
					}
				} else if($type == 3) { // 완료만
					if(txt === '완료') {
						openWindow(href);
					}
				} else {
					return false;
				}
				function openWindow(href){
					window.open(href, '_blank')
				}
			})
		})
	}

	function progressDashboard() {
		var $temp = $('<div class="progress"> <a href="javascript:void(0);"> <div class="title"> </div> <div class="stat"> <strong class="percent"></strong> <span class="count"> <span class="current"></span> <span class="slash">/</span> <span class="total"></span> </span> </div> </a> </div>');
		var $board = $('.progress-board');
		var $lists = $('.progress-list');

		if (!$lists.length) {
			return;
		}

		$.each($lists, function(i) {
			var $list = $lists.eq(i);
			var $item = $temp.clone();
			var _id = i+1;

			$item.find('.title').text( $list.find('h2').text() );
			$item.find('.current').text( $list.find('.complete').length );
			$item.find('.total').text( $list.find('.state').length );
			$item.find('.percent').text( Math.floor($list.find('.complete').length / $list.find('.state').length * 100) + '%' );
			$item.find('a').attr( 'href', '#list' + _id );
			$list.attr( 'id', 'list' + _id );

			$item.find('a').bind('click', function(e) {
				e.preventDefault();
				$('html, body').scrollTop( ( $( e.currentTarget.getAttribute('href') ).offset().top - 100 ) );
			})
			$board.append($item);
		})

		$('.go-top').bind('click', function(e) {
			e.preventDefault();

			$('html, body').scrollTop( 0 );
		})
	}

	function destMode() {
		var url = location.pathname;
		if ( location.pathname.indexOf('_dev') == -1 ) {
			devMode = false;
			$('.dev-tr').remove();
			$('.full-inspection').remove();
		}
	}

	destMode();
	progressList();
	fullInspection();
	progressDashboard();

});
