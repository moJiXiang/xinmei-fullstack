var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.Types.ObjectId;

/**
 * 企业model
 * @type {Schema}
 * @param {String} lcid 企+的ID号
 * @param {String} entname 企业名称
 * @param {String} address 企业地址
 * @param {String} regno 注册号
 * @param {String} corporation 法人
 * @param {String} corporation_ref 法人表中ObjectId
 * @param {String} entindustry 企业行业
 * @param {String} enttype 企业类型，有限责任，股份制
 * @param {String} entstatus 企业状态，在营，还是倒闭 (enterprise status)
 * @param {String} regorg 注册机构 (regist origanization)
 * @param {Number} regcap 注册资金 (regist captial)
 * @param {String} regcapcur 人民币还是美元
 * @param {String} esdate 成立时间 (establish date)

 */
var EnterpriseSchema = new Schema({
	lcid: String,
	entname: String,
	address: String, // 公司地址
	oploc: String, // 注册地址
	regno: String,
	corporation: String,
	corporation_ref: {type: ObjectId, ref: 'Entrepreneur'},
	entindustry: String,
	totalscpoe: String, // 经营范围
	enttype: String,
	entstatus: String,
	regorg: String,
	regcap: Number,
	regcapcur: String,	
	esdate: String
});
// 在保存数据之前先检查是否存在，如果存在跳过
EnterpriseSchema.pre('save', function(next) {
	var self = this;
	mongoose.model('Enterprise').findOne({lcid: this.lcid})
		 .select('entname')
		 .exec(function(err, result) {
		 	if(err) {
		 		next(err);
		 	} else if(result) {
		 		// // console.log(result.entname + ' has been saved!')
		 		// next(new Error(result.entname + " Enterprise Must specify!"));
		 		mongoose.model('Enterprise').remove({lcid: self.lcid})
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

EnterpriseSchema.statics = {
	/**
	 * 根据某个条件查询一组列表
	 * @param  {Object}   options 查询条件包括翻页
	 * @return {Array}           返回一组数组
	 */
	list: function(options, cb) {
		var criteria = options.criteria || {};
		this.find(criteria)
			.limit(options.limit || 10)
			.skip(options.offset * (options.limit || 10) || 0)
			.exec(cb);
	}
}

mongoose.model('Enterprise', EnterpriseSchema);