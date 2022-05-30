const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../../models/user');
const Patient = require('../../models/patient');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'easy.health.app.info@gmail.com',
      pass: process.env.PASSWORD_MAIL
    },
});
transporter.verify().then().catch(console.error);

router.post('', async function(req, res) {

    if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined' || typeof req.body.name == 'undefined' || typeof req.body.surname == 'undefined' || typeof req.body.address == 'undefined' || typeof req.body.CF == 'undefined' || typeof req.body.codePA == 'undefined')
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
        name: req.body.name,
        surname: req.body.surname,
        address: req.body.address,
        CF: req.body.CF,
        codePA: req.body.codePA
    })
    patient = await patient.save();

    let link = process.env.DOMAIN + "/api/v1/verifyEmail?id=" + user._id.valueOf();
    transporter.sendMail({
        from: '"EasyHealth+" <easy.health.app.info@gmail.com>',
        to: req.body.email,
        subject: "Conferma il tuo account su EasyHealth+ ✔",
        text: "",
        html: "<a href='"+link+"'>Clicca qui per confermare la tua identità!</a> O copia incolla il link qui sotto:<br/>"+link,
    }).then().catch(console.error);

    res.status(200).json({success: 'true'});
    console.log("User saved");
    

});

module.exports = router;