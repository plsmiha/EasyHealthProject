const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../../models/user');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'easy.health.app.info@gmail.com',
      pass: 'idsids22',
    },
});

//FUNZIONI

function generateString(length) {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?[#?!@$%^&';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}


//quando riceve una post fa questo
//tramite browser faccio delle get
router.post('', async function(req, res) {
    console.log('POST arrived')

    //controllo se la email è stata registrata
   var user_check = await User.find().where('email',req.body.email);
    console.log(Object.keys(user_check).length);
    if(Object.keys(user_check).length==0){
        res.status(406).json({success: 'false', reason: 'email non registrata', error: '2'});
        console.log('email non registrata');
        return;
    }else{
        //genero una nuova password
        var passTemp = generateString(8);
        //la hasho per salvarla nel db
        var hash = crypto.createHash('sha512');
        data = hash.update(passTemp, 'utf-8');
        gen_hash= data.digest('hex');

        //modifico il campo inserendo il nuovo hash della pass
        User.findOneAndUpdate(
            {email: req.body.email},
            {"password":gen_hash},
            function(err, result){ // For nearly all mongoose queries callback(err, results)
                if(err){
                    res.status(406).json({success: 'false', reason: 'Errore update PSW temp ', error: '1'});
                    console.log('errore update ma esiste');
                    return;
                }
            })

        //mando nuova passw in chiaro al paziente per mail
        console.log('mail presente nel db');
        transporter.sendMail({
          from: '"EasyHealth+" <easy.health.app.info@gmail.com>',
          to: req.body.email,
          subject: "Cambio password EasyHealth+",
          text: "È stata per te creata una nuova password!\nPotrai usarla per accedere al tuo account e cambiarla nelle opzioni di modifica profilo:\n" + passTemp,
        }).then().catch(console.error);

    }
    console.log("password temporanea modificata");
    res.status(200).json({success: 'true', comment:'password temporanea modificata'});

});


module.exports = router;
