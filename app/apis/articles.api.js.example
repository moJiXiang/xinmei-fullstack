var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  articles = require('../controllers/articles.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
  // app.route(apiBaseUri + '/articles')
  // 	.get(articles.list)
};

router.get('/articles', articles.list);