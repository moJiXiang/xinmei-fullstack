var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  words = require('../controllers/words.controller')

module.exports = function (app) {
  app.use(apiBaseUri, router);
};

router.get('/words', words.list);
router.get('/delkeyword/:id', words.delkeyword);
router.post('/savekw', words.savekw);
router.post('/savewords', words.savewords);
router.post('/delword', words.delword);