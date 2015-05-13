var mongoose = require('mongoose'),
	Promise = require('bluebird'),
	User = mongoose.model('User'),
    Status = require('../helpers/status'),
	tools = require('../helpers/tools'),
	validator = require('validator'),
	bcrypt = require('bcrypt'),
	authentication;

authentication = {
	generateToken : function() {},
	regist: function(req, res, next) {
		var name = validator.trim(req.body.name).toLowerCase();
	    var email = validator.trim(req.body.email).toLowerCase();
		var pass = validator.trim(req.body.pass);
	    var repass = validator.trim(req.body.repass);
	    console.log(name, email, pass, repass);
	 	pass = tools.bhash(pass);

	 	var user = new User({
	 		name: name,
	 		email: email,
	 		pass: pass
	 	});
	 	user.save(function(err, result) {
	 		if (err) {
		          res.json(new Status.NotFoundError(err))
		      } else {
		          res.json(new Status.SuccessStatus('Save success.', result));
		      }
	 	})
	},
	login: function(req, res, next) {
		var email = validator.trim(req.body.email).toLowerCase();
		var pass = validator.trim(req.body.pass).toLowerCase();

		User.findOne({email: email})
			.lean()
			.exec(function(err, result) {
				if(err) {
		            res.json(new Status.SystemError(err))
			    } 

			    if (result) {
					bcrypt.compare(pass, result.pass, function(err, isequal) {
						if(isequal) {	
							res.json(new Status.SuccessStatus('Login success', result));
						}
					})				
			    } else {
		            res.json(new Status.SystemError('该用户未注册!'));
			    }
			})
	}
}

module.exports = authentication;
