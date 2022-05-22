const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../../models/user');
const Patient = require('../../models/patient');


function getUser(req){ //qui dentro ricevaero dal jwt l'id user
    //return req.jwtData.id;
    return '6283b2e8cd01c7be9d02d148';
}


//recupero le informazioni dell'utente con un GET per metterle nel form di modifica
router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db
    
    var _user = getUser(req);
    Patient.findOne({id_user:_user}).then(utente =>{
        var _id = String(utente._id).split('"')[0];
        console.log('get dati di '+_id);
        Patient.findById({_id}).then(data =>{
            res.status(200).json(data);
        }); 
    });
})

//aggiorno tutte le info del paziente con un post

router.post('', async function(req, res){
    console.log('dentro post backend');
    //controllo che ogni campo sia completato in maniera opportuna
    if(typeof req.body.email == 'undefined' ||  typeof req.body.residenza== 'undefined' || typeof req.body.codePA == 'undefined' )
    {   console.log('anuovi dati:');
        console.log(req.body.email);
        console.log(req.body.residenza);
        console.log(req.body.codePA)
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        console.log('wrong format');
        return;
    }

    var email=req.body.email;
    var residenza=req.body.residenza;
    var password=req.body.password;
    var codePA=req.body.codePA;
    var _user=getUser(req);
    var ids= await Patient.findOne({id_user:_user})
    var _id = String(ids._id).split('"')[0];

    var user_check = await User.find({"email" : { $regex : new RegExp(email, "i") }}).where('_id').ne(_user);
    console.log(Object.keys(user_check).length);
    if(Object.keys(user_check).length>0){
        res.status(403).json({success: 'false', reason: 'forbidden', error: '3'});
        console.log('email gia registrata');
        return;
    }
  
  

    //primo parametro e quello secondo il quale sto cercando=id, poi passo nuovi campi, poi callback
    //The query executes if callback is passed.
    await Patient.findByIdAndUpdate(  {_id},{"email": email, "address": residenza, "codePA" : codePA});
    console.log('update paziente');

    
    if(password.length > 0){
        //il campo password e stato lasciato vuoto quindi non si vuole modificare
        
        //creo digest della password
        var hash = crypto.createHash('sha512');
        data = hash.update(password, 'utf-8');
        gen_hash= data.digest('hex');

        User.findByIdAndUpdate( {_user}, 
                                {"email": email,  "password": gen_hash})
        console.log('update user psw');

    }else{ //password=0 -> non voglio modificata
        User.findByIdAndUpdate( {_user},{"email": email});
        console.log('update no psw user');
    }

    res.status(200).json({success: 'true',comment:'paziente modificato'});
    console.log('finidhed');

});

module.exports = router;




