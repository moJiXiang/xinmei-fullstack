// words model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var WordsSchema = new Schema({
  keyword: String,
  words: {type: Array, default: []}
});

mongoose.model('Words', WordsSchema);

