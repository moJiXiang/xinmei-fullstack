var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  searchword = require('../controllers/searchword.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
};

router.get('/searchwords', searchword.list);
router.post('/searchwords', searchword.savesw);
