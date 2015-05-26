var express = require('express'),
  mongoose = require('mongoose'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  db2 = require('../../config/config').db2,
  Words = mongoose.model('Words'),
  Searchword = mongoose.model('Searchword'),
  async = require('async'),
  httphelps = require('../helpers/httphelps');

// 连接到存储抓取数据的数据库
var conn = mongoose.createConnection(db2)
XinmeispidersItem = conn.model('Searchdoc', 'XinmeispidersItem')
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
    var offset = req.query.offset || 0;
    curpage = offset || 0;
    searchword = req.query.searchword
    if(searchword) {
      XinmeispidersItem.list({criteria:{kw: searchword}, offset: offset}, function(err, results) {
        res.render('searchdoc', {results: results, curpage: curpage, searchword: searchword})
      })
    } else{
      async.waterfall([
        function(callback) {
          Searchword.find({}, function(err, results) {
            callback(null, results)
          })
        },
        function(searchwords, callback) {
          async.map(searchwords, function(word, cb){
            var keyword = '"'+word.main+' '+word.keyword+' '+word.word+'"'
            XinmeispidersItem.count({kw: keyword}, function(err, num){
              var obj = {}
              obj.kw = keyword
              obj.num = num
              cb(null, obj)
            })
          }, function(err, results) {
            callback(null, results)
          })
        }
      ], function(err, results) {
          res.render('searchwordsmanage', {results: results});
        
      })
    }
    
})

