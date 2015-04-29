var request = require('request'),
	config = require('../../config/config');

exports.get = function(api, cb) {
	var url = config.domain + ':' + config.port + api;
	request.get(url, function(error, response, body) {
		var result = JSON.parse(body);
		cb(result)
	})
}

module.exports = exports;