// 专门的接口用来从企＋app上面下载数据
var mongoose = require('mongoose'),
    Enterprise = mongoose.model('Enterprise'),
    Entsrelation = mongoose.model('Entsrelation'),
    Entprerelation = mongoose.model('Entprerelation'),
    request = require('request'),
    Status = require('../helpers/status'),
    async = require('async'),
    sleep = require('sleep'),
    _ = require('lodash'),
    cp = require('child_process'),
    search = require('./search.controller'),
    Qy = 'http://app.entplus.cn',
    second = 1;

// 组织结构化的数据返回
exports.listAnalysisResult = function(req, res, next) {
	Enterprise.list({criteria: {name: {$regex:searchval}}}, function(err, l) {
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', results));
		}
	})
}

/**
 * 从企+上面得到单个企业信息
 * @return {Object}        返回统一的状态信息
 * {
 * 	meta : {
 * 		code: 200,
 * 		message: {String}
 * 	},
 * 	@param {String} lcid 该公司的id
 * 	@param {String} fei_entname 公司名
 * 	data : {
 * 		"lcid": "440301001012014111002207440000",
 *      "fei_entname": "中债商业保理有限公司",
 *      ... 
 * 	}
 * }
 */
exports.fQyGetEnterprise = function(req, res, next) {
	var lcid = req.params.lcid;

	getEnterprise(lcid, function(err, results) {
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', results));
		}
	})
}

var getEnterprise = function(lcid, cb) {
	// 暂停1秒钟，防止抓取爬虫挂掉
	sleep.sleep(second);
	var url = Qy + '/company/fQyEnterprisebaseinfo';
	var options = initRequestOption({lcid: lcid}, url);

	request(options, function(err, response, body) {
		if(err) {
			cb(err);
		} else {
			var msg = JSON.parse(body).data;
			cb(null, msg);
		}
	})
}

// 从企+上面得到投资的相关企业信息
/**
 * 从企+上面得到投资的相关企业信息		
 * @return {Object}        统一的状态信息
 * {
 * 	meata :{
 * 		code: 200,
 * 		message: {String}
 * 	},
 * 	@param {String} lcid 投资它的公司，这里为中新恒超
 * 	@param {String} sub_lcid 该公司的id
 * 	data: [{
 * 		"lcid": "4106B7781E544C9E9FA08DEFCD55C270110000",
		"entname": "中债商业保理有限公司",
		"regcap": "10000",
		"esdate": "2014-11-10",
		"sub_lcid": "440301001012014111002207440000",
		"s_ext_nodenum": "440000",
		"industryco": "0000"
 * 	}]
 * }
 */
exports.fQyGetMainInvestList = function(req, res, next) {
	var lcid = req.params.lcid;

	getMainInvest(lcid, function(err, results) {
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', results));
		}
	})
}

var getMainInvest = function(lcid, cb) {
	// 暂停1秒钟，防止抓取爬虫挂掉
	sleep.sleep(second);
	var url = Qy + '/company/fQyMaininvestList';
	var options = initRequestOption({lcid: lcid}, url);

	request(options, function(err, response, body) {
		if(err) {
			cb(err);
		} else {
			var companylist = JSON.parse(body).data.list;
			cb(null, companylist);
		}
	})
}
// 得到股东
exports.fQyGetInvestMent = function(req, res, next) {
	var lcid = req.params.lcid;

	getInvestMent(lcid, function(err, results) {
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', results));
		}
	})
}

var getInvestMent = function(lcid, cb) {
	sleep.sleep(second);
	var url = Qy + '/company/fQyInvestmentList';
	var options = initRequestOption({lcid: lcid}, url);
	
	request(options, function(err, response, body) {
		if(err) {
			cb(err);
		} else {
			var companylist = JSON.parse(body).data.list;
			cb(null, companylist);
		}
	})
}

// 从企+得到分支机构
exports.fQyGetFzjg = function(req, res, next) {
	var lcid = req.params.lcid;

	getFzjg(lcid, function(err, results) {
		if (err) {
			res.json(new Status.NotFoundError('Not found results.'))
		} else {
			res.json(new Status.SuccessStatus('Find success.', results));
		}
	})
}

var getFzjg = function(lcid, cb) {
	var url = Qy + '/company/fQyFzList';
	
	var options = initRequestOption({lcid: lcid}, url);
	request(options, function(err, response, body) {
		if(err) {
			cb(err);
		} else {
			var companylist = JSON.parse(body).data.list;
			cb(null, companylist);
		}
	})
}

