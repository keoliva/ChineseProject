function show_results(i) {
	var all_li = document.querySelectorAll("ul#words_to_find li");
	var content = all_li[i].innerHTML;
	document.getElementById("word_to_find").submit();

	var arg = document.getElementsByClassName("argument_str");
	arg = arg[0];
	arg.id = content;
	
	
}

function submit_word() {
	document.getElementById("word_to_find").submit();
}

function display_word(chi, pinyin, english) {
	var div = document.getElementById("word_info")
	div.innerHTML = chi + 
					' (' + pinyin + ') : <br>' +
					english
}