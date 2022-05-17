const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const User = require('./models/user');
const Patient = require('./models/patient');

router.post('', async function(req, res) {

    if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined')
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
    res.json({success: 'true'});
    console.log("User saved");
    

});

module.exports = router;