function sendRequest(method, data, url, content_type, callback) {
	var xhttp = new XMLHttpRequest();
	console.log(xhttp.getAllResponseHeaders());
	xhttp.onreadystatechange = function() { callback(xhttp); };
	xhttp.open(method, url, true);
	if (content_type) xhttp.setRequestHeader("Content-Type", content_type);		
	xhttp.send(data);
};