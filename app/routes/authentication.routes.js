var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  validator = require('validator'),
  bcrypt = require('bcrypt'),
  tools = require('../helpers/tools'),
  middleware = require('../helpers/middleware'),
  apiBaseUri = require('../../config/config').apiBaseUri;
// var middleware = require('../helpers/middleware');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/regist', function(req, res, next) {
	res.render('register');
})

router.post('/regist', function(req, res, next) {
  var email = validator.trim(req.body.email).toLowerCase();
  var name = validator.trim(req.body.name).toLowerCase();
  var pass = validator.trim(req.body.pass).toLowerCase();
  var repass = validator.trim(req.body.repass).toLowerCase();
  pass = tools.bhash(pass);

  var user = new User({
    name: name,
    email: email,
    pass: pass
  })

  user.save(function(err, result) {
    if(err) {
      res.render('register', {error: error});
    } else {
      req.session.user_id = result._id;
      res.redirect('/');
    }
  })
})
// 进入登录界面
router.get('/login', function(req, res, next) {
	res.render('login');
})
// 提交登录信息
router.post('/login', function(req, res, next) {
  var email = validator.trim(req.body.email).toLowerCase();
  var pass = validator.trim(req.body.pass).toLowerCase();
  User.findOne({email: email})
    .lean()
    .exec(function(err, result) {
      if(err) {
        res.send({error: error})
      }
      if(result) {
        bcrypt.compare(pass, result.pass, function(err, isequal) {
          if(isequal) {
            req.session.user_id = result._id;
            res.redirect('/');
          }
        })
      }
    })
})

router.get('/logout', function(req, res, next) {
  req.session.destroy();
	res.redirect('/');
})