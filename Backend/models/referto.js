var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Referto', new Schema({ 
	patient_id: { type: Schema.Types.ObjectId, ref: 'Patient' },
    doc_id:{ type: Schema.Types.ObjectId, ref: 'docs' },
    title: String,
    date: String,
    pdf_file: Buffer,
    comment: String
}));