var mongoose = require('mongoose'),
    Article = mongoose.model('Article'),
    Status = require('../helpers/status');


exports.list = function(req, res, next) {
  Article.find(function (err, results) {
    if (err) {
		res.json(new Status.NotFoundError('Not found results.'))
	} else {
		res.json(new Status.SuccessStatus('Find success.', results));
	}
  });
}
