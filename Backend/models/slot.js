var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Slot', new Schema({ 
	id_doc: String,
	day: String,
    from: String,
    to: String,
    occupied_id_pat: String
}));