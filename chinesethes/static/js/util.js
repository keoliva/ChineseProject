// util.js
function filter(selector, selectors, query) {
	// query with or operators for terms in query
	query = query.trim().replace(/ /gi, "|");
	console.log("reached filter fn. here's the query: '" + query + "'");
	var regexp = new RegExp(query, "i"), makeVisible = false, text;
	$(selector).each(function(index, elem) {
		makeVisible = false;
		for (var i = 0; i < selectors.length; i++) {
			console.log("orig elem: " + elem);
			text = $(this).find(selectors[i]).val();
			console.log(text);
			if (text.search(regexp) >= 0) {
				console.log("made visible");
				makeVisible = true;
				break;
			}
		}
		if (makeVisible) {
			console.log("elem :" + elem);
			$(elem).show().addClass('visible')
		} else {
			$(elem).hide().removeClass('visible');
		}
	});
}