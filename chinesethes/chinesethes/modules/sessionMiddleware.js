// middleware that makes sure the curret user's name is stored 
// in variable currentUserName
exports.getUserName =  function(req, res, next) {
	var currentUser = req.session.currentUser;
	if (currentUser) {
		currentUserName = currentUser.name;
	}
	next();
};
// This is a middleware that we will use on routes where
// we require that a user is logged in
exports.requireUser = function(req, res, next){
	if (!req.session.currentUser) {
		res.redirect('/');
	} else {
		next();
	}
};
