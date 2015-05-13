// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  pass: String
});

UserSchema.pre('save', function(next) {
	mongoose.model('User').findOne({email: this.email})
		.exec(function(err, result) {
			if(err) {
				next(err);
			} else if (result) {
				next(new Error(result.name + " Must be specify!"))
			} else {
				next();
			}
		})
})

UserSchema.statics = {
	
}

mongoose.model('User', UserSchema);

