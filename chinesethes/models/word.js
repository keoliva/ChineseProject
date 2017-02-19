var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var wordSchema = new Schema({
	userId: Schema.Types.ObjectId,
	chinese: String,
	pinyin: String,
	partsOfSpeech: String,
	english: String
});

wordSchema.methods.relatesTo = function(expressions, callback) {
	var i = 0, n = expressions.length;
	for (; i < n; i++) {
		if (this.english.search(expressions[i]) !== -1) {
			return callback(true);
		}
	}
	return callback(false);
}

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;