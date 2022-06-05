const express = require('express');
const router = express.Router();
const Slot = require('../../models/slot');

const d = new Date();


function getPatient(req) 
{
    return req.jwtData.id;
 // return '628a32899a3fa04062284232';

}
function getRole(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
{
   return req.jwtData.role;
   //return 'P';
}

router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db

  console.log('dentro GET');

//solo P puo vedere il calendario con gli slot liberi
  if(getRole(req)!='P'){
    if(getRole(req)!='AO'){
      res.status(403).json({success: 'false', reason: 'Unauthorized', error: '1'});
      return;
    }
   }

  var year= d.getFullYear();
  var month= d.getMonth()+1;
  //var month=10;
  var doc= req.query.id;

  //parametro passato non è un id
  if (!(doc.match(/^[0-9a-fA-F]{24}$/))) {
    console.log(" ERRATO ID ");
    res.status(406).json({success: 'false', reason: 'not accetable id', error: '2'});
    return
  }


//____________CREO VARIABILI PER PRENDERE I PRIMI 4 MESI___________________________________________________________________
  var month1=(month+1)%13;
  var month2=(month+2)%13;
  var month3=(month+3)%13;
  var year1=year;
  var year2=year;
  var year3=year;

   if(month>month1){
     year1++;
     month1++;
     //console.log(month+"   1 "+month1+"   "+year1)
   }else if(month1>month2){
     year2++;
     month2++;
     //console.log(month1+" 2   "+month2+"   "+year2)
   }else if(month2>month3){
    year3++;
    month3++;
   // console.log(month2+"  3  "+month3+"   "+year3)
  };


  /*1)cerco tutti gli slot vuoti(null) di quel medico nei prossimi 4 mesi
  /2) per ogni data distinta disponibile creo un subdocument con tutti gli slot(orari) disponibili della giornata
        data1 -> {id ..from..to..}
        data2 -> {id ..from..to..}
                {id ..from..to..}
        data3 -> {id ..from..to..}
  */
   var slots=await Slot.aggregate([ { $match:
                                            {"$and" : [{ "occupied_id_pat" : null },{ $expr : { $eq: [ '$id_doc' , { $toObjectId: doc } ] } },
                                                      {$or: [{day: new RegExp(year+"-"+month+"-")},{day: new RegExp(year1+"-"+month1+"-")},{day: new RegExp(year2+"-"+month2+"-")},{day: new RegExp(year3+"-"+month3+"-")}]}]}} ,
                                     { $group: { "_id": "$day",  "giorni":{"$addToSet":{"_id":"$_id", "from":"$from", "to":"$to"}}}}]);

 //controllo se esistono slot

    //sorto i giorni
    (slots).sort(function(a, b){
      var date1 = new Date(a._id)
      var date2 = new Date(b._id)
      return date1 - date2;
    });

    //per ogni giorno sorto le ore
    for(let i=0; i<slots.length;i++){
      (slots[i].giorni).sort(function (x,y){
        var date1 = (x.from).split(':').join('')
        var date2 = (y.from).split(':').join('')
        return date1 - date2;
      })
    };

    console.log(slots);
    res.status(200).json(slots);

});



router.put('', async function(req, res){
  if(getRole(req)!='P'){
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '1'});
        return;
  }

  var idSlot=req.body._idSlot;
  var idPatient= getPatient(req);
  console.log('idVisita='+idSlot);
  var prenotato=await Slot.findByIdAndUpdate( {_id: idSlot}, {"occupied_id_pat": idPatient })

  if(prenotato==null){
    res.status(404).json({success: 'false',comment:'slot non trovato', error: '2'});
    return
  }

  res.status(200).json({success: 'true',comment:'slot prenotato'});

});

module.exports = router;

//con il metodo che usato il ho una sola get e posso passargli tutti i parametri che voglio
     //es) fetch('../api/v1/agendaMedico?year='+year+'&month='+(month+1)+'&day='+day, {
/*altrimenti nello script fetcho fetch('../api/v1/profileM/'+id, {
e qua posso avere PIU GET DIVERSE  ma devo diversificarle con il primo parametro
    router.get('/:id', async function(req, res){
                  ^
                  |
      let idMedico = req.params.id;
                     //piuttosto che req.body.id
*/
