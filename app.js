

var express = require('express'),
  config = require('./config/config'),
  glob = require('glob'),
  mongoose = require('mongoose'),
  cluster = require('cluster'),
  cCPUs = require('os').cpus().length;

mongoose.connect(config.db);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + config.db);
});

var models = glob.sync(config.root + '/app/models/*.js');
models.forEach(function (model) {
  require(model);
});

// 使用cluster，根据系统的cpu数量来创建工人进程
if (cluster.isMaster) {
	for (var i = 0; i < cCPUs; i++ ) {
		cluster.fork();
	}
	cluster.on('online', function(worker) {
		console.log('Worker ' + worker.process.pid + ' is online.');
	});
	cluster.on('exit', function(worker, code, signal) {
		console.log('worker ' + worker.process.pid + ' died.');
	});
} else{
	
	var app = express();

	require('./config/express')(app, config);

	app.listen(config.port);
	console.log('App is running and Worker ' + cluster.worker.id + ' running!');
}
