// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var SearchresultSchema = new Schema({
  title: String,
  url: String,
  content: String
});

mongoose.model('Searchresult', SearchresultSchema);

