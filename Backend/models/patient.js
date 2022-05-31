var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Patient', new Schema({ 
	id_user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	email: String,
    name: String,
    surname: String,
    address: String,
    CF: String,
    codePA: [{ type: Schema.Types.ObjectId, ref: 'PA' }],
}));