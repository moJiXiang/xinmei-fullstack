var express = require('express'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Enterprise = mongoose.model('Enterprise'),
  Entsrelation = mongoose.model('Entsrelation'),
  router = express.Router(),
  fs = require('fs'),
  async = require('async'),
  _ = require('lodash'),
  iconv = require('iconv-lite'),
  Status = require('../helpers/status'),
  apiBaseUri = require('../../config/config').apiBaseUri;

module.exports = function (app) {
  app.use('/user', router);
};

router.get('/', function(req, res, next) {
	res.render('user');
})

// TODO: 加上用户ID，将文件存入到用户的entfile中
router.post('/fileupload', function(req, res, next) {
	if(done==true) {
		res.send(new Status.FileuploadStatus('Fileupload success', req.files.uploadctl.originalname));
	}
})

router.get('/deep', function(req, res, next) {
	// 深度查询
	var ans = []
	var deepFindEnt = function(lcid, deep) {

		Entsrelation.find({entsource: lcid})
			.exec(function(err, results) {
				console.log(results);
				if(results.length) {
					for (var i = 0; i < results.length; i++) {
						deepFindEnt(results[i].enttarget, deep + 1)
					};
				} else {
					ans.push(deep);
					realdeep = _.max(ans)
				}
				// return realdeep
			})
	}

	var d = deepFindEnt("12019300122006021500010120000", 0)
	console.log(d);
})

router.get('/analysisfile', function(req, res, next) {
	fs.readFile('./userfiles/6eb71006f58fdbd4a4343859aa50db4b.txt', function(err, data) {
		if(err) throw err;

		var str = iconv.decode(data, 'utf8');
		var entnames = _.uniq(str.split('\n'));
		console.log(str.split('\n'));
		async.map(entnames, function(entname, cb) {

			async.waterfall([
				function(callback) {
					Enterprise.findOne({entname: entname})
						.lean()
						.exec(function(err, result) {
							if(result) {
								callback(null, result);
							} else {
								cb(null)
							}
						})
				},
				function(ent, callback) {
					var obj = {}
					obj.entname = ent.entname
					obj.lcid = ent.lcid
					Entsrelation.find({entsource: ent.lcid})
						.lean()
						.exec(function(err, results) {
							obj.relationentsnum = results.length
							var relentnames = _.map(results, function(r){ return r.entname });
							var count = 0
							for (var i = 0; i < relentnames.length; i++) {
								if (entnames.indexOf(relentnames[i]) > 0) {
									count ++
								}
							};
							obj.thislistrelationnum = count
							callback(null, obj);
						})
				},
				function(obj, callback) {
					// 深度查询
					var ans = -1
					var deepFindEnt = function(lcid, deep) {

						Entsrelation.find({entsource: lcid})
							.exec(function(err, results) {
								if(results) {
									for (var i = 0; i < results.length; i++) {
										deepFindEnt(results.lcid, deep + 1)
									};
								} else {
									ans = _.max(ans, deep)
								}
							})
					}

					deepFindEnt(obj.lcid, 0)

				}

			], function(err, result) {
				cb(null, result)
			})
			
		}, function(err, results) {
			res.json(results);
		})

	})
})