// words model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * [SearchkeywordSchema description]
 * @type {Schema}
 * @param {Number} status 0:未被加到任务列表，1:正在被查询，2:查询完毕
 * @param {Boolean} isbdsearched 百度是否爬过内容
 * @param {Boolean} isglsearched 谷歌是否爬过内容
 * @param {Boolean} issgsearched 搜狗是否爬过内容
 */
var SearchwordSchema = new Schema({
  main : String, // 主体：公司或者人
  keyword: String, // 关键词
  word: String, // 补充关键词团
  kw: String,
  status: {type: Number, default: 0},
  isbdsearched: {type: Boolean, default: false},
  isglsearched: {type: Boolean, default: false},
  issgsearched: {type: Boolean, default: false}
});

SearchwordSchema.pre('save', function(next) {
	var self = this
	mongoose.model('Searchword').findOne({main: this.main, keyword: this.keyword, word: this.word})
		.exec(function(err, result) {
			if (err) {
				next(err)
			} else if (result) {
				next(new Error('Hava one already'));
			} else {
				next()
			}
		})
})
mongoose.model('Searchword', SearchwordSchema);

