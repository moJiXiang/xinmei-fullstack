// words model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * [SearchkeywordSchema description]
 * @type {Schema}
 * @param {Boolean} isbdsearched 0:未被加到任务列表，1:正在被查询，2:查询完毕
 * @param {Boolean} isglsearched 0:未被加到任务列表，1:正在被查询，2:查询完毕
 * @param {Boolean} issgsearched 0:未被加到任务列表，1:正在被查询，2:查询完毕
 */
var SearchwordSchema = new Schema({
  main : String, // 主体：公司或者人
  keyword: String, // 关键词
  word: String, // 补充关键词团
  kw: String,
  isbdsearched: {type: Number, default: 0},
  isglsearched: {type: Number, default: 0},
  issgsearched: {type: Number, default: 0}
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

