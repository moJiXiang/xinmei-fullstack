var Status = {
	NotFoundError : function(message) {
		this.meta = {};
		this.meta.message = message;
		this.meta.code = 404;
	},
	SuccessStatus : function(message, results) {
		this.meta = {};
		this.meta.code = 200;
		this.meta.message = message;

		this.data = results;

	},
	TimeOutError : function(message) {
		this.meta = {};
		this.meta.message = message;
		this.meta.code = 408;
	}
}

module.exports = Status;