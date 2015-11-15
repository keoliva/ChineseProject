// signuplogin.js
var User = require('../models/user.js');

exports.authenticateUser = function(email, password, callback) {
	User.findOne({ email: email }, function(err, user) {
		if (user) {
			user.comparePassword(password, function(err, isSame) {
				if (isSame) {
					callback(err, user);
				} else {
					callback(err, null);
				}
			});
		} else {
			callback(err);		
		}
	});
};

exports.createUser = function(name, email, password, callback) {
	User.findOne({ email: email }, function(err, user) {
		if (user) {
			callback("There's already an account with this email address.");
		} else {
			User.create({ name: name, email: email, password: password }, function(err, user) {
				callback(err, user);
			});
		}
	});
};
