const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const User = require('./models/user');
const Patient = require('./models/patient');

router.post('', async function(req, res) {

    if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined' || typeof req.body.nome == 'undefined' || typeof req.body.cognome == 'undefined' || typeof req.body.residenza == 'undefined' || typeof req.body.CF == 'undefined' || typeof req.body.codPA == 'undefined')
    {
        res.json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }

    let user_check = await Patient.find().where('CF',req.body.CF);
    if(Object.keys(user_check).length>=1)
    {
        res.json({success: 'false', reason: 'CF already exists', error: '2'});
        return;
    }
    user_check = await User.find().where('email',req.body.email);
    if(Object.keys(user_check).length>=1)
    {
        res.json({success: 'false', reason: 'Email already exists', error: '3'});
        return;
    }
    
    var hash = crypto.createHash('sha512');
    data = hash.update(req.body.password, 'utf-8');
    gen_hash= data.digest('hex');
    let user = new User({
        email: req.body.email,
        password: gen_hash,
        type: 'P'
    });
    user = await user.save();

    let patient = new Patient({
        id_user: user._id.valueOf(),
        email: req.body.email,
        name: req.body.nome,
        surname: req.body.cognome,
        address: req.body.residenza,
        CF: req.body.CF,
        codePA: req.body.codePA,
        verified: false
    })
    patient = await patient.save();
    res.json({success: 'true'});
    console.log("User saved");
    

});

module.exports = router;