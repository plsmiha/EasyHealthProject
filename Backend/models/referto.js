var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
module.exports = mongoose.model('Referto', new Schema({ 
	patient_id: String,
    doc_id: String,
    title: String,
    date: String,
    pdf_file: Buffer,
    comment: String
}));