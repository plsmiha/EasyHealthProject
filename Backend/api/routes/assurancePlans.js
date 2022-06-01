const express = require('express');
const router = express.Router();
const PA = require('../../models/PA');

router.get('', async function(req, res) {
    let pas = await PA.find({});
    res.status(200).json(pas);
})


router.put('', async function(req, res)
{
  console.log(req);
  if (Number.isInteger(parseInt(req.body.sconto)) == false) {
    res.status(504).json({success: 'false',reason:'sconto non e` un intero', error: '2'});
    return;
  }
  if(parseInt(req.body.sconto) > 100 || parseInt(req.body.sconto) < 1){
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
return;
})


module.exports = router;
