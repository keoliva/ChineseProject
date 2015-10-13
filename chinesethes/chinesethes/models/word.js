var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var wordSchema = new Schema({
	userId: Schema.Types.ObjectId,
	chinese: String,
	pinyin: String ,
	english: String
});

var Word = mongoose.model('Word', wordSchema);

module.exports = Word;