function show_results(i) {
	var all_li = document.querySelectorAll("ul#words_to_find li");
	var content = all_li[i].innerHTML;

	var arg = document.getElementsByClassName("argument_str");
	arg = arg[0];
	arg.id = content;
	
	var table = document.getElementById("scrollableArea")
}