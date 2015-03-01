$(function () {
	$("table td p").mousedown(function() {
		alert($(this).html());
	}),
	$("#words_to_find li").click(function() {
		alert("yomama");
	})
});
