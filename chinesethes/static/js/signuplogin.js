$(function() {
	$(document).ready(function() {
		if (errorInSignup) {
			$('.modal').modal();
			appendErrorMessage("Email","There's already an account with that email.");
		}
		if (errorInLogin) {
			$('.modal').modal();
			$('.modal-header a').click();
			appendErrorMessage("Email & Password", "Login or password invalid.");
		}
	});
	$('.modal-header a').on('click', function (e) {
		e.preventDefault();
		$("#list_of_errors").empty();
		
		$(this).parent().addClass('active');
		$(this).parent().siblings().removeClass('active');
		
		var target = $(this).attr('href');
		$('.modal-body > form').not(target).hide();
		$(target).show();
		
		var done_button = $('.modal-footer button');
		if (target == '#loginForm') {
			done_button.html("Login");
			$("#list_of_errors").empty();
		} else {
			done_button.html("Signup");
		}
		
	});
	
	$('.btn').click(function() {
		var target = $('.modal-header li.active a').attr('href');
		if (target == '#loginForm') {
			submitLogin();
		} else {
			submitSignup();
		}
	});

	function validatePassword() {
		var password = $("#password").val();
		var confirm_password = $("#confirm_password").val();
		var passwordOff = false;
		var re = new RegExp("\\w{" + password.length + "}");
		if (!(re.test(password))) {
			appendErrorMessage("Password", "Password must contain characters which include only letters, numbers and underscores.");
			passwordOff = true;
		} 
		if (!(/[a-z]/.test(password))) {
			appendErrorMessage("Password", "Password must contain at least one lower-case letter (a-z).");
			passwordOff = true;
		}
		if (!(/[A-Z]/.test(password))) {
			appendErrorMessage("Password", "Password must contain at least one upper-case letter (A-Z).");
			passwordOff = true;
		}
		if (!(/[0-9]/.test(password))) {
			appendErrorMessage("Password", "Password must contain at least one digit (0-9).");
			passwordOff = true;
		}
		if (password != confirm_password) {
			appendErrorMessage("Confirm Password", "Make sure your passwords match.");
			passwordOff = true;
		} 
		return !(passwordOff);
	}
	
	function appendErrorMessage(title, err) {
		var li = '<li><div class="alert alert-danger">' + 
				'<strong>' + title + '</strong> ' + err + '</div></li>';
		$("#list_of_errors").append(li);
	}
	
	function validEmail(email) {
		return /.+@.+[.].+/.test(email);
	}
	
	function submitLogin() {
		$("#list_of_errors").empty();
		if (!validEmail($("#login_email").val())) {
			appendErrorMessage("Email", "Not a valid email");
		} else {
			$('#loginForm').submit();
		}
	}
	
	function submitSignup() {
		$("#list_of_errors").empty();
		var canSubmit = true;
		if ($("#signup_name").val() == "") {
			appendErrorMessage("Name", "You did not include your name.")
			canSubmit = false;
		}
		if (!validEmail($("#signup_email").val())) {
			appendErrorMessage("Email", "Not a valid email");
			canSubmit = false;
		}
		if (!validatePassword()) {
			canSubmit = false;
		}	
		if (canSubmit) {
			$('#signupForm').submit();
		}
	}
});