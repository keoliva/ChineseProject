$(function() {
	function validEmail(email) {
		return /.+@.+[.].+/.test(email);
	}
	
	$('#submit_email').click(function() {
		var $email = $('#email');
		if (validEmail($email)) {
			$email.submit();
		} else {
			alert("This is not a valid email address.");
		}
	});
})