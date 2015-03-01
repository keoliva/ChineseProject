$(function () {
	$("table td p").mousedown(function() {
		alert($(this).html());
	}),
	$("#words_to_find ul li").click(function() {
		console.log('-__-');
		alert($(this).html());
	}),
	$('#sync_button').click(function() {
		var text = document.getElementById("textarea").value;
		var words = text.split(" ");
		console.log(words);
		var i = 0, found = 0;
		var word = "", current_html = "", new_html = "";
		$('#words_to_find').html("");
		for (i = 0; i < words.length; i++) {
			if (words[i][0] == '#') {
				console.log('once');
				word = words[i].slice(1);
				id = word;
				word = word.replace(/_/g, " ");
				current_html = $('#words_to_find').html();
				new_html = "<li onclick='show_results(" + found + ")'>" 
							+ word + "</li>";
				$('#words_to_find').html(current_html + new_html);
				found += 1;
			}
		}
	}),
	$('#textarea').keydown(function(event) {
		if (event.keyCode == 118) {
			$('#sync_button').click();
		}
	})
});
