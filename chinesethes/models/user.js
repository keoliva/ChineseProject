var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;

// userSchema maps to a MongoDB collection
// this defines the shape of documents within the 
// chinesethesdb.User collection
var userSchema = new Schema({  
	name: String,
	password: { type: String, required: true },
	email: { type: String, required: true, index: {unique: true }},
	created_at: { type: Date, default: Date.now }
});

// on every save, add the date
userSchema.pre('save', function(next) {	
	function returnPswd() {
		console.log("from fn --> " + this.password);
	}
	// get the current date
	var currentDate = new Date();
	
	// if created_at doesn't exist, add to that field
	if (!this.created_at) this.created_at = currentDate;
	
	var user = this;
	if (this.isModified('password')) {
		bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
			if (err) next(err);
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) next();
				user.password = hash;
				next();
			});
		});
	}
});

userSchema.methods.comparePassword = function(otherPassword, callback) {
	bcrypt.compare(otherPassword, this.password, function(err, isSame) {
		if (err) return callback(err);
		callback(err, isSame);
	});
};

// Models are fancy constructors compiles from Schema 
// definitions. Instances of models represent 
// documents which can be saved and retriedved from our 
// database. 
//Compile Model
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;
