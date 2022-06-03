const express = require('express');
const router = express.Router();

const User = require('../../models/user');
const Patient = require('../../models/patient');


function getUser(req){ //qui dentro ricevaero dal jwt l'id user
    return req.jwtData.id;
    //return '6297243625304217dc48f38b';
}


//recupero le informazioni dell'utente con un GET per metterle nel form di modifica
router.get('', async function(req, res) //quando ricevo una richiesta get su /api/v1/modmed entro qui
{
    var _user = getUser(req);
    var data = await Patient.findOne({id_user:_user});
    if(data!=null){
        res.status(200).json(data);
        return;
    }
    res.status(404).json({success: 'false', reason: 'patient not found', error: '1'});

});

router.get('/:id', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db

    var _user = req.params.id;
    Patient.findById(_user).then(paziente =>{
        res.status(200).json(paziente);
    });
})

//aggiorno tutte le info del paziente con un post

router.put('', async function(req, res){
    console.log('dentro put');

    //controllo che ogni campo sia completato in maniera opportuna
    if(typeof req.body.email == 'undefined' ||  typeof req.body.residenza== 'undefined' || typeof req.body.codePA == 'undefined' ){
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '2'});
        console.log('wrong format');
        return;
    }

    var email=req.body.email;
    var residenza=req.body.residenza;
    var password=req.body.password;
    var codePA=req.body.codePA;
    var _user=getUser(req);
    var p= await Patient.findOne({id_user:_user})

    console.log(p._id);

//cerca nel database se c'è un user diverso da me che ha questa mail che voglio settare io
    var user_check = await User.find({"email" : { $regex : new RegExp(email, "i") }}).where('_id').ne(_user);
    console.log(Object.keys(user_check).length);

    if(Object.keys(user_check).length>0){
        res.status(406).json({success: 'false', reason: 'email gia registrata', error: '3'});
        console.log('email gia registrata');
        return;
    };


    //primo parametro e quello secondo il quale sto cercando=id, poi passo nuovi campi, poi callback
    //The query executes if callback is passed.
    var patmodificato=await Patient.findByIdAndUpdate(  {_id:p._id},{"email": email, "address": residenza, "codePA" : codePA});

    if(patmodificato==null){
        res.status(404).json({success: 'false', reason: 'patient not found/not updated', error: '1'});
        return
    }

    if(password.length > 0){
        //il campo password e stato lasciato vuoto quindi non si vuole modificare

        //creo digest della password
        var hash = crypto.createHash('sha512');
        data = hash.update(password, 'utf-8');
        gen_hash= data.digest('hex');

        var uedit=await User.findByIdAndUpdate( {_id: _user},{"email": email,  "password": gen_hash})
        console.log('update user psw');
        if(uedit==null){
            res.status(404).json({success: 'false', reason: 'patient not found/not updated', error: '1'});
            return
        }

    }else{ //password=0 -> non voglio modificata
        var uedit=await User.findByIdAndUpdate( {_id: _user},{"email": email});
        console.log('update no psw user');
        if(uedit==null){
            res.status(404).json({success: 'false', reason: 'patient not found/not updated', error: '1'});
            return
        }
    }

    res.status(200).json({success: 'true',comment:'paziente modificato'});

});

module.exports = router;
