$(function () {
	$("textarea").keypress(function() {
		var text = $("#textarea").val();
		var index = text.search("#");
		if (index >= 0) {
			var n_text = text.slice(index);
			var len_of_word = n_text.search(" ");
			$("#demo").html(text.substr(index+1, len_of_word)); 
		} else {
			$("#demo").html("dom");
		}
	}),
	$("table td p").mousedown(function() {
		alert($(this).html());
	})
});
