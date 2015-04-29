var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  search = require('../controllers/search.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
  // app.route(apiBaseUri + '/articles')
  // 	.get(articles.list)
};

router.get('/search', search.listSearchResult);