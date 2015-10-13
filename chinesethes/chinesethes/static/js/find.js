$(function () {
	$(document).ready(function() {
		var height = $('#left_side').height();
		$('#words_to_find').height(height * .15);
		$('textarea').height(height * .50);
	});
	$('.result').each(function() {
			$(this).on("click", display_word);
		});
 	
	$('#words_to_find').click(function(e) {
		var word = $(e.target).html().replace(/ /g, "_");
		sendRequest("GET", null, "/find_word/" + word, null, getWordRecsCallback);
	});	
	$('#sync_button').click(function() {
		var text = $("textarea").val() + " ";
		var index = text.search("#");
		var n_text = "", word = "";
		var len_of_word = 0, found = 0;
		var words = [], current_html = "";
		$('#words_to_find').html("");
		while (index >= 0) {
			console.log("first " + text);
			n_text = text.slice(index);
			len_of_word = n_text.search(" ");
			word = text.substr(index+1, len_of_word).trim();
			current_html += "<li>" + word.replace(/_/g, " ") + "</li>";
			found += 1;
			text = text.slice(index + len_of_word);
			index = text.search("#");
		}
		$('#words_to_find').html(current_html);
	});
	$('textarea').keydown(function(event) {
		if (event.keyCode == 118) {
			$('#sync_button').click();
		}
	});
})
