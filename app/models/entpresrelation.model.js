var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

/**
 * 企业家与企业的关系model
 * @param {String} entsource 企业家,储存企+id号
 * @param {String} entpre 企业家名字
 * @param {String} enttarget 被投资企业,储存企+id号
 * @param {String} conprop 股份比例
 * @param {String} entname 企业名称
 */
var EntprerelationSchema = new Schema({
	entsource: String,
	entpre: String,
	conprop: String,
	enttarget: String,
	entname: String,
});

mongoose.model('Entprerelation', EntprerelationSchema);
