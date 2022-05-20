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


//quando riceve una post fa questo
//tramite browser faccio delle get
router.post('', async function(req, res) {

   //RECUPERO IN QUALCHE MODO LA MAIL

   //genero una nuova password
   var passTemp = generateString(8);

   //la mando in chiaro al paziente 
    transporter.sendMail({
        from: '"EasyHealth+" <easy.health.app.info@gmail.com>',
        to: req.body.email,                                                                                           //EMAIL CHE DEVO ANCORA RECUPERARE
        subject: "",
        text: "use this temporary password to login and then change it woithin your profile" + passTemp,
    }).then().catch(console.error);

 
    //la hasho per salvarla nel db
    var hash = crypto.createHash('sha512');
    data = hash.update(passTemp, 'utf-8');
    gen_hash= data.digest('hex');

    //recupero l'id della persona che ha quella mail 
    //var utente= await User.find().where('email',req.body.email);                                                             //DA METTERE QUA LA EMAIL 
    //var _id = Object.keys(user_check)
    
    //update user nel db cercandolo in base all'email
    User.findOneAndUpdate(
        {email: req.body.email},                                                                                                    //DA METTERE EMAIL
        {"password":gen_hash}, 
        function(err, result){ // For nearly all mongoose queries callback(err, results)
            if(err){
                res.status(406).json({success: 'false', reason: 'Errore update PSW temp ', error: '1'});
                return;
            }
        })


    res.status(200).json({success: 'true', comment:'password temporanea modificata'});  
    console.log("password temporanea modificata");
});


module.exports = router;