var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose');

// mongoose.connect(config.db);
// var db = mongoose.connection;
// db.on('error', function () {
//   throw new Error('unable to connect to database at ' + config.db);
// });

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});
var fibo = function(n) {
	return n > 1 ? fibo(n - 1) + fibo(n - 2) : 1;
}
// console.log(mongoose.model('Enterprise').find({}));
// process.on('message', function(m) {

// 	mongoose.model('Enterprise').count({})
// 		.exec(function(results) {
// 			console.log(results)
// 			console.log('Child got message:', m);
			// process.send({foo: 'bar'});
// 		})
// })
mongoose.model('Enterprise').find({})
	.exec(function(err, results) {
		process.send(results)
	})