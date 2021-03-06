// Example model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var SearchdocSchema = new Schema({
  domain: String, // 1 :baidu, 2: google, 3: sogou
  kwid: ObjectId,
  kw: String,
  title: String,
  url: String,
  brief: String,
  sourceurl : String,
  score: Number, // 最高12分
  rank: String,
  content: String
});

// 在保存数据之前先检查是否存在，防治重复保存
SearchdocSchema.pre('save', function(next) {
	var self = this;
	mongoose.model('Searchdoc').findOne({lcid: this.lcid, title: this.title})
		.exec(function(err, result) {
			if(err) {
				next(err);
			} else if (result) {
				next(new Error("Searchdoc Must be specify!"))
			} else {
				next();
			}
		})
})

SearchdocSchema.statics = {
	list: function(options, cb) {
		var criteria = options.criteria || {};
		this.find(criteria)
			.limit(options.limit || 10)
			.skip(options.offset * (options.limit || 10) || 0)
			.exec(cb)
	}
}

mongoose.model('Searchdoc', SearchdocSchema);

