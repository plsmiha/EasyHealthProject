const express = require('express');
const router = express.Router();
const Slot = require('../../models/slot');

function getUser(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
{
    //return req.jwtData.id;
    return '6283a725e782702e1e1e21fe';
}
function getRole(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
{
   // return req.jwtData.role;
   return 'M';
}

router.post('', async function(req, res){

    let user = getUser(req);
    var day = req.body.day;
    var from = req.body.from;
    var to = req.body.to;

    if(getRole(req)!='M')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;
    }
    if(typeof day == 'undefined' || typeof from == 'undefined' || typeof to == 'undefined')
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }
    let d = new Date();
    let today = d.getFullYear()  + "-" + (d.getMonth()+1) + "-" + d.getDate();
    if(from>=to || day<=today)
    {
        res.status(400).json({success: 'false', reason: 'Incorrect date or time', error: '3'});
        return;
    }

    let slot = new Slot({
        id_doc: user,
        day: day,
        from: from,
        to: to,
        occupied_id_pat: ""
    });
    slot = await slot.save();
    res.status(200).json({success: 'true'});

});

router.get('', async function(req, res){

    let user = getUser(req);
    var month = req.query.month;
    var year = req.query.year;
    var day = req.query.day;

    if(getRole(req)!='M')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;
    }
    if(typeof month == 'undefined' || typeof year == 'undefined')
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }

    if(typeof day == 'undefined')
    {
        let slots = await Slot.find({id_doc: user, day: new RegExp(year+"-"+month+"-")}, "_id day");
        res.status(200).json(slots);
    }
    else
    {
        let slots = await Slot.find({id_doc: user, day: year+"-"+month+"-"+day}, "_id");
        res.status(200).json(slots);
    }
});

router.get('/:id', async function(req, res){

    if(getRole(req)!='M')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;
    }
    let slot = await Slot.findById(req.params.id);
    if(!slot)
    {
        res.status(404).json({success: 'false', reason: 'Not found', error: '1'});
        return;
    }
    res.status(200).json(slot);
});

router.delete('/:id', async function(req, res){

    if(getRole(req)!='M')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;
    }
    let slot = await Slot.findById(req.params.id);
    if(!slot)
    {
        res.status(404).json({success: 'false', reason: 'Not found', error: '1'});
        return;
    }
    if(slot.occupied_id_pat!="")
    {
        res.status(400).json({success: 'false', reason: 'Slot occupied', error: '3'});
        return;
    }
    
    await Slot.deleteOne(slot);
    res.status(200).json({success: "true"});
});


module.exports = router;