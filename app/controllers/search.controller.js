var mongoose = require('mongoose'),
    Enterprise = mongoose.model('Enterprise'),
    Entsrelation = mongoose.model('Entsrelation'),
    Entprerelation = mongoose.model('Entprerelation'),
    Config = mongoose.model('Config'),
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
        console.log(results);
		if(results.qy.length > 0) {

			_.forEach(results.qy, function(qre) {
				qre.status = 0;
				_.forEach(results.local, function(lre) {
					if (qre.lcid == lre.lcid) {
						qre.status = 1;
					}
				})
			})
			// _.forEach(results.local, function(lre) {
			// 			lre.status = 1;
			// 	})
			async.map(results.qy, countSearchdoc, function(err, results) {
				if (err) {
					res.json(new Status.NotFoundError('Not found results.'))
				} else {
					res.json(new Status.SuccessStatus('Find success.', results));
				}
			})
		} else {
			_.forEach(results.local, function(lre) {
						lre.status = 1;
						lre.fei_entname = lre.entname
				})
			async.map(results.local, countSearchdoc, function(err, results) {
				if (err) {
					res.json(new Status.NotFoundError('Not found results.'))
				} else {
					res.json(new Status.SuccessStatus('Find success.', results));
				}
			})
		}


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
var listSearchResultByQy = function (options, callback) {
    console.log(options);
    var enterprise = options.enterprise;
    async.waterfall([
        function(cb) {
            Config.findOne({})
                .lean()
                .exec(function(err, result) {

                	var url = Qy + '/company/fQyEnterprisebaseinfoList';
                	var data = {
                	    appKey: (null),
                	    appVersion: "1.4.5",
                	    // imei: "52138BAD-F878-4654-A123-F4B392B4B92A",
                        imei: result.imei,
                	    os: "iPhone OS",
                	    keyword: enterprise,
                	    page: 1,
                	    rows: 100,
                	    osVersion: "8.3",
                	    sourceId: (null),
                	    // userId: "ff8080814dc2b1a5014dfca131f915c2",
                        userId: result.userid,
                	    ver: (null)
                	};
                	var headers = {
                	    'Host': 'app.entplus.cn',
                	    'Content-Type': 'application/x-www-form-urlencoded',
                	    'Connection': 'keep-alive',
                	    'Accept': '*/*',
                	    'User-Agent': 'Entplus/1.3.3 (iPhone; iOS 8.0.2; Scale/2.00)',
                	    'Accept-Language': 'en;q=1, zh-Hans;q=0.9',
                	    'Accept-Encoding': 'gzip, deflate',
                	    // 'Cookie': 'JSESSIONID=5F1F6254655B935D851FD6F5F299EDB1',
                        'Cookie': 'JSESSIONID=' + result.session
                	};
                	var options = {
                	    hostname: 'app.entplus.cn',
                	    url: url,
                	    method: "POST",
                	    headers: headers,
                	    form: data
                	};
                    cb(null, options);
                })
        },
        function(options, cb) {
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
        }

    ], function(err, result) {
        callback(null, result);
    })
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
