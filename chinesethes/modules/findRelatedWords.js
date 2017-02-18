// findRelatedWords.js
var Word = require('../models/word.js');
var request = require('request');

exports.findRelatedWords = function (words, phrase, cb) {
	request("https://api.datamuse.com/words?ml=" + phrase, function (error, response, body) {
		var regexp = /"word":"([a-z]*)/g;
		var match = regexp.exec(body);
		var expressions = [phrase];
		while (match != null) {
			var word = match[1];
			expressions.push(word);
			match = regexp.exec(body);
		}
		var relatedWords = [];
		var i = 0, n = words.length;
		for(; i < n; i++) {
			words[i].relatesTo(expressions, function(relates) {
				console.log("we ouch here");
				if (relates) {
					relatedWords.push(words[i]);
				}
			});
		}
		cb(relatedWords);
	});
	
}