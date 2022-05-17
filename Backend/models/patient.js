var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Patient', new Schema({ 
	id_user: String,
	email: String,
    name: String,
    surname: String,
    address: String,
    CF: String,
    codePA: String,
    verified: Boolean
}));