// 初始化对企＋的请求头
var initRequestOption = function(criteria, url) {
	var data = {
	    appKey: (null),
	    appVersion: "1.3.3",
	    imei: "D8F479E6-37E5-41EC-8451-BC7DECFC1484",
	    os: "iPhone OS",
	    page: 1,
	    rows: 100,
	    type: "全部",
	    osVersion: "8.0.2",
	    sourceId: (null),
	    userId: "ff8080814cb72494014cb7254ae40000",
	    ver: (null)
	};
	for(key in criteria) {
		data[key] = criteria[key];
	}
	var headers = {
	    'Host': 'app.entplus.cn',
	    'Content-Type': 'application/x-www-form-urlencoded',
	    'Connection': 'keep-alive',
	    'Accept': '*/*',
	    'User-Agent': 'Entplus/1.3.3 (iPhone; iOS 8.0.2; Scale/2.00)',
	    'Accept-Language': 'en;q=1, zh-Hans;q=0.9',
	    'Accept-Encoding': 'gzip, deflate',
	    'Cookie': 'JSESSIONID=9B39A310056ABB46CBFEFB53F13A90BD',
	};
	var options = {
	    hostname: 'app.entplus.cn',
	    url: url,
	    method: "POST",
	    headers: headers,
	    form: data
	};

	return options;
}

	exports.loadQyEnterpriseData = function(req, res, next) {
		// 根公司的id
		var root = req.params.lcid;
		// var asyncTask = [];
		console.log(cluster.isMaster);
		//将cpu 密集型的查询放到工作线程中
		getEnterAndRelationThenSave(root, function(err) {
			if (err) {
				res.json(new Status.NotFoundError(err.message))
			} else {
				res.json(new Status.SuccessStatus('Load Data success.'));
			}
		})
	}
	var getEnterAndRelationThenSave = function(lcid, callback) {
		async.parallel([
			function(cb) {
				getEnterpriseAndSave(lcid, cb);
			},
			function(cb) {
				getEntsRelationAndSave(lcid, cb);
			},
			function(cb) {
				getEntpreRelationAndSave(lcid, cb);
			}
		], function(err, results) {
			if(err) {
				callback(err);
			} else {
				// 递归查询并且保存,直到没有关系公司为止	
				
				async.waterfall([
					function(cb) {
						search.getMaininvestLocal(lcid, function(err, results) {
							if(err) {
								cb(err);
							} else{
								
								var tasklist = _.map(results, function(result) {
									return result.enttarget;
								})
								cb(null, tasklist);
							}
						});
					},
					function(tasklist, cb) {

						async.each(tasklist, getEnterAndRelationThenSave, function(err) {
							if (err) {
								cb(err);
							} else {
								cb(null);
							}
						})
					}
				], function(err, results) {
					if (err) {
						callback(err);
					} else {
						callback(null);
					}
				})
			}
		})
	}
	/**
	 * 得到一个公司的具体信息并保存到数据库中
	 * @param  {String}   lcid     公司的企+id
	 * @return {Object}            返回保存后的信息
	 */
	var getEnterpriseAndSave = function(lcid, callback) {
		async.waterfall([
			function(cb) {
				getEnterprise(lcid, function(err, result) {
					if(err) {
						cb(err);
					} else {
						console.log(result.fei_entname);
						cb(null, result);
					}
				})
			},
			function(enterprise, cb) {
				saveEnterprise(enterprise, function(err, result) {
					if(err) {
						cb(err);
					} else {
						cb(null, result);
					}
				})
			}
		], 
		function(err, result) {
			if(err) {
				callback(err);
			} else {
				callback(null, result);
			}
		})
	}

	var saveEnterprise = function(enterprise, callback) {
		var one = new Enterprise();

		one.lcid = enterprise.lcid;
		one.entname = enterprise.fei_entname;
		one.address = enterprise.fei_oploc;
		one.regno = enterprise.fei_regno;
		one.corporation = enterprise.epp_name;
		one.entindustry = enterprise.fei_industryphyname;
		one.enttype = enterprise.fei_enttypename;
		one.entstatus = enterprise.fei_entstatusname;
		one.regorg = enterprise.fei_regorgname;
		one.regcap = enterprise.fei_regcap;
		one.regcapcur = enterprise.fei_regcapcurname;
		one.esdate = enterprise.fei_esdate;

		one.save(callback);
	}
	/**
	 * 得到一个公司的所有投资公司，并且储存起来
	 * @return {obj}     返回一个状态值
	 */
	var getEntsRelationAndSave = function(lcid, callback) {
		async.waterfall([
			function(cb) {
				getMainInvest(lcid, function(err, relations) {
					if(err) {
						cb(err);
					} else {
						// 如果查找投资的公司有结果则返回tasklist列表
						// 如果没有直接返回callback函数
						if(relations.length > 0) {
							cb(null, relations);
						} else {
							callback(null);
						}
					}
				})
			},
			function(relations, cb) {

				saveEntsRelation(relations, function(err, results) {
					if(err) {
						cb(err);
					} else {
						cb(null, results);
					}
				})
				
			}
		], 
		function(err, results) {
			if(err) {
				callback(err);
			} else {
				callback(null, results);
			}
		})
	}

	var saveEntsRelation = function(relations, callback) {
		relations = _.map(relations, function(rel) {
			return {
				entsource: rel.lcid,
				enttarget: rel.sub_lcid,
				entname: rel.entname
			}
		})
		// create只能用(array, arg1, arg2, arg3)来返回所有存储结果
		Entsrelation.create(relations, callback);
	}


	/**
	 * 得到一个公司的所有股东关系，并且储存起来
	 * @return {obj}     返回一个对象值
	 */
	var getEntpreRelationAndSave = function(lcid, callback) {
		async.waterfall([
			function(cb) {
				getInvestMent(lcid, function(err, relations) {
					if(err) {
						cb(err);
					} else {
						cb(null, relations);
					}
				})
			},
			function(relations, cb) {
				saveEntpreRelation(relations, function(err, results) {
					if(err) {
						cb(err);
					} else {
						cb(null, results);
					}
				})
			}
		], 
		function(err, results) {
			if(err) {
				callback(err);
			} else {
				callback(null, results);
			}
		})
	}

	var saveEntpreRelation = function(relations, callback) {
		relations = _.map(relations, function(rel) {
			return {
				entsource: rel.sub_lcid,
				entpre: rel.eii_inv,
				conprop: rel.conprop,
				enttarget: rel.lcid,
				entname: rel.fei_enname
			}
		})
		// create只能用(array, arg1, arg2, arg3)来返回所有存储结果
		Entprerelation.create(relations, callback);
	}
// }
