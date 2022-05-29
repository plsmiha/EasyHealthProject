const express = require('express');
const router = express.Router();

const Doctor = require('../../models/doc');
const Patient = require('../../models/doc'); 
const Slot = require('../../models/slot');

const d = new Date();
const anno = d.getFullYear();
const mese= d.getMonth()+1;
const giorno =d.getDate();
const oggi = anno+"-"+mese+"-"+giorno;

function getPatient(req) 
{
    return req.jwtData.id;
   //return '628a32899a3fa04062284232';
    
}


function custom_sort(a, b) {
    return new Date(a.day).getTime() - new Date(b.day).getTime();
}


router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db
    console.log('dentro a get');
    var jsonArr = [];
    var jsonArrOggi = [];
    var paziente = getPatient(req);
    console.log(oggi);

    //prendo tutti gli appuntamenti di questo paziente
    var appuntamento = await Slot.find({occupied_id_pat: paziente}, "_id day from to id_doc ");
    var appOggi = await Slot.find({occupied_id_pat: paziente, day: oggi }, "_id day from to id_doc ");

    //ordino gli appuntamenti in base alla data
    appuntamento.sort(custom_sort);
    appOggi.sort(custom_sort);
 
    if(appuntamento.length>0|| appoggi.length>0){
        //mi tiro fuori il nome del medico con cui ha appuntamento avendo l'id

        for(let i=0; i<appuntamento.length; i++){
            var medId= String(appuntamento[i].id_doc).split('"')[0];
            var medico = await Doctor.find({id_user: medId}, "name surname");
            jsonArr.push(medico);
        }

        for(let i=0; i<appOggi.length; i++){
            var medId= String(appuntamento[i].id_doc).split('"')[0];
            var medico = await Doctor.find({id_user: medId}, "name surname");
            jsonArrOggi.push(medico);
        }
  
        
        var data = {appuntamento, jsonArr, appOggi, jsonArrOggi};
        console.log(data);
        res.status(200).json(data);


    }else{
        res.status(406).json({success: 'false', reason: 'no appuntamenti', error: '1'});
    }
    
});


router.delete('/:slot', async function(req, res){
    console.log('dentro a delete');
   /* if(getRole(req)!='P')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;

    }*/
    const s=req.params.slot;
    let sl= await Slot.find({_id:s}).where("day").ne(oggi);
    
    if(!sl){
        res.status(404).json({success: 'false', reason: 'NON PUOI ELIMINARLO o gia eliminato', error: '1'});
        return;
    }

    if(sl.occupied_id_pat==""){
        res.status(400).json({success: 'false', reason: 'Slot stranamente gia libero', error: '3'});
        return;
    }
    
    let slot = await Slot.findByIdAndUpdate( {_id:s},{"occupied_id_pat":""});
    res.status(200).json({success: "true"});
});




module.exports = router;


