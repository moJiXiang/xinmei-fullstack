var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  httphelps = require('../helpers/httphelps');

module.exports = function (app) {
  app.use('/', router);
};
  
router.get('/', function(req, res, next) {
  httphelps.get(apiBaseUri + '/articles', function(results) {
		res.render('index');
  })
})

// router.post('/searchpage', function(req, res, next) {
//   var searchval = req.body.searchval;
//   httphelps.get(apiBaseUri + '/search/' + searchval , function(results) {
//     res.render('searchpage')
//   })
// })


