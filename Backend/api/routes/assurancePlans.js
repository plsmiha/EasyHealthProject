const express = require('express');
const router = express.Router();
const PA = require('../../models/PA');
const Patient = require('../../models/patient');
const mongoose = require('mongoose');
router.get('', async function(req, res) {
    let pas = await PA.find({});
    res.status(200).json(pas);
})


router.delete('', async function(req, res) {
    console.log('dentro delete backend');
    if(typeof req.body.id == 'undefined' )
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        console.log('wrong format');
      }


    Patient.updateMany({codePA:req.body.id},{$set: {"codePA": "6298f524110402d55566676f"}}, function(err, result)
    {
      if(err){
        res.status(504).json({success: 'false',reason:'db error patient', error: '1'});
        return;
      }
      else {
        console.log(result);
        PA.deleteOne({_id: req.body.id}, function(err, result)
        {
          if (err){
            console.log(err);
            res.status(504).json({success: 'false',reason:'db error PA ', error: '1'});
            return;
          }
          else{

            res.status(200).json({success: 'true',comment:'PA eliminato'});
            return;

          }
        });
      }
    });


})


router.put('', async function(req, res)
{

  if(typeof req.body.nome == 'undefined' || typeof req.body.sconto == 'undefined' )
  {
      res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
      console.log('wrong format');
    }

  if (Number.isInteger(parseInt(req.body.sconto)) == false) {
    res.status(504).json({success: 'false',reason:'sconto non e` un intero', error: '2'});
    return;
  }
  if(parseInt(req.body.sconto) > 100 || parseInt(req.body.sconto) < 0){
    res.status(504).json({success: 'false',reason:'sconto non valido', error: '2'});
    return;
  }



  PA.findByIdAndUpdate(req.body.id, { name: req.body.nome,sconto: req.body.sconto },
                            function (err, docs) {
    if (err){
      console.log('bbb');

      res.status(504).json({success: 'false',reason:'db error', error: '1'});
      return;
    }
    else{
      console.log('ccc');

      res.status(200).json({success: 'true',reason:"si"});
      return;

    }
});

})


router.post('',async function(req,res){

  if(typeof req.body.nome == 'undefined' || typeof req.body.sconto == 'undefined' )
  {
      res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
      console.log('wrong format');
  }

  console.log('we good');
  if (Number.isInteger(parseInt(req.body.sconto)) == false) {
    res.status(504).json({success: 'false',reason:'sconto non e` un intero', error: '2'});
    return;
  }
  if(parseInt(req.body.sconto) > 100 || parseInt(req.body.sconto) < 0){
    res.status(504).json({success: 'false',reason:'sconto non valido', error: '2'});
    return;
  }


  let pa = new PA({
      name: req.body.name,
      sconto: req.body.sconto
  })
  pa = await pa.save();
  res.status(200).json({success: 'true'});
  return;
})

module.exports = router;
