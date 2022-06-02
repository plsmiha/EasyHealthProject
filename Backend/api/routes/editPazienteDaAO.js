const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const router = express.Router();

const User = require('../../models/user');
const Patient = require('../../models/patient');


function getUser(req){ //qui dentro ricevaero dal jwt l'id user
    return req.query.id;
    //return '6283b2e8cd01c7be9d02d148';
}

router.delete('', async function(req, res) {
    console.log('dentro delete backend');
    
    var id_user= await Patient.findOne({_id: req.query.id}).id_user
    //await User.deleteOne({_id: id_user})
    //await Patient.deleteOne({_id: req.query.id})
    res.status(200).json({success: 'true',comment:'paziente eliminato'});
})

router.post('', async function(req, res){
    console.log('dentro post backend');
    
    //controllo che ogni campo sia completato in maniera opportuna
    if(typeof req.body.email == 'undefined' ||  typeof req.body.residenza== 'undefined' || typeof req.body.codePA == 'undefined' || typeof req.body.nome == 'undefined' || typeof req.body.cognome == 'undefined' )
    {   console.log('anuovi dati:');
        console.log(req.body);
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        console.log('wrong format');
        return;
    }

    var email=req.body.email;
    var residenza=req.body.residenza;
    var nome=req.body.nome;
    var cognome=req.body.cognome;
    var codePA=req.body.codePA;
    var ids= await Patient.findOne({_id: req.query.id})
    console.log(req.query)
    console.log(ids)
    var _user=ids.id_user;
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
    await Patient.findByIdAndUpdate(  {_id},{"email": email, "address": residenza, "codePA" : codePA, "name": nome, "surname": cognome});
    console.log('update paziente');

    res.status(200).json({success: 'true',comment:'paziente modificato'});
    console.log('finidhed');

});

module.exports = router;




