var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'xinmei'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/xinmei-development'
    // db: 'mongodb://192.168.14.126:27017/Xinmei'
  },

  test: {
    root: rootPath,
    app: {
      name: 'xinmei'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/xinmei-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'xinmei'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/xinmei-production'
  }
};

module.exports = config[env];
