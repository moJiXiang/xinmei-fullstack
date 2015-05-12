var express = require('express'),
    mongoose = require('mongoose'),
    async = require('async'),
    Enterprise = mongoose.model('Enterprise'),
	Searchdoc = mongoose.model('Searchdoc'),
    search = require('../controllers/search.controller'),
    httphelps = require('../helpers/httphelps'),
    router = express.Router();

module.exports = function (app) {
  app.use('/searchdoc', router);
};

router.get('/:lcid', function(req, res, next) {
  var lcid = req.params.lcid;
  var offset = req.query.offset || 0;
  curpage = offset || 0;
  async.parallel({
  	enterprise : function(cb) {
        search.getEnterpriseLocal(lcid, cb);
  	},
  	doc : function(cb) {
  		Searchdoc.list({criteria: {lcid: lcid}, offset: offset}, cb);
  	},
  	count: function(cb) {
  		Searchdoc.count({lcid: lcid}, cb)
  	}
  }, function(err, results) {
  	res.render('searchdoc', {results: results, curpage: curpage});
  })
})