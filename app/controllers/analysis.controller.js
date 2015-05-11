var mongoose = require('mongoose'),
    async = require('async'),
    _ = require('lodash'),
    Enterprise = mongoose.model('Enterprise'),
    Entsrelation = mongoose.model('Entsrelation'),
    Entprerelation = mongoose.model('Entprerelation'),
    Status = require('../helpers/status'),
    search = require('./search.controller'),
    tasklist = [],
    global_list = [];

// 获取树结构数据接口
exports.getEntsRelationWithTree = function(req, res, next) {
  // 将global_list清空，否则数据会量级增加
  global_list = _.drop(global_list, global_list.length);
  var lcid = req.params.lcid;
  var request_timeout = null;
  request_timeout = setTimeout(function() {
      // request_timeout = null;
      res.json(new Status.TimeOutError('Request timeout.'));
  }, 20000);
  getEnterpriseAndEntrelation(lcid, function(err) {
      // console.log(results);
      if (err) {
          clearTimeout(request_timeout);
          res.json(new Status.NotFoundError('Not found results.'))
      } else {
        clearTimeout(request_timeout);
        // res.json(new Status.SuccessStatus('Find success.', global_list));
        res.json(new Status.SuccessStatus('Find success.', parseToTreeData(lcid, global_list)));
      }
  })
}

// 获取行业结构图接口
exports.getEntsRelationWithChart = function(req, res, next) {
  global_list = _.drop(global_list, global_list.length);
  console.log(global_list);
  var lcid = req.params.lcid;
  var request_timeout = null;
  request_timeout = setTimeout(function() {
      // request_timeout = null;
      res.json(new Status.TimeOutError('Request timeout.'));
  }, 20000);
  getEnterpriseAndEntrelation(lcid, function(err) {
      // console.log(results);
      if (err) {
          clearTimeout(request_timeout);
          res.json(new Status.NotFoundError('Not found results.'))
      } else {
        clearTimeout(request_timeout);
        res.json(new Status.SuccessStatus('Find success.', parseToChart(lcid, global_list)));
      }
  })
}

// 将数据转化为树状图所需的结构
var parseToTreeData = function(lcid, global_list) {
  var treedata = {};
  // console.log(global_list);
  // 遍历每个节点的children，并且递归调用
  var traversalTreeData = function(children) {
    _.forEach(global_list, function(obj, i) {
      _.forEach(children, function(child) {
        if(obj.parent && obj.parent.lcid == child.enttarget) {
          for(key in obj.parent) {
            child[key] = obj.parent[key];
          }
          if(obj.children.length > 0) {
            child.children = _.cloneDeep(obj.children);
          }
          traversalTreeData(child.children)
        }
      })
    })
  }
  // 从根节点开始
  _.forEach(global_list, function(obj, i) {
    if(obj.parent && obj.parent.lcid == lcid) {
      for(key in obj.parent) {
        treedata[key] = obj.parent[key];
      }
      treedata.children = _.cloneDeep(obj.children);
      traversalTreeData(treedata.children)
    }
  })
    

  return treedata;
}
// 将原数据转化为行业结构图所需要的数据
// 数据形式为d3 layout force的数据结构
var parseToChart = function(lcid, global_list) {
  var chartData = {};
  var deep = 1;
  chartData.nodes = [];
  chartData.links = [];
  // chartData.investments = [];
  _.forEach(global_list, function(obj, i) {
    if(obj.children && obj.children.length > 0) {
      _.forEach(obj.children, function(child) {

        chartData.links.push(child);
      })
    }
    // if(obj.investment && obj.investment.length > 0) {
    //   _.forEach(obj.investment, function(invest) {
    //     chartData.investments.push(invest);
    //   })
    // }
  })
  //  给节点增加deep属性
  var addDeep = function(children) {
    _.forEach(global_list, function(node) {
      _.forEach(children, function(child) {
        if (node.parent && node.parent.lcid == child.enttarget) {
          var prenode = _.first(_.filter(chartData.nodes, function(node) {
            return node.lcid == child.entsource;
          }))
          node.parent.deep = prenode.deep + 1;
          node.parent.investment = {};
          node.parent.investment = node.investment;
          chartData.nodes.push(node.parent);
          addDeep(node.children);
        }
      })
    })
  }

  _.forEach(global_list, function(obj, i) {
    if(obj.parent && obj.parent.lcid == lcid) {
      obj.parent.investment = {};
      obj.parent.investment = obj.investment;
      obj.parent.deep = deep;
      chartData.nodes.push(obj.parent)
      addDeep(obj.children);
    }
    // if(obj.investment && obj.investment.length > 0) {
    //   _.forEach(obj.investment, function(invest) {
    //     chartData.investments.push(invest);
    //   })
    // }
  })

  return chartData;
}
// 查询企业的详细信息和它的投资关联企业
var getEnterpriseAndEntrelation = function(lcid, callback) {
  // 将tasklist清空
  tasklist = _.drop(tasklist, tasklist.length);
  async.parallel({
      parent: function(cb) {
        search.getEnterpriseLocal(lcid, cb);
      },
      children: function(cb) {
        search.getMaininvestLocal(lcid, cb);
      },
      // 股东关系
      investment: function(cb) {
        search.getInvestmentLocal(lcid, cb);
      }
  }, function(err, results) {
      if(err) {
        callback(err);
      } else {
        // 如果有投资的关联公司，就继续查询
        if(results.children.length > 0) {
          tasklist = _.map(results.children, function(ent) {
            return ent.enttarget;
          })
          // 递归查询并且保存,直到没有关系公司为止  
          async.each(tasklist, getEnterpriseAndEntrelation, function(err) {
            if(err) {
              console.log('query data failed.');
              callback(err);
            } else {
              console.log('query data success.')
              // 将数据push到全局数组里面
              global_list.push(results);
              callback(null);
            }
          })
        // 如果没有就返回结果
        } else {
          console.log("have no children.");
          global_list.push(results);
          callback(null);
        }
      }
  })
}


