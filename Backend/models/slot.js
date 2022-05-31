var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Slot', new Schema({ 
	id_doc: [{ type: Schema.Types.ObjectId, ref: 'docs' }],
	day: String,
    from: String,
    to: String,
    occupied_id_pat: [{ type: Schema.Types.ObjectId, ref: 'Patient' }]
}));