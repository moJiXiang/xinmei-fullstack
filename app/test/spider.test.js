var glob = require('glob');
var config = require('../../config/config');
var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

var should = require('should');
var bdsearch = require('../controllers/spider.controller').bdsearch;

describe('Baidu Spider', function() {
	describe('bdsearch', function() {
		it('should return 30 results', function(done) {
			var options = {
				"lcid": "12011300422006091300015120000",
				"wd": "天津海量钢材销售有限公司",
				"pn": '0'
			}
			new bdsearch(options, function(result) {
				console.log(result);
				result.should.be('Save To Storage Success!')
				done();
			}).request();
		})
	})
})
