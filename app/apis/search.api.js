var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  search = require('../controllers/search.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
};

router.get('/search', search.listSearchResult);
router.get('/search/engine', search.listSearchFromEngine)