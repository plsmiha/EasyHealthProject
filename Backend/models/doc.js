var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('docs', new Schema({
	id_user: String,
	email: String,
    name: String,
		surname: String,
    title: String,
		numero: String,
    bio: String,
}));
