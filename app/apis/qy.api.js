var express = require('express'),
  router = express.Router(),
  apiBaseUri = require('../../config/config').apiBaseUri,
  qy = require('../controllers/qy.controller');

module.exports = function (app) {
  app.use(apiBaseUri, router);
  // app.route(apiBaseUri + '/articles')
  // 	.get(articles.list)
};

// 从企+上面得到单个企业信息
router.get('/company/:lcid', qy.fQyGetEnterprise)
// 从企+上面得到该企业投资的主要公司
router.get('/company/:lcid/maininvest', qy.fQyGetMainInvestList);
// 从企+上面得到该企业投资的分支机构
router.get('/company/:lcid/fzjg', qy.fQyGetFzjg);
// 从企+上面得到该企业的股东
router.get('/company/:lcid/investment', qy.fQyGetInvestMent);
// 从企+上面请求并下载数据
router.post('/loadqydata', qy.loadQyEnterpriseData);

