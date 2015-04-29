var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;
/**
 * 企业家model
 * @type {Schema}
 * @param {String} name 名字
 * @param {String} ideno 身份证号 (identity card)
 * @param {String} resume 简历
 */
var EntrepreneurSchema = new Schema({
	name: String,
	ideno: String,
	resume: String
});

mongoose.model('Entrepreneur', EntrepreneurSchema);
