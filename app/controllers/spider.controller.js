var mongoose = require('mongoose'),
	Searchdoc = mongoose.model('Searchdoc'),
    Status = require('../helpers/status'),
    request = require('request'),
    zlib = require('zlib'),
    _ = require('lodash'),
    sleep = require('sleep'),
    cheerio = require('cheerio');



/**
 * 从google, baidu, sougo, bing 等引擎来抓取信息数据
 */

exports.listSearchFromEngine = function(req, res, next) {
	var options = {
		"lcid": req.body.lcid,
		"wd": req.body.wd,
		"pn": '0'
	}
	new bdsearch(options, function(results) {
		res.json(new Status.SuccessStatus('Find success.', results));
	}).request();
}

// 爬虫百度
var bdsearch = exports.bdsearch = function(options, cb) {
	options = options || {};
	this.lcid = options.lcid;
	this.pn = options.pn || 0;
	this.wd = options.wd;
	this.searcharr = [];
	this.nextpage = null;
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
	var self = this;
	var $ = cheerio.load(body);
	var results = $('#content_left').find('.c-container');
	var pages = $('#page').find('a.n');
	_.forEach(pages, function(page) {
		var text = $(page).text();
		if(text.indexOf('>') >= 0) {
			self.nextpage = $(page).attr('href');
		} else {
			self.nextpage = null;
		}
	})

	var arr = [];
	_.forEach(results, function(re) {
		var obj = {
			lcid: self.lcid,
			title: $(re).find('h3.t>a').text(),
			url: $(re).find('a').attr('href'),
			brief: $(re).find('div.c-abstract').text() || $(re).find('.c-row').text()
		}
		arr.push(obj);
	})
	this.searcharr = arr;
}

// bdsearch.prototype.nextPage = function(options){
// 	var $ = cheerio.load(body);
// 	var nextpage = $(body).find('#page').find()
// };
/**
 * Save search results to storage
 * then return to search api
 */
bdsearch.prototype.saveToStorage = function(results, callback) {

	Searchdoc.create(results, function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback('Save To Storage Success!');
		}
		// Searchdoc.find()
		// 	.lean()
		// 	.exec(function(err, results) {
		// 		if (err) {
		// 			callback(err);
		// 		} else{
		// 			callback(results);
		// 		}
		// 	})
	});
}

bdsearch.prototype.request = function (nextpage) {
	var self = this;
	if (!this.wd) {
		this.callback([]);
		return;
	}

	var headers = {
		'Host': 'www.baidu.com',
		'connection': 'keep-alive',
		'accept-encoding': 'gzip,deflate,sdch',
		'accept-language': 'zh-CN,zh;q=0.8,en;q=0.6',
		'cookie':'BAIDUID=FD287C53857547B0E88CB58488BBEBFB:FG=1; BIDUPSID=FD287C53857547B0E88CB58488BBEBFB; BDUSS=EJHaVQ0ZTNrdy1lRWdIQ0pSbWhrSGxwS2tpNEM1TX53TVNlVXpjWDhpaG9LMmxWQVFBQUFBJCQAAAAAAAAAAAEAAAB9wUwOvanKrOzhz8jJ-gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGieQVVonkFVO; ispeed_lsm=0; BDRCVFR[S4-dAuiWMmn]=I67x6TjHwwYf0; BD_HOME=1; BDRCVFR[feWj1Vr5u3D]=I67x6TjHwwYf0; BD_CK_SAM=1; H_PS_PSSID=13562_1448_13693_13461_13075_12825_10812_12868_13322_10563_12723_13892_13761_13257_13780_11876_13837_13623_13085_8500; BD_UPN=123253; H_PS_645EC=f7c4LCZHHUuxGrttgRqxS%2Bg00vZ95u%2FDFdpxE1bJjDxLKoRCMkpPkRmDLBk',
		'referer': this.config.base_url
	};

	var url = nextpage ? this.config.base_url + nextpage : this.config.base_url + '/s';

	var qs = nextpage ? {} : {pn: this.pn,wd: this.wd};

	var options = {
		hostname: 'www.baidu.com',
		url: url,
		encoding: null,
		method: 'GET',
		headers: headers,
		qs: qs
	}
	// console.log(options);
	request(options, function(err, res, body) {
		sleep.sleep(2);
		if (!err && res.statusCode == 200) {
			var res_encoding = res.headers['content-encoding'];
			if (res_encoding.indexOf('gzip') >= 0) {
				zlib.unzip(body, function(err, buffer) {
					body = buffer.toString();
					self.parseResponse(body);
					self.saveToStorage(self.searcharr, function(result) {
						if(self.nextpage) {
							self.request(self.nextpage);
						} else {
							self.callback(result);
						}
					});
				})
			} else {
				self.parseResponse(body);
				self.saveToStorage(self.searcharr, function(result) {
					if(self.nextpage) {

						self.request(self.nextpage);
					} else {
						self.callback(result);
					}
				});
			}
		}
	})
}

