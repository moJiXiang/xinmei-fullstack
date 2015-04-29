var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'restful-express'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/restful-express-development'
    // db: 'mongodb://192.168.14.126:27017/Xinmei'
  },

  test: {
    root: rootPath,
    app: {
      name: 'restful-express'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/restful-express-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'restful-express'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/restful-express-production'
  }
};

module.exports = config[env];
