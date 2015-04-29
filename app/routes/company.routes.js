var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  httphelps = require('../helpers/httphelps');

module.exports = function (app) {
  // app.use('/', router);
  app.route('/company')
  	.get(function(req, res, next) {
     //  httphelps.get(apiBaseUri + '/articles', function(results) {
  			// res.render('index', {title: '测试', articles: results});
     //  })
      res.render('company')
  	})
};
