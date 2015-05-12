var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  httphelps = require('../helpers/httphelps');

module.exports = function (app) {
  app.use('/', router);
};
  
router.get('/', function(req, res, next) {
  // httphelps.get(apiBaseUri + '/index', function(results) {
		res.render('index');
  // })
})


