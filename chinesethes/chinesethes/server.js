var express = require('express'), app = express(), router = express.Router(),
	path = require('path');
	expressSession = require('express-session'),
	mongoUrl = db_uri = 'mongodb://localhost/chinesethesdb',
	MongoStore = require('connect-mongo')(expressSession),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	swig = require('swig'),
	mongoose = require('mongoose'),
	db = mongoose.connect(db_uri),
	currentUserName = null, userWordsQuery = null,
	errorInLogin = false, errorInSignup = false;

app.use('/static', express.static('static'));
app.engine('html', swig.renderFile);
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({ secret: 'secretstring', store: new MongoStore({ url: mongoUrl }) }));

var User = require('./models/user.js');
var Word = require('./models/word.js');

var Middleware = require('./modules/sessionMiddleware.js'); 
var getUserName = Middleware.getUserName; requireUser = Middleware.requireUser;
var SignupLogin = require('./modules/signuplogin.js'); 
var authenticateUser = SignupLogin.authenticateUser; createUser = SignupLogin.createUser;
var Edit = require('./modules/edit.js');
var removeWords = Edit.removeWords; modifyWords = Edit.modifyWords; addWords = Edit.addWords;

app.get('/', getUserName, function (req, res) {
	res.end(swig.renderFile("home.html", { name: currentUserName,
											errorInLogin: errorInLogin,
											errorInSignup: errorInSignup }));
	errorInLogin = errorInSignup = false;
});

app.get('/logout', function (req, res) {
	req.session.destroy();
	currentUserName = null;
	res.redirect('/');
});

function getWords(currentUserId, callback) {
	userWordsQuery = Word.find({ userId: currentUserId }, function(err) {
		callback();
	});
}

app.route('/edit')
	.get(requireUser, getUserName, function (req, res) {
		var userId = req.session.currentUser._id;
		getWords(userId, function() {
			userWordsQuery.exec(function(err, words) {
				res.end(swig.renderFile("edit.html", { name: currentUserName, userId: userId, words: words }));
			});
		}); 
	})
	.post(function (req, res) {
		var data = req.body;
		var newWords = data.newWords, modifiedIds = data.modifiedIds, removedIds = data.removedIds;
		var removingErr = { updatedRemovedIds: [], wordsWithError: [] }, 
			updatingErr = { indices: {}, count: 0 }, 
			addingErr = { indices: {}, count: 0 }		
		var sendErrors = function() {
			res.json({ addingErr: addingErr, updatingErr: updatingErr, removingErr: removingErr }).end();
		};
		
		var tasksDone = 0, numOfAsyncTasks = 2; //removing the words and modifying them 
		function cb(changesMade) {
			tasksDone++;
			console.log("tasksDone is being incremented");
			if (tasksDone == numOfAsyncTasks) {
				console.log("Tasks Done. Were any changes made?: " + changesMade);
				if (changesMade) {
					var currentUserId = req.session.currentUser._id;
					userWordsQuery = Word.find({ userId: currentUserId }, function(err) {
						addWords(newWords, addingErr, sendErrors);
					});
				} else {
					addWords(newWords, addingErr, sendErrors);
				}
			} 
		}
			
		removeWords(removedIds, removingErr, cb);
		modifyWords(modifiedIds, updatingErr, cb);
	});
	
app.route('/write')
	.get(requireUser, getUserName, function (req, res) {
		res.end(swig.renderFile("write.html", { name: currentUserName }));
	})
	.post(function (req, res) {
		var form = req.body;
	});
	
app.get('/find_word/:word', requireUser, getUserName, function (req, res) {
	var word = req.params.word;
	console.log("word being found: " + word);
	var words = [{ chinese: "基本", pinyin: "ji1ben3", english: "simple" },
				{ chinese: "莫非", pinyin: "mo4fei1", english: "used at end of rhetorical question" },
				{ chinese: "流行", pinyin: "liu2xing2", english: "popular; prevalent; fashionable"},
				{ chinese: "转发", pinyin: "zhuan3fa1", english: "transmit" }];
	res.json({ word_to_find: word, words: words }).end();
});

app.post('/login', function (req, res) {
		var form = req.body;
		console.log(req.body);
		var email = form.email;
		var password = form.password;
		
		authenticateUser(email, password, function(err, user) {
			console.log("error: " + err);
			console.log("user: " + user);
			if (err || !user) {
				errorInLogin = true;
				res.redirect('/');
			} else if (user) {
				req.session.currentUser = user;
				currentUserName = user.name;
				res.redirect("/");
			} 
		});
});

app.post('/signup', function (req, res) {
	var form = req.body;
	var name = form.name;
	var email = form.email;
	var password = form.password;
	
	createUser(name, email, password, function(err, user) {
		if (err) {
			errorInSignup = true;
			res.redirect('/');
		} else {
			req.session.currentUser = user;
			currentUserName = user.name;
			res.redirect('/');
		}
	});
});

var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('App listening at http://%s:%s', host, port);
});