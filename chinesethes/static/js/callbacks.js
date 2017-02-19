var saveWordsCallback = function(xhttp) {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		console.log("got back from server");
		var resp = JSON.parse(xhttp.responseText);
		var removingErr = resp.removingErr, updatingErr = resp.updatingErr, addingErr = resp.addingErr;
		console.log(JSON.stringify(resp));
		$warnings = $('#warnings');
		var warnings_count = removingErr.wordsWithError.length + 
							updatingErr.count +
							addingErr.count;
		$('#warnings_count').html(warnings_count.toString());
		
		var $successMessageDiv = ($('#menu li div .alert'));
		if (warnings_count > 0) {
			$warnings.append("Some errors occured while saving your changes. You can try to resend them by clicking 'SEND'." +
				' Otherwise, Refresh the page to get the updated version of your saved words. ' +
				'<a><span class="glyphicon glyphicon-refresh" onclick="window.location.reload();">' +
				'</span></a></li>');
			if ($successMessageDiv.exists() ) $successMessageDiv.hide();
		} else {
			if ($successMessageDiv.exists() ) $successMessageDiv.show();
			else {
				$('#menu').prepend('<li><div class="alert alert-success">' + 
									'<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>Your SAVE was successful.</div></li>')
			}
		}
		
		if (removingErr.length == 0) {
			// set to the updated version, where it excludes the _ids of words that were successfully removed
			removedIds = removingErr.updatedRemovedIds;
			var result = "";
			removingErr.wordsWithError.forEach(function(word) {
				result += '<li>' + wordInfo(word) + '</li>';
			});
			$(warnings).append('<li>There was an error removing these entries:' +
								'<ul>' + result + '</ul></li>');
			
		}
		if (updatingErr.count) {
			var hasError = updatingErr.indices, $li = $('li.list-group-item.modified'), result="", selector="";
			$li.each(function(index, li) {
				if (hasError[index]) {
					chineseInput = 
					selector = '$("li.list-group-item.modified").find("div input[name=\'chinese\']")';
					word = { chinese: $(this).find('div input[name="chinese"]').val(),
							pinyin: $(this).find('div input[name="pinyin"]').val(),
							partsOfSpeech: $(this).find('div input [name="partsOfSpeech"]').val(),
							english: $(this).find('div textarea[name="english"]').val() };
					result += "<li onclick=(" + selector + ".focus())>" + wordInfo(word) + "</li>"
				} else { 
					$(this).removeClass("modified"); 
				} 
			});
			$warnings.append('<li>There was an error updating these entries:' + '<ul>' + result + '</ul></li>');
		}
		if (addingErr.count) {
			var hasError = addingErr.indices, result="", selector="";
			hasError.forEach(function(index, li) {
				if (hasError[index]) {
					selector = '$("li.list-group-item.modified").find("div input[name=\'chinese\']")';
					word = { chinese: $(this).find('div input[name="chinese"]').val(),
							pinyin: $(this).find('div input[name="pinyin"]').val(),
							partsOfSpeech: $(this).find('div input [name="partsOfSpeech"]').val(),
							english: $(this).find('div textarea[name="english"]').val() };
					result += "<li onclick=(" + selector + ".focus())>" + wordInfo(word) + "</li>"
				} else { 
					$(this).addClass("added"); 
				} 
			});
			$warnings.append('<li>There was an error adding these entries:' + '<ul>' + result + '</ul></li>');
		}
		$('.collapse').collapse();
	}
};

var filterWordsCallback = function(xhttp) {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		// resp should be an array of words
		var resp = JSON.parse(xhttp.responseText), result = "";
		resp.forEach(function(word) {
			result += returnLi(word.chinese, word.pinyin, word.english);
		});
		$('#view_edit_entries').html(result);
	}
};

function display_word(e) {
	var word = $(this).data('word');
	
	var a = '<a href="http://www.iciba.com/' + word.chinese + 
		'" target="_blank">Learn more about the word.</a>';
	$('#word_info').html(a + '<br>' + word.chinese + ' (' + word.pinyin + 
		') : <br>' + word.english);
};

var getWordRecsCallback = function(xhttp) {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		var resp = JSON.parse(xhttp.responseText), result = "";	
		resp.words.forEach(function(word) {
			result += '<li class="list-group-item result" data-word=\'' + 
				JSON.stringify(word) + '\'>' 
				+ word.chinese + '</li>';
		});
		$('h3#word_to_find, #word_map').html(resp.word_to_find);
		$('#recs').html(result);
		
		$('.result').each(function() {
			$(this).on("click", display_word);
		});
	}
};

var uploadToOCRCallback = function (xhttp) {
	if (xhttp.readyState == 4 && xhttp.status == 200) {
		var resp = JSON.parse(xhttp.responseText);
		console.log("uploaded to OCR API!!!");
		console.log(resp);
		/**
		success: function (ocrParsedResult) {
			//Get the parsed results, exit code and error message and details
			var parsedResults = ocrParsedResult["ParsedResults"];
			var ocrExitCode = ocrParsedResult["OCRExitCode"];
			var isErroredOnProcessing = ocrParsedResult["IsErroredOnProcessing"];
			var errorMessage = ocrParsedResult["ErrorMessage"];
			var errorDetails = ocrParsedResult["ErrorDetails"];
			var processingTimeInMilliseconds = ocrParsedResult["ProcessingTimeInMilliseconds"];
			//If we have got parsed results, then loop over the results to do something
			if (parsedResults!= null) {
				//Loop through the parsed results
				$.each(parsedResults, function (index, value) {
					var exitCode = value["FileParseExitCode"];
					var parsedText = value["ParsedText"];
					var errorMessage = value["ParsedTextFileName"];
					var errorDetails = value["ErrorDetails"];

					var textOverlay = value["TextOverlay"];
					console.log(parsedText);
					$.each(textOverlay["Lines"], function (index, value) {
						//console.log(value);
					});
				});
			}
		}
	});*/
	}
};
