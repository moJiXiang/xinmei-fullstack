var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri;

module.exports = function (app) {
  app.use('/', router);
};

router.get('/register', function(req, res, next) {
	res.render('register');
})

router.get('/login', function(req, res, next) {
	res.render('login');
})