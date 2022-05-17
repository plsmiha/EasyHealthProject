var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Patient', new Schema({ 
	id: String,
	email: String,
    name: String,
    surname: String,
    address: String,
    CF: String,
    CodePA: String
}));