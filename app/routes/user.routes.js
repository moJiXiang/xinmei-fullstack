var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/user', function(req, res, next) {
	res.render('user');
})
