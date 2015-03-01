$(function () {
	$("table td p").mousedown(function() {
		alert($(this).html());
	}),
	$("#words_to_find li").click(function() {
		alert("yomama");
	}),
	$('#sync_button').click(function() {
		var text = document.getElementById("textarea").value;
		var words = text.split(" ");
		var i = 0, word = "", current_html = "", new_html = "";
		$('#words_to_find').html("");
		for (i = 0; i < words.length; i++) {
			if (words[i][0] == '#') {
				word = words[i].slice(1);
				id = word;
				word = word.replace(/_/g, " ");
				current_html = $('#words_to_find').html();
				new_html = "<li id=" + id + ">" + word + "</li>";
				$('#words_to_find').html(current_html + new_html);
			}
		}
	}),
	$('#textarea').keydown(function(event) {
		if (event.keyCode == 118) {
			$('#sync_button').click();
		}
	})
});
