const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../../models/user');
const Patient = require('../../models/patient');

//FUNZIONI

function getId(){
    return '6283a725e782405e1e1e21b1';
}

function getUser(){
    return '6283a725e782405e1e1e21b1';
}



//recupero le informazioni dell'utente con un GET per metterle nel form di modifica
router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db
    
    var _id = getId();
    let data = await Patient.findById(id);

    res.status(200).json(data);
})

//aggiorno tutte le info del paziente con un post

router.post('', async function(req, res){

    //controllo che ogni campo sia completato in maniera opportuna
    if(typeof req.body.email == 'undefined' ||  typeof req.body.residenza == 'undefined' ||  typeof req.body.codPA == 'undefined')
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }

    var email=req.body.email;
    var address=req.body.address;
    var password=req.body.password;
    var codPA=req.body.codPA;
    var _id=getId();

  

    //primo parametro e quello secondo il quale sto cercando=id, poi passo nuovi campi, poi callback
    //The query executes if callback is passed.
    Patient.findByIdAndUpdate(  {_id}, 
                                {"email": email, "address": address, "codPA" : codPA}, 
                                function(err, result){
                                        if(err){ //errore nell'update
                                            res.status(406).json({success: 'false', reason: 'Errore update paziente', error: '2'})
                                            return; //esce dalla funzione del post
                                        }
                                }
                             )

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
                                            res.status(406).json({success: 'false', reason: 'Errore update paziente e password', error: '3'})
                                            return; //esce dalla funzione del post
                                        }
                                })

    }else{ //password=0 -> non voglio modificata
        User.findByIdAndUpdate( {_id}, 
                                {"email": email}, 
                                function(err, result){
                                        if(err){ //errore nell'update
                                            res.status(406).json({success: 'false', reason: 'Errore update paziente e password', error: '3'})
                                            return; //esce dalla funzione del post
                                        }
                                })
    }

    res.status(200).json({success: 'true',comment:'paziente modificato'});
    return;

});

module.exports = router;



