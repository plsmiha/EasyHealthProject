const express = require('express');
const router = express.Router();


const Slot = require('../../models/slot');

const d = new Date();
const anno = d.getFullYear();
const mese= d.getMonth()+1;
const giorno =d.getDate();
const oggi = anno+"-"+mese+"-"+giorno;

function getPatient(req)
{
   return req.jwtData.id;
  // return '6283b2e8cd01c7be9d02d148';

}

function getRole(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
{
    return req.jwtData.role;
   // return 'P'
}

function custom_sort(a, b) {
    return new Date(a.day).getTime() - new Date(b.day).getTime();
}



router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db

    if(getRole(req)!='P')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '1'});
        return;
    }

    var paziente = getPatient(req);

    //prendo tutti gli appuntamenti di questo paziente
    var appuntamento = await Slot.find({occupied_id_pat: paziente}, "_id day from to id_doc ").populate('id_doc', ['name', 'surname']) ;


        appuntamento.sort(custom_sort);
        console.log(appuntamento);

        res.status(200).json(appuntamento);

});


router.delete('/:slot', async function(req, res){
  
    if(getRole(req)!='P')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '1'});
        return;
    }

    const s=req.params.slot;

    if (!(s.match(/^[0-9a-fA-F]{24}$/))) {
        console.log(" ERRATO ID SLOT");
        res.status(406).json({success: 'false', reason: 'not accetable id', error: '2'});
        return
      }
   
    let sl= await Slot.findOneAndUpdate( {_id:s,  day: { $ne: oggi }, occupied_id_pat:  getPatient(req) },{"occupied_id_pat":null});
    //.where("day").ne(oggi).where("occupied_id_pat", getPatient());

    if(!sl){
        res.status(404).json({success: 'false', reason: 'gia eliminato/slot non tuo/slot di oggi', error: '2'});
        return;
    }

    res.status(200).json({success: "true"});
});




module.exports = router;
