function find() {
	var text = document.getElementById("textarea").value;
	var p = document.getElementById("demo");
	p.innerHTML = "";
	var words = text.split(" ");
	var i = 0;
	for (i = 0; i < words.length; i++) {
		if (words[i][0] == '#') {
			p.innerHTML += words[i].slice(1) + " ";
		}
	}
}
