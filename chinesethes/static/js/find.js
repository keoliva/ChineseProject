$(function () {
	$("table td p").mousedown(function() {
		alert($(this).html());
	}),
	$('#sync_button').click(function() {
		var text = document.getElementById("textarea").value + " ";
		var index = text.search("#");
		var n_text = "", word = "";
		var len_of_word = 0, found = 0;
		var words = [];
		$('#words_to_find').html("");
		while (index >= 0) {
			console.log("first " + text);
			n_text = text.slice(index);
			len_of_word = n_text.search(" ");
			word = text.substr(index+1, len_of_word);
			word = word.replace(/_/g, " ");
			current_html = $('#words_to_find').html();
			new_html = "<li onclick='show_results(" + found + ")'>"
							+ word + "</li>";
			$('#words_to_find').html(current_html + new_html);
			found += 1;
				
			text = text.slice(index + len_of_word);
			index = text.search("#");
		}
		
	}),
	$('#textarea').keydown(function(event) {
		if (event.keyCode == 118) {
			$('#sync_button').click();
		}
	})
});
