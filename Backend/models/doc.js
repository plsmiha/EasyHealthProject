var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('docs', new Schema({
	id_user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	email: String,
    name: String,
    surname: String,
<<<<<<< HEAD
    address: String,
		CF: String,
    title: [{ type: Schema.Types.ObjectId, ref: 'aree' }],
=======
    bio: String,
		numero: String,
    title: String,
>>>>>>> db7eebc1f885365032f17c51b55cab5fbf814f86
}));
