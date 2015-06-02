var mongoose = require('mongoose'),
    Enterprise = mongoose.model('Enterprise'),
    Entsrelation = mongoose.model('Entsrelation'),
    Entprerelation = mongoose.model('Entprerelation'),
    Searchdoc = mongoose.model('Searchdoc'),
    Status = require('../helpers/status'),
    request = require('request'),
    async = require('async'),
    _ = require('lodash'),
    Qy = 'http://app.entplus.cn';

/**
 * listSearchResult by criteria of post request body
 * {
 * 		meta: {
 * 			code: 404,
 * 			message: 'Not found.'
 * 		}
 * }
 * @return {Object}        如果有错误返回404错误
 * 
 * {
 * 		meata : {
 * 			code: 200,
 * 			message: 'Find success.'
 * 		},
 * 		data : [Array]
 * }
 * @return {Object}        如果没有错返回结果数组
 */

exports.listSearchResult = function(req, res, next) {
	var options = {
		enterprise : req.query.enterprise,
		page: req.query.offset,
		rows: req.query.limit	
	}
	// 需要调用两个查询接口,调用本地的接口返回一个本地是否有数据的状态
	async.parallel({
		local: function(cb) {
			Enterprise.list({criteria: {entname: {$regex:options.enterprise}}}, cb)
		},
		// qy: function(cb) {
		// 	listSearchResultByQy(options, cb)
		// }

	},

	function(err, results) {
		// 查找没有数据的条目,并给赋予一个有无数据的状态
		// _.forEach(results.qy, function(qre) {
		// 	qre.status = 0;
		// 	_.forEach(results.local, function(lre) {
		// 		if (qre.lcid == lre.lcid) {
		// 			qre.status = 1;
		// 		} 
		// 	})
		// })
		_.forEach(results.local, function(lre) {
					lre.status = 1;
			})
		async.map(results.local, countSearchdoc, function(err, results) {
			if (err) {
				res.json(new Status.NotFoundError('Not found results.'))
			} else {
				console.log(results);
				res.json(new Status.SuccessStatus('Find success.', results));
			}
		})


	})
}

var countSearchdoc = function(ent, cb) {
	Searchdoc.count({lcid: ent.lcid}, function(err, count) {
		if(err) {
			cb(err);
		} else {
			ent.count = count;
			cb(null, ent);
		}
	})

}
var listSearchResultByQy = function (options, cb) {
	var url = Qy + '/company/fQyEnterprisebaseinfoList';
	var data = {
	    appKey: (null),
	    appVersion: "1.3.3",
	    imei: "EF0D574C-628C-4334-9DF9-75C2AE7DDBDE",
	    os: "iPhone OS",
	    keyword: options.enterprise,
	    // page: 1,
	    // rows: 10,
	    page: options.page,
	    rows: options.rows,
	    osVersion: "8.0.2",
	    sourceId: (null),
	    userId: "ff8080814cbc7f6f014cca52197b128a",
	    ver: (null)
	};
	var proxy = {
		proxy_host: "",
		username: "",
		password: ""
	};
	var headers = {
	    'Host': 'app.entplus.cn',
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Connection': 'keep-alive',
	    'Accept': '*/*',
	    'User-Agent': 'Entplus/1.3.3 (iPhone; iOS 8.0.2; Scale/2.00)',
	    'Accept-Language': 'en;q=1, zh-Hans;q=0.9',
	    'Accept-Encoding': 'gzip, deflate',
	    'Cookie': 'JSESSIONID=6E7A6C44444C635CE411B9BAD407D446',
	};
	var options = {
	    hostname: 'app.entplus.cn',
	    url: url,
	    method: "POST",
	    headers: headers,
	    form: data
	};
	request(options, function(err, response, body) {
		if (err) {
			cb(err)
		} else {
			var list = JSON.parse(body).data.list;
			var shortlist = _.map(list, function(l) {
				return {
					lcid: l.lcid,
					fei_entname: l.fei_entname
				}
			})
			cb(null, shortlist);
		}
	});
};

// 查询本地数据库的企业
exports.getEnterpriseLocal = function(lcid, cb) {
	Enterprise.findOne({lcid: lcid})
		//parse to js object
		.lean()
		.exec(function(err, result) {
			if(err) {
				cb(err);
			} else {
				cb(null, result);
			}
		})
}
// 查询本地数据库的主要投资企业
exports.getMaininvestLocal = function(lcid, cb) {
	Entsrelation.find({entsource: lcid})
		.lean()
		.exec(function(err, result) {
			if(err) {
				cb(err);
			} else {
				cb(null, result);
			}
		})
}
// 查询本地数据库的股东
exports.getInvestmentLocal = function(lcid, cb) {
	Entprerelation.find({enttarget: lcid})
		.lean()
		.exec(function(err, result) {
			if(err) {
				cb(err);
			} else {
				cb(null, result);
			}
		})
}





