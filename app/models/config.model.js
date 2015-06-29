// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var ConfigSchema = new Schema({
  userid: String,
  session: String,
  imei: String
});

mongoose.model('Config', ConfigSchema);
