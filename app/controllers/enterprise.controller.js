var mongoose = require('mongoose'),
    Enterprise = mongoose.model('Enterprise'),
    Status = require('../helpers/status');


exports.list = function(req, res, next) {
  Enterprise.find(function (err, results) {
    if (err) {
		res.json(new Status.NotFoundError('Not found results.'))
	} else {
		res.json(new Status.SuccessStatus('Find success.', results));
	}
  });
}
