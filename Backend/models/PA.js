var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('PA', new Schema({
	name: String,
	sconto : Number
}));
