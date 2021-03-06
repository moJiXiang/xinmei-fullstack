var express = require('express');
var glob = require('glob');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var compress = require('compression');

var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var methodOverride = require('method-override');
var exphbs  = require('express-handlebars');
var hbshelpers = require('../app/helpers/hbshelpers');
var middleware = require('../app/helpers/middleware');

module.exports = function(app, config) {
  var hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: config.root + '/app/views/layouts/',
    partialsDir: [config.root + '/app/views/partials/', config.root + '/app/views/templates'],
    helpers: hbshelpers
  })
  app.engine('handlebars', hbs.engine);
  app.set('views', config.root + '/app/views');
  app.set('view engine', 'handlebars');

  var env = process.env.NODE_ENV || 'development';
  app.locals.ENV = env;
  app.locals.ENV_DEVELOPMENT = env == 'development';

  app.use(favicon(config.root + '/public/img/favicon.ico'));
  app.use(logger('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(multer({
    dest : './userfiles/',
    onFileUploadStart: function(file) {
      console.log(file.originlname + ' is starting...');
    },
    onFileUploadComplete: function(file) {
      console.log(file.fieldname + ' uploaded to ' + file.path);
      done=true;
    }

  }));
  
  app.use(cookieParser());

  app.use(session({
    secret: 'user_id',
    ttl: 14 * 24 * 60 * 60,
    store: new MongoStore({
      mongooseConnection: mongoose.connection
    })
  }))
  
  app.use(compress());
  app.use(express.static(config.root + '/public'));
  app.use(methodOverride());

  var apis = glob.sync(config.root + '/app/apis/*.js');
  apis.forEach(function (route) {
    require(route)(app);
  });

  app.all('/*', middleware.requireUser);
  var routes = glob.sync(config.root + '/app/routes/*.js');
  routes.forEach(function (route) {
    require(route)(app);
  });

  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  if(app.get('env') === 'development'){
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err,
        title: 'error'
      });
    });
  }

  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
      });
  });

};
