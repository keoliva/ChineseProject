function find() {
	var text = document.getElementById("textarea").value;
	var index = text.search("#");
	if (index >= 0) {
	  var n_text = text.slice(index);
      var len_of_word = n_text.search(" ");
      document.getElementById("demo").innerHTML = 
				text.substr(index+1, len_of_word); 
	} else {
		document.getElementById("demo").innerHTML = "dom";
	}
}
