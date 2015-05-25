var mongoose = require('mongoose'),
	Searchword = mongoose.model('Searchword'),
    Status = require('../helpers/status');


exports.list = function(req, res, next) {
  Searchword.find(function (err, results) {
    if (err) {
		res.json(new Status.NotFoundError('Not found results.'))
	} else {
		res.json(new Status.SuccessStatus('Find success.', results));
	}
  });
}

// 保存搜索关键词
exports.savesw = function(req, res, next) {
	var main = req.body.main;
	var keyword = req.body.keyword;
	var word = req.body.word;

	var one = new Searchword()
	one.main = main
	one.keyword = keyword
	one.word = word
	one.kw = '"' + main + ' ' + keyword + ' ' + word + '"'
	one.save(function(err, result) {
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', result));
		}
	})
}