var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  Words = mongoose.model('Words'),
  Searchword = mongoose.model('Searchword'),
  httphelps = require('../helpers/httphelps');

module.exports = function (app) {
  app.use('/', router);
};
  
router.get('/', function(req, res, next) {
  // httphelps.get(apiBaseUri + '/index', function(results) {
		res.render('index');
  // })
})

router.get('/wordsmanage', function(req, res, next) {
  // httphelps.get(apiBaseUri + '/index', function(results) {
    Words.find({})
      .exec(function(err, results) {

		    res.render('wordsmanage', {results: results});
      })
  // })
})

router.get('/searchwordsmanage', function(req, res, next) {
  // httphelps.get(apiBaseUri + '/index', function(results) {
    Searchword.find({})
      .exec(function(err, results) {

        res.render('searchwordsmanage', {results: results});
      })
  // })
})

