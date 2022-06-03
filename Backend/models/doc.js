var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('docs', new Schema({
	id_user: { type: Schema.Types.ObjectId, ref: 'User' },
	email: String,
    name: String,
    surname: String,
    bio: String,
		numero: String,
    title: { type: Schema.Types.ObjectId, ref: 'aree' },
}));
