var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  analysis = require('../controllers/analysis.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
};

router.get('/analysis/:lcid/enterprisetree', analysis.getEntsRelationWithTree);
router.get('/analysis/:lcid/industrychart', analysis.getEntsRelationWithChart);