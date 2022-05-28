const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const User = require('../../models/user');
const Doctor = require('../../models/doc'); 
const Area = require('../../models/area');
const Slot = require('../../models/slot');

const d = new Date();




function getPatient(req) 
{
    return req.jwtData.id;
 // return '628a32899a3fa04062284232';
    
}

router.get('', async function(req, res){ //do la risposta al fronted che mi ha chiesto e faccio la richiesta al db

  /*if(getRole(req)!='M')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;
    }*/
    console.log('dentro GETTTTTT')
  year= d.getFullYear();
  month= d.getMonth()+1;
  //month=10;
  console.log(month);
  var jsonArr = []
  var doc= req.query.id;
  console.log("ma bro "+doc);

  let med= await Doctor.findOne({id_user: doc});
  var titleId= String(med.title).split('"')[0];
  let spec = await Area.findById(titleId);


  month1=(month+1)%13;
  month2=(month+2)%13;
  month3=(month+3)%13;
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
  }


   //let slots = await Slot.find({id_doc: _user, day: new RegExp(year+"-"+month+"-")}, "_id day"); //mi prendo solo l'id e i giorni=projection
                                                      //regExp è per il pattern matching -> mi basta che la prima parte della data sia uguale
   let slotsDate = await Slot.distinct("day", {$or: [{day: new RegExp(year+"-"+month+"-")},{day: new RegExp(year1+"-"+month1+"-")},{day: new RegExp(year2+"-"+month2+"-")},
   {day: new RegExp(year3+"-"+month3+"-")}], id_doc: doc, occupied_id_pat: ""});
   //let slotsOra = await Slot.find({$or: [{day: new RegExp(year+"-"+month+"-")},{day: new RegExp(year1+"-"+month1+"-")},{day: new RegExp(year2+"-"+month2+"-")},{day: new RegExp(year3+"-"+month3+"-")}],$and: [{id_doc: _user}]}, "_id day from to ");
   //let slotsOra = await Slot.aggregate([{$group :{_id : "$day",  items: {$push: '$$ROOT'}}}]);
   //let slotsOra = await Slot.aggregate([{$group :{_id : "$day",  items: {$push: "from"}}}]);
  
   //{$match: {$or: [{day: new RegExp(year+"-"+month+"-")},{day: new RegExp(year1+"-"+month1+"-")},{day: new RegExp(year2+"-"+month2+"-")},{day: new RegExp(year3+"-"+month3+"-")}],$and: [{id_doc: _user}]}]);
   (slotsDate).sort(function(a, b){
      const date1 = new Date(a)
      const date2 = new Date(b)
      return date1 - date2;
  })
   console.log(slotsDate);
   for (var i = 0; i < (slotsDate).length; i++) {
     //appuntamento=await Slot.find({day:slotsDate[i]},{id_doc: _user}, { _id: 1, day: 1, from: 1, to:1 });
    
     appuntamento=await Slot.find({id_doc: doc, day: slotsDate[i],  occupied_id_pat: ""}, "_id day from to ");
     console.log(appuntamento);
     jsonArr.push(appuntamento);
    
   }

   var data = {med, spec, slotsDate, jsonArr};
   console.log("_________________________________________________________________________________________________________________________________________________________________________")
  console.log(data);
   res.status(200).json(data);
    
});



router.put('', async function(req, res){
  var idSlot=req.body._idSlot;
  var idPatient= getPatient(req);
  console.log('idVisita='+idSlot);
  await Slot.findByIdAndUpdate( {_id: idSlot}, {"occupied_id_pat": idPatient })


  res.status(200).json({success: 'true',comment:'slot prenotato'});

});

module.exports = router;