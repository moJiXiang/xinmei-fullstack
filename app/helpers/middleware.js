var mongoose = require('mongoose'),
  User = mongoose.model('User');
/** Prevents people from accessing protected pages 
 *	when they're not signed in
 */	

exports.requireUser = function(req, res, next) {

	if (!req.session.user_id) {
		if(req.originalUrl != '/login' && req.originalUrl != '/regist') {
			res.redirect('/login');
		} else {
			next();
		}
	} else {
		console.log('===============');
		console.log(req.session.user_id);
		User.findOne({_id: req.session.user_id})
		    .lean()
		    .exec(function(err, result) {
		  		res.locals.user = result;
				next();
		    })
	}
};