const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('./models/user');

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
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!.?^#}{[]@+-*';
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}



router.post('', async function(req, res) {

   //RECUPERO IN QUALCHE MODO LA MAIL

   //genero una nuova password
   var passTemp = generateString(8);

   //la mando in chiaro al paziente 
    transporter.sendMail({
        from: '"EasyHealth+" <easy.health.app.info@gmail.com>',
        to: req.body.email,                                                                   //EMAIL CHE DEVO ANCORA RECUPERARE
        subject: "",
        text: ""
    }).then().catch(console.error);

 

    //la hasho per salvarla nel db
    var hash = crypto.createHash('sha512');
    data = hash.update(passTemp, 'utf-8');
    gen_hash= data.digest('hex');



    res.status(200).json({success: 'true', comment:'password temporanea modificata'});  
    console.log("password temporanea modificata");
});


module.exports = router;