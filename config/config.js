var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'production';
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'xinmei'
    },
    domain: 'http://127.0.0.1',
    apiBaseUri: '/v1/api',
    port: 3000,
    db: 'mongodb://localhost/xinmei-development',
    db2: 'mongodb://dbs:SeeFaItH4120#@119.254.108.220:7530/stock'
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
    db: 'mongodb://xinmei:xinmei@localhost/xinmei-development',
    db2: 'mongodb://dbs:SeeFaItH4120#@119.254.108.220:7530/stock'
  }
};

module.exports = config[env];
