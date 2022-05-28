const express = require('express');
const AO = require('../../models/AO');
const router = express.Router();

function getUser(req){ //qui dentro ricevaero dal jwt l'id user
    return req.jwtData.id;
    //return '6283b2e8cd01c7be9d02d148';
}

router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db

    var _user = getUser(req);
    AO.findOne({id_user:_user}).then(utente =>{
        res.status(200).json(utente);
    });
})

module.exports = router;