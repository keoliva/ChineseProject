$(function() {
	$(document).ready(function() {
		var collapse_down = "glyphicon-collapse-down";
		var collapse_up = "glyphicon-collapse-up";
		// Expand and Collapse Warnings UL with different Icons
		$('#warnings').on("hide.bs.collapse", function() {
			var $span = $('.panel-heading span:last');
			$span.removeClass(collapse_down);
			$span.addClass(collapse_up);
		});
		
		$('#warnings').on("show.bs.collapse", function() {
			var $span = $('.panel-heading span:last');
			$span.removeClass(collapse_up);
			$span.addClass(collapse_down);
		});
	});
	
	$('input#queryFieldInput').keyup(function(e) {
		console.log("input's val: '" + $(this).val() + "'");
		if ($(this).val() == "") {
			$('li.list-group-item').removeClass('visible').show().addClass('visible');
		} else {
			filter('li.list-group-item', 
				['div input[name="chinese"]', 'div input[name="pinyin"]', 
					'div input[name="partsOfSpeech"]', 'div textarea[name="english"]'], 
				$(this).val());
		}
		
	});
	
	function wordInfo(word) {
		return word.chinese + " -- (" + word.partsOfSpeech + ") " word.pinyin + " -- " + word.english;	
	}
	
	$.fn.exists = function () {
		return this.length !== 0;
	};
	
	var returnLi = 
		function (word) {
			return '<li class="list-group-item alert" id=""><div class="row">' +
					'<div class="col-md-3">' +
					'<input type="text" name="chinese" placeholder="中文"' +
					'value="' + word.chinese + '" class="form-control">' +
					'</div>' +
					'<div class="col-md-3">' + 
					'<input type="text" name="pinyin" placeholder="pin1yin1"' +
					'value="' + word.pinyin + '" class="form-control">' +
					'</div>' +
					'<div class="col-md-2">' + 
					'<input type="text" name="partsOfSpeech" placeholder="Parts of Speech"' +
					'value="' + word.partsOfSpeech + '" class="form-control">' +
					'</div>' +
					'<div class="col-md-3" style="padding-right:0px;">' +
					'<textarea name="english" placeholder="English"' +
					'cols="50" rows="2" style="resize:none;" class="form-control">' + word.english + '</textarea>' +
					'</div>' +
					'<div class="col-md-1">' +
					'<a href="#" class="close" data-dismiss="alert" aria-label="close">' +
						'<span class="glyphicon glyphicon-remove" style="color:red;"></span></a></div></div></li>';
		};
	
	// send a request to server
	$('#save_btn').click(function() {
		var $li = $('li.list-group-item');
		var chinese, pinyin, partsOfSpeech, english;
		var modifiedIds = [], newWords = [];
		var id;
		$li.each(function() {
			id = $(this).attr("id");
			var word = { chinese: $(this).find('div input[name="chinese"]').val(),
						pinyin: $(this).find('div input[name="pinyin"]').val(),
						partsOfSpeech: $li.find('div input [name="partsOfSpeech"]').val(),
						english: $(this).find('div textarea[name="english"]').val(),
						index: $(this).index() };
			console.log(JSON.stringify(word));
			if (id == "") {	
				word["userId"] = userId;
				newWords.push(word);
			} else if ($(this).hasClass("modified")) {
				word["id"] = id;
				modifiedIds.push(word);
			}
		});
		var data = { newWords: newWords, modifiedIds: modifiedIds, removedIds: removedIds };
		console.log(JSON.stringify(data));
		sendRequest("POST", JSON.stringify(data), "/edit", "application/json;charset=UTF-8", saveWordsCallback);
	});
		
	var removedIds = [];
	// Remove entry
	$('.close').on('click', function(e) {
		e.preventDefault();
		var $li = $(this).closest("li");
		var word = { chinese: $li.find('div input[name="chinese"]').val(),
						pinyin: $li.find('div input[name="pinyin"]').val(),
						partsOfSpeech: $li.find('div input [name="partsOfSpeech"]').val(),
						english: $li.find('div textarea[name="english"]').val() };
		var confirmed = confirm("Are you sure you want to delete the entry: \n" + wordInfo(word));
		if (confirmed) {
			console.log("User OK'd the confirm");
			var id = $li.attr("id");
			if (id == "") {
			} else {
				console.log("Id removed");
				removedIds.push(id);
			}
		} else {
			return false;
		}
	});
	
	// Modify entry
	$('.list-group-item input, .list-group-item textarea').change(function() {
		$(this).closest("li").addClass("modified");
	});
	
	// Add entry	
	$('#footer_close').click(function(e) {
		e.preventDefault();
		$('#add_btn').removeClass("disabled");
		$('#save_btn').removeClass("disabled");
		$('#enter_entry_footer').hide();
		$('#footer_close').unbind("click").click();
	});
	
	$('#add_btn').click(function() {
		$(this).addClass("disabled");
		$('#save_btn').addClass("disabled");
		$('#enter_entry_footer').show();
		$('#add_entry div input[name="chinese"]').focus();
	});

	$('#add_entry').submit(function(e) {
		e.preventDefault();
		var chinese = $('#add_entry input[name="chinese"]').val();
		var pinyin = $('#add_entry input[name="pinyin"]').val();
		var partsOfSpeech = $('#add_entry input[name="partsOfSpeech"]').val();
		var english = $('#add_entry textarea[name="english"]').val();
		if (chinese == "" || pinyin == "" || english == "") {
			return alert("You did not fill in one of the inputs.");
		}
		var $chineseInput = $('div.col-md-3 input[name="chinese"][value="' + chinese + '"]');
		if ($chineseInput.exists()) {
			var $siblings = $chineseInput.parent().siblings();
			var $pinyinInput = $siblings.find('input[name="pinyin"][value="' + pinyin + '"]');
			if ($pinyinInput.exists()) {
				console.log("pinyinINput: " + $pinyinInput);
				alert("You already have a word stored with the same characters," +
							" and pinyin. Here it is. We've appended the definitions together.");
				$textarea = $siblings.find('textarea');
				console.log("textarea: " + $textarea);
				$textarea.val($textarea.val() + "; " + english);
				return $textarea.focus();
			}
		}
		
		var word = { chinese: chinese, pinyin: pinyin, partsOfSpeech: partsOfSpeech, english: english };
		console.log("ADDED");
		console.log(word);
		$('#view_edit_entries').prepend(returnLi(word));
		
		$('#add_btn').removeClass("disabled");
		$('#save_btn').removeClass("disabled");
		$('#enter_entry_footer').hide();
	});
})