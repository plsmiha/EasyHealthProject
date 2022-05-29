const express = require('express');
const router = express.Router();

const Doctor = require('../../models/doc');
const Patient = require('../../models/doc'); 
const Slot = require('../../models/slot');



function getPatient(req) 
{
    return req.jwtData.id;
   // return '628a32899a3fa04062284232';
    
}


function custom_sort(a, b) {
    return new Date(a.day).getTime() - new Date(b.day).getTime();
}


router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db
    console.log('dentro a get');
    var jsonArr = [];
    var paziente = getPatient(req);

    //prendo tutti gli appuntamenti di questo paziente
    var appuntamento = await Slot.find({occupied_id_pat: paziente}, "_id day from to id_doc ");
    

    //ordino gli appuntamenti in base alla data
    appuntamento.sort(custom_sort);

  
    if(appuntamento.length>0){
        //mi tiro fuori il nome del medico con cui ha appuntamento avendo l'id

        for(let i=0; i<appuntamento.length; i++){
            var medId= String(appuntamento[i].id_doc).split('"')[0];
            var medico = await Doctor.find({id_user: medId}, "name surname");
            jsonArr.push(medico);
        }


        var data = {appuntamento, jsonArr};
        console.log(data);
        res.status(200).json(data);


    }else{
        res.status(406).json({success: 'false', reason: 'no appuntamenti', error: '1'});
    }
    
});


router.delete('/:slot', async function(req, res){

   /* if(getRole(req)!='P')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;

    }*/
    const _id=req.params.slot;
    let slot = await Slot.findByIdAndUpdate( {_id},{"occupied_id_pat":""});
    
    if(!slot){
        res.status(404).json({success: 'false', reason: 'Not found', error: '1'});
        return;
    }

    if(slot.occupied_id_pat==""){
        res.status(400).json({success: 'false', reason: 'Slot stranamente gia libero', error: '3'});
        return;
    }
    
    await Slot.deleteOne(slot);
    res.status(200).json({success: "true"});
});




module.exports = router;


