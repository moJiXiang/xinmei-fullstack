var mongoose = require('mongoose'),
    Enterprise = mongoose.model('Enterprise'),
    Entsrelation = mongoose.model('Entsrelation'),
    Entprerelation = mongoose.model('Entprerelation'),
    Searchresult = mongoose.model('Searchresult'),
    Status = require('../helpers/status'),
    request = require('request'),
    async = require('async'),
    _ = require('lodash'),
    zlib = require('zlib'),
    sleep = require('sleep'),
    cheerio = require('cheerio'),
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
		qy: function(cb) {
			listSearchResultByQy(options, cb)
		}

	},

	function(err, results) {
		// 查找没有数据的条目,并给赋予一个有无数据的状态
		_.forEach(results.qy, function(qre) {
			qre.status = 0;
			_.forEach(results.local, function(lre) {
				if (qre.lcid == lre.lcid) {
					qre.status = 1;
					console.log(qre.fei_entname);
				} 
			})
		})
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', results.qy));
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

/**
 * 从google, baidu, sougo, bing 等引擎来抓取信息数据
 */

exports.listSearchFromEngine = function(req, res, next) {
	var options = {
		"wd": '中新恒超实业有限公司',
		"pn": '0'
	}
	new bdsearch(options, function(results) {
		res.json(new Status.SuccessStatus('Find success.', results));
	}).request();
}

// 爬虫百度
var bdsearch = function(options, cb) {
	options = options || {};
	this.pn = options.pn || 0
	this.wd = options.wd;
	this.callback = cb || function(s){};
	this.result = {
		wd: this.wd,
		pn: this.pn
	};
	this.config = {
		base_url: 'http://www.baidu.com',
		lang: 'zh-CN'
	};
};

bdsearch.prototype.parseResponse = function(body) {
	var $ = cheerio.load(body);
	var results = $(body).find('#content_left').find('.c-container');
	var arr = [];

	_.forEach(results, function(re) {
		var obj = {
			title: $(re).find('h3.t>a').text(),
			url: $(re).find('a').attr('href'),
			content: $(re).find('div.c-abstract').text() || $(re).find('.c-row').text()
		}
		arr.push(obj);
	})
	return arr;
}

bdsearch.prototype.nextPage = function(options){
	var $ = cheerio.load(body);
	var nextpage = $(body).find('#page').find()
};
/**
 * Save search results to storage
 * then return to search api
 */
bdsearch.prototype.saveToStorage = function(results, callback) {

	Searchresult.create(results, function(err, result) {
		Searchresult.find()
			.lean()
			.exec(function(err, results) {
				if (err) {
					callback(err);
				} else{
					callback(results);
				}
			})
	});
}

bdsearch.prototype.request = function () {
	var self = this;
	if (!this.wd) {
		this.callback([]);
		return;
	}
	var qs = {
		pn: this.pn,
		wd: this.wd
	};

	var headers = {
		'Host': 'www.baidu.com',
		'connection': 'keep-alive',
		'accept-encoding': 'gzip,deflate,sdch',
		'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6',
		'cookie':'BAIDUID=FD287C53857547B0E88CB58488BBEBFB:FG=1; BIDUPSID=FD287C53857547B0E88CB58488BBEBFB; BDUSS=EJHaVQ0ZTNrdy1lRWdIQ0pSbWhrSGxwS2tpNEM1TX53TVNlVXpjWDhpaG9LMmxWQVFBQUFBJCQAAAAAAAAAAAEAAAB9wUwOvanKrOzhz8jJ-gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGieQVVonkFVO; ispeed_lsm=0; BDRCVFR[S4-dAuiWMmn]=I67x6TjHwwYf0; BD_HOME=1; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; BD_CK_SAM=1; H_PS_PSSID=13562_1448_13693_13461_13075_12825_10812_12868_13322_10563_12723_13892_13761_13257_13780_11876_13837_13623_13085_8500; BD_UPN=123253; H_PS_645EC=f7c4LCZHHUuxGrttgRqxS%2Bg00vZ95u%2FDFdpxE1bJjDxLKoRCMkpPkRmDLBk',
		'referer': this.config.base_url
	};

	var options = {
		hostname: 'www.baidu.com',
		url: this.config.base_url + '/s',
		encoding: null,
		method: 'GET',
		headers: headers,
		qs: qs
	}
	// console.log(options);
	request(options, function(err, res, body) {
		sleep.sleep(1);
		if (!err && res.statusCode == 200) {
			var res_encoding = res.headers['content-encoding'];
			if (res_encoding.indexOf('gzip') >= 0) {
				zlib.unzip(body, function(err, buffer) {
					body = buffer.toString();
					self.saveToStorage(self.parseResponse(body), self.callback);
					// self.callback(self.parseResponse(body))
					// self.callback(body)
				})
			} else {
				self.saveToStorage(self.parseResponse(body), self.callback);
			}
		}
	})
}




