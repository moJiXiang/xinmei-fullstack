var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  authentication = require('../controllers/authentication.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
  // app.route(apiBaseUri + '/articles')
  // 	.get(articles.list)
};

router.post('/authentication/regist', authentication.regist);
router.post('/authentication/login', authentication.login);