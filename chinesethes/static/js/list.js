var calls = 0;
function find() {
	var text = document.getElementById("textarea").value + " ";
	var index = text.search("#");
	var n_text = "";
	var len_of_word = 0
	var word = "";
	var p = document.getElementById("demo");
	p.innerHTML = "";
	while (index >= 0) {
		calls += 1;
		console.log("first " + text);
		n_text = text.slice(index);
		len_of_word = n_text.search(" ");
		word = text.substr(index+1, len_of_word);
		p.innerHTML = p.innerHTML + " " + word;
		text = text.slice(index + len_of_word);
		index = text.search("#");
		console.log(text);
		console.log(index);
		if (calls > 10) { debugger; }
	}
}
