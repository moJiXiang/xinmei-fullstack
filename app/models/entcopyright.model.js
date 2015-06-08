var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var EntcopyrightSchema = new Schema({
	id: String, // 专利id
	lcid: String,
	regnumber: String, // 注册号
	classnumber: String,
	classname: String, // 类型
	softname: String, // 软件名称
	softrefname: String,
	version: String, // 版本号
	owner: String,
});

// 在保存数据之前先检查是否存在，如果存在跳过
EntcopyrightSchema.pre('save', function(next) {
	var self = this;
	mongoose.model('Entcopyright').findOne({lcid: this.lcid})
		 .select('entname')
		 .exec(function(err, result) {
		 	if(err) {
		 		next(err);
		 	} else if(result) {
		 		mongoose.model('Entcopyright').remove({lcid: self.lcid})
		 			.exec(function(err, result) {
		 				if(err) {
		 					next(err);
		 				} else {
		 					next()
		 				}
		 			})
		 	} else {
		 		next();
		 	}
		 })
})

mongoose.model('Entcopyright', EntcopyrightSchema);
