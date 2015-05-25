var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  enterprise = require('../controllers/enterprise.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
};

router.get('/enterprises', enterprise.list);
