var express = require('express'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Enterprise = mongoose.model('Enterprise'),
  Entsrelation = mongoose.model('Entsrelation'),
  Config = mongoose.model('Config'),
  router = express.Router(),
  request = require('request'),
  fs = require('fs'),
  async = require('async'),
  _ = require('lodash'),
  csv = require('csv'),
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
	// var ans = []
	// var deepFindEnt = function(lcid, deep) {

	// 	Entsrelation.find({entsource: lcid})
	// 		.exec(function(err, results) {
	// 			console.log(results);
	// 			if(results.length) {
	// 				for (var i = 0; i < results.length; i++) {
	// 					deepFindEnt(results[i].enttarget, deep + 1)
	// 				};
	// 			} else {
	// 				ans.push(deep);
	// 				realdeep = _.max(ans)
	// 			}
	// 			// return realdeep
	// 		})
	// }
	// var d = deepFindEnt("12019300122006021500010120000", 0)

	request('http://localhost:3000/v1/api/analysis/12019300122006021500010120000/industrychart', function(err, response, body) {
		nodes = JSON.parse(body).data.nodes;
		deeps = _.map(nodes, function(n) {
			return n.deep;
		})
		console.log(_.max(deeps));
	})
})

// TODO:根据用户的存储的文件来分析
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
							callback(null, obj);
						})
				},
				function(obj, callback) {
					request('http://localhost:3000/v1/api/analysis/'+obj.lcid + '/industrychart', function(err, response, body) {
						nodes = JSON.parse(body).data.nodes;
						var relentnames = _.map(nodes, function(n){ return n.entname });
						var count = 0
						for (var i = 0; i < relentnames.length; i++) {
							if (entnames.indexOf(relentnames[i]) > 0) {
								count ++
							}
						};
						obj.thislistrelationnum = count
						callback(null, obj, nodes)
					})

				},
				function(obj, nodes, callback) {
					deeps = _.map(nodes, function(n) {
						return n.deep;
					})
					obj.realdeep = _.max(deeps)
					callback(null, obj)

				}

			], function(err, result) {
				cb(null, result)
			})

		}, function(err, results) {
			var text = []
			for (var i = 0; i < results.length; i++) {
				if(results[i]){
					text.push(results[i])
				}
			};

			// csv()
			// 	.from.array(text)
			// 	.to.path('./userfiles/ents.csv')

			fs.open('./userfiles/ents.txt', 'a+', function(e, fd) {
				if (e) {
					throw e;
				}
				var text = '公司 关联公司数 投资层级数 此表关联公司\n'
				for (var i = 0; i < results.length; i++) {
					if (results[i]) {

						text += results[i].entname + ' ' + results[i].relationentsnum + ' ' + results[i].realdeep + ' ' + results[i].thislistrelationnum + '\n'
					}
				};
				console.log(text);
				fs.write(fd, text, 0, 'utf-8', function(e) {
					res.end('success');
				})
			})
		})

	})
})

router.post('/setConfig', function(req, res, next) {
    var userid = req.body.userid,
        session = req.body.session,
        imei = req.body.imei;
    console.log(userid, session, imei);
    var config = new Config({
        userid: userid,
        session: session,
        imei: imei
    })

    Config.remove({}, function(err, result) {
        config.save(function(err, result) {
            res.send('success')
        })
    })
})
