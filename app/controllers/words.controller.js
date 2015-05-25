var mongoose = require('mongoose'),
    Words = mongoose.model('Words'),
    Status = require('../helpers/status');

exports.list = function(req, res, next) {
  Words.find({})
    .lean()
    .exec(function(err, results) {
      if (err) {
          res.json(new Status.NotFoundError('Save Failed'))
        } else {
          res.json(new Status.SuccessStatus('Save success.', results));
        }
    })
}
exports.savekw = function(req, res, next) {

  var keyword = req.body.kw
  var word = new Words()

  word.keyword = keyword
  word.save(function(err, result) {
  	if (err) {
  		res.json(new Status.NotFoundError('Save Failed'))
  	} else {
  		res.json(new Status.SuccessStatus('Save success.', result));
  	}
  })
}

exports.savewords = function(req, res, next) {
  var kw = req.body.kw
  var words = req.body.words

  wordsarr = words.split('|')
  console.log(wordsarr);
  Words.update({keyword: kw}, {$addToSet: {words: {$each: wordsarr}}})
    .exec(function(err, result) {
      if (err) {
        res.json(new Status.NotFoundError('Save Failed'))
      } else {
        res.json(new Status.SuccessStatus('Save success.', result));
      }
    })
    
}

exports.delword = function(req, res, next) {
  var kw = req.body.kw
  var word = req.body.word
  var wordarr = []
  wordarr.push(word)
  Words.update({keyword: kw}, {"$pullAll":{words: wordarr}})
    .exec(function(err, result) {
        if (err) {
          res.json(new Status.NotFoundError('Save Failed'))
        } else {
          res.json(new Status.SuccessStatus('Save success.', result));
        }
      })

}