var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  httphelps = require('../helpers/httphelps');

module.exports = function (app) {
  app.use('/enterprise', router);
  // app.route('/enterprise')
  // 	.get(function(req, res, next) {
  //     res.render('enterprise')
  // 	})
};

router.get('/', function(req, res, next) {
      res.render('enterprise')

})
// 渲染树图页面
router.get('/:lcid/enterprisetree', function(req, res, next) {
  var lcid = req.params.lcid;
  res.render('enterprisetree', {lcid: lcid});
})
//  渲染行业图页面
router.get('/:lcid/industrychart', function(req, res, next) {
  var lcid = req.params.lcid;
  res.render('industrychart', {lcid: lcid});
})