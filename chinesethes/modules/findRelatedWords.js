// findRelatedWords.js
var Word = require('../models/word.js');
var request = require('request');

exports.findRelatedWords = function (words, phrase, cb) {
	request("https://api.datamuse.com/words?ml=" + phrase, function (error, response, body) {
		var regexp = /"word":"([a-z]*)/g;
		var match = regexp.exec(body);
		console.log(match);
		var expressions = [];
		while (match != null) {
			var word = match[1];
			console.log("synonym: " + word);
			expressions.push(word);
			match = regexp.exec(body);
		}
		cb(expressions);
	});
	
}