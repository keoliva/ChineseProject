// edit.js
var Word = require('../models/word.js');

exports.removeWords = function(removedIds, removingErr, cb) {
	var i = 0, id, ids = removedIds.length, changesMade = false, removedIdsCopy = removedIds.splice();
	function callback() {
		i++;
		if (i >= ids) {
			console.log("REMOVE-i: " + i + "CHANGES MADE: " + changesMade);
			removingErr.updatedRemovedIds = removedIdsCopy;
			cb(changesMade);
		} else {
			remove();
		}
	}
	console.log("removing words");
	function remove() {
		console.log("beginning of remove");
		id = removedIds[i];
		console.log("ID " + id);
		userWordsQuery.findOneAndRemove({ _id: id }, function(err, word) {
			if (err) {
				console.log("error found " + err);
				removingErr.wordsWithError.push(word);
			} else {
				if (word) changesMade = true;
				removedIdsCopy.splice(i, 1);
			}
			console.log("REMOVE - i: " + i);
			callback();
		});
	}
	if (i >= ids) return cb();
	else return remove();
};

exports.modifyWords = function(modifiedIds, updatingErr, cb) {
	var i = 0, ids = modifiedIds.length, modifiedWord, doc, changesMade = false;
	function callback() {
		i++;
		if (i >= ids) {
			console.log("MODIFY-i: " + i + "CHANGES MADE: " + changesMade);
			cb(changesMade);
		} else {		
			modify();
		}
	}
	console.log("modifying words.");
	function modify() {
		modifiedWord = modifiedIds[i];
		console.log("MODIFY - i before async func call " + i);
		doc = { chinese: modifiedWord.chinese, pinyin: modifiedWord.pinyin, partsOfSpeech: modifiedWord.partsOfSpeech, english: modifiedWord.english };
		userWordsQuery.findOneAndUpdate({ _id: modifiedWord.id }, doc, function(err, word) {
			if (err) {
				updatingErr.indices[modifiedWord.index] = true;
				updatingErr.count++;
				console.log("error found " + err);	
			} else {
				console.log("error not found in MODIFY, here's the word: " + word);
				if (word) changesMade = true;
				// there should be a word
				updatingErr.indices[modifiedWord.index] = false;
			}
			console.log("MODIFY - i: " + i);
			callback();
		});
	}
	 if (i >= ids) return cb();
	 else return modify();
};

exports.addWords = function(newWords, addingErr, cb) {
	var i = 0, ids = newWords.length, word, index;
	function callback() {
		i++;
		if (i >= ids) {
			console.log("ADD-i: " + i + "res.json(' sending errors, if any '");
			cb();
		} else {
			add();
		}
	}
	console.log("adding word");
	function add() {
		word = newWords[i];
		index = word.index;	
		delete word["index"];
		Word.create(word, function(err, newWord) {
			if (err || !newWord) {
				console.log("word.index " + index);
				addingErr.indices[index] = true;
				addingErr.count++;
			} else {
				addingErr.indices[index] = false;
			}
			console.log("ADD - i: " + i);
			callback();
		});
	}
	if (i >= ids) return cb();
	else return add();
};