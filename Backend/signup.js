const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('./models/user');
const Patient = require('./models/patient');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'easy.health.app.info@gmail.com',
      pass: 'idsids22',
    },
});
transporter.verify().then().catch(console.error);

router.post('', async function(req, res) {

    if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined' || typeof req.body.nome == 'undefined' || typeof req.body.cognome == 'undefined' || typeof req.body.residenza == 'undefined' || typeof req.body.CF == 'undefined' || typeof req.body.codPA == 'undefined')
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }

    let user_check = await Patient.find().where('CF',req.body.CF);
    if(Object.keys(user_check).length>=1)
    {
        res.status(406).json({success: 'false', reason: 'CF already exists', error: '2'});
        return;
    }
    user_check = await User.find().where('email',req.body.email);
    if(Object.keys(user_check).length>=1)
    {
        res.status(406).json({success: 'false', reason: 'Email already exists', error: '3'});
        return;
    }

    var hash = crypto.createHash('sha512');
    data = hash.update(req.body.password, 'utf-8');
    gen_hash= data.digest('hex');
    let user = new User({
        email: req.body.email,
        password: gen_hash,
        type: 'P',
        verified: false
    });
    user = await user.save();

    let patient = new Patient({
        id_user: user._id.valueOf(),
        email: req.body.email,
        name: req.body.nome,
        surname: req.body.cognome,
        address: req.body.residenza,
        CF: req.body.CF,
        codePA: req.body.codPA
    })
    patient = await patient.save();

    let link = "http://localhost/api/v1/verify_email?id="+user._id.valueOf();
    transporter.sendMail({
        from: '"EasyHealth+" <easy.health.app.info@gmail.com>',
        to: req.body.email,
        subject: "Confirm your email on EasyHealth+ ✔",
        text: "",
        html: "<a href='"+link+"'>Click here yo confirm your identity!</a> or copy and paste link below:<br/>"+link,
    }).then().catch(console.error);

    res.status(200).json({success: 'true'});
    console.log("User saved");
    

});

module.exports = router;