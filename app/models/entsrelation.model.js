var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

/**
 * 企业与企业的关系model
 * @param {String} entsource 投资方,储存企+id号
 * @param {String} enttarget 被投资企业,储存企+id号
 * @param {String} entname 企业名称
 */
var EntsrelationSchema = new Schema({
	entsource: String,
	enttarget: String,
	entname: String,
});

// 在保存数据之前先检查是否存在，如果存在跳过
EntsrelationSchema.pre('save', function(next) {
	var self = this;
	mongoose.model('Entsrelation').findOne({entsource: this.entsource, enttarget: this.enttarget})
		 .exec(function(err, result) {
		 	if(err) {
		 		next(err);
		 	} else if(result) {
		 		// console.log(result.entname + ' Entsrelation has been saved!')
		 		next(new Error(result.entname + " Entsrelation Must specify!"));
		 	} else {
		 		next();
		 	}
		 })
})

mongoose.model('Entsrelation', EntsrelationSchema);
