const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../../models/user');
const Patient = require('../../models/patient');

//FUNZIONI

function getId(){
    return '6283b2e8cd01c7be9d02d14a';
}

function getUser(){
    return '6283b2e8cd01c7be9d02d148';
    
}



//recupero le informazioni dell'utente con un GET per metterle nel form di modifica
router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db
    console.log('recupero dati');
    var _id = getId();
    let data = await Patient.findById(_id);

    res.status(200).json(data);
})

//aggiorno tutte le info del paziente con un post

router.post('', async function(req, res){
    console.log('dentro post backend');
    //controllo che ogni campo sia completato in maniera opportuna
    if(typeof req.body.email == 'undefined' ||  typeof req.body.residenza == 'undefined' || typeof req.body.codePA == 'undefined' )
    {   console.log('anuovi dati:');
        console.log(req.body.email);
        console.log(req.body.residenza);
        console.log(req.body.codePA)
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        console.log('wrong format');
        return;
    }

    var email=req.body.email;
    var address=req.body.residenza;
    var password=req.body.password;
    var codePA=req.body.codePA;
    var _id=getId();
    var _user=getUser();


    var user_check = await User.find({"email" : { $regex : new RegExp(email, "i") }}).where('_id').ne(_user);
    console.log(Object.keys(user_check).length);
    if(Object.keys(user_check).length>0){
        res.status(403).json({success: 'false', reason: 'forbidden', error: '3'});
        console.log('email gia registrata');
        return;
    }
  
  

    //primo parametro e quello secondo il quale sto cercando=id, poi passo nuovi campi, poi callback
    //The query executes if callback is passed.
    Patient.findByIdAndUpdate(  {_id}, 
                                {"email": email, "address": address, "codePA" : codePA}, 
                                function(err, result){
                                        if(err){ //errore nell'update
                                            res.status(406).json({success: 'false', reason: 'db', error: '2'})
                                            return; //esce dalla funzione del post
                                        }
                                }
                             )
    console.log('update paziente');

    _id = getUser(); //cambio id, ora passo a updatare 
    
    if(password.length > 0){
        //il campo password e stato lasciato vuoto quindi non si vuole modificare
        
        //creo digest della password
        var hash = crypto.createHash('sha512');
        data = hash.update(password, 'utf-8');
        gen_hash= data.digest('hex');

        User.findByIdAndUpdate( {_id}, 
                                {"email": email,  "password": gen_hash}, 
                                function(err, result){
                                        if(err){ //errore nell'update
                                            res.status(406).json({success: 'false', reason: 'db', error: '2'})
                                            return; //esce dalla funzione del post
                                        }
                                })
        console.log('update user psw');

    }else{ //password=0 -> non voglio modificata
        User.findByIdAndUpdate( {_id}, 
                                {"email": email}, 
                                function(err, result){
                                        if(err){ //errore nell'update
                                            res.status(406).json({success: 'false', reason: 'db', error: '2'})
                                            return; //esce dalla funzione del post
                                        }
                                })
        console.log('update no psw user');
    }

    res.status(200).json({success: 'true',comment:'paziente modificato'});
    console.log('finidhed');

});

module.exports = router;




