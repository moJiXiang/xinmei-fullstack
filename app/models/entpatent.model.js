var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

var EntpatentSchema = new Schema({
	id: String, // 专利id
	lcid: String,
	type: String, // 专利类型
	sqh: String, // 申请号
	sqr: String, // 申请日期
	mc: String, // 专利名
	classnum: String, // 专利类型
	sqzlqr: String, // 申请专利人
	fmsjr: String, // 发明专利人
	xxjs: String, // 详细信息
	flzt: String // 法律状态
});

// 在保存数据之前先检查是否存在，如果存在跳过
EntpatentSchema.pre('save', function(next) {
	var self = this;
	mongoose.model('Entpatent').findOne({lcid: this.lcid})
		 .select('entname')
		 .exec(function(err, result) {
		 	if(err) {
		 		next(err);
		 	} else if(result) {
		 		mongoose.model('Entpatent').remove({lcid: self.lcid})
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

mongoose.model('Entpatent', EntpatentSchema);
