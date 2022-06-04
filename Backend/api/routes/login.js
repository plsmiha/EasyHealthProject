const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const User = require('../../models/user');
const Patient = require('../../models/patient');

router.post('', async function(req, res) {

    if(typeof req.body.email == 'undefined' || typeof req.body.password == 'undefined' )
    {
      res.status(400).json({ error: 'bad request' });
        return;
    } else {

        let user = await User.findOne({ email: req.body.email});

        if(user!=null)
        {
            var hash = crypto.createHash('sha512');
            data = hash.update(req.body.password, 'utf-8');
            gen_hash= data.digest('hex');

            if (user.verified && gen_hash == user.password) {
                //console.log("utente loggato " + process.env.JWT_KEY)
                const token = jwt.sign({ id: user._id.valueOf(), role: user.type },  process.env.JWT_KEY);
                //console.log(token);
                res.cookie("access_token", token, { httpOnly: true, secure: true}).status(200).json( { redirectTo: user.type });
                return;

            }
            else if(gen_hash != user.password){
                //console.log("tentativo di log errato");
                res.status(403).json({ error: 'Unauthorized' });
                return;
            }
            else{
                //console.log("utente non verificato");
                res.status(403).json({ error: 'Not verified' });
                return;
            }
        }
        else
        {
            //console.log("tentativo di log errato");
            res.status(403).json({ error: 'Unauthorized' });
            return;
        }
    }



});

module.exports = router;
