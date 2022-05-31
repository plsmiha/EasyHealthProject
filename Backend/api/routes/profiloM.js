const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const User = require('../../models/user');
const Doctor = require('../../models/doc'); 
const Area = require('../../models/area');




router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db
   var id= '6283a725e782345e1e1e21b1';
   let med= await Doctor.findById(id);
   var titleId= String(med.title).split('"')[0];
   let spec = await Area.findById(titleId);
   var data = {med, spec};
   
   res.status(200).json(data);
    
})

module.exports = router;