var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  spider = require('../controllers/spider.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
};

router.post('/spider', spider.listSearchFromEngine)