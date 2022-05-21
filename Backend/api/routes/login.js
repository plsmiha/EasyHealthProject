const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Patient = require('../../models/patient');

router.post('', async function(req, res) {

    if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined' )
    {
        res.status(400);
        res.json({ error: 'Bad Request' });
    } else {

        let user = await User.findOne({ email: req.body.email});

        var hash = crypto.createHash('sha512');
        data = hash.update(req.body.password, 'utf-8');
        gen_hash= data.digest('hex');

        if (gen_hash == user.password) {
            console.log("utente loggato " + process.env.JWT_KEY)

            const token = jwt.sign({ id: user._id, role: user.type },  process.env.JWT_KEY);
            res.cookie("access_token", token, { httpOnly: true, secure: true}).status(200).json( { redirectTo: user.type });

        } else {
            console.log("tentativo di log errato")
            res.status(403).json({ error: 'Unauthorized' });
        }
    }
    
    

});

module.exports = router;