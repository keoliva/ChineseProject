function show_results(i) {
	var ul = document.getElementById('#words_to_find');
	var all_li = document.querySelectorAll("ul#words_to_find li");
	alert(all_li[i].innerHTML);
}