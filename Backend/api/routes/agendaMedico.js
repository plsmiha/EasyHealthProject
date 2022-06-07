const express = require('express');
const router = express.Router();
const Slot = require('../../models/slot');
const Doc = require('../../models/doc');

function getUser(req)
{
    return req.jwtData.id;
}
function getRole(req)
{
    return req.jwtData.role;
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
    let today = new Date();
    let dayindate = new Date(day.split("-")[0], day.split("-")[1], day.split("-")[2]);
    if(from>=to || dayindate<=today)
    {
        res.status(400).json({success: 'false', reason: 'Incorrect date or time', error: '3'});
        return;
    }

    let doc = await Doc.findOne({id_user: user}, "_id");
    let slot = new Slot({
        id_doc: doc._id,
        day: day,
        from: from,
        to: to,
        occupied_id_pat: null
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
        let doc = await Doc.findOne({id_user: user}, "_id");
        let slots = await Slot.find({id_doc: doc._id, day: new RegExp(year+"-"+month+"-")}, "_id day");
        res.status(200).json(slots);
    }
    else
    {
        let doc = await Doc.findOne({id_user: user}, "_id");
        let slots = await Slot.find({id_doc: doc._id, day: year+"-"+month+"-"+day}, "_id");
        res.status(200).json(slots);
    }
});

router.get('/:id', async function(req, res){

    if(getRole(req)!='M')
    {
        res.status(403).json({success: 'false', reason: 'Unauthorized', error: '2'});
        return;
    }
    let slot = await Slot.findById(req.params.id).catch(err => {});
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
    let slot = await Slot.findById(req.params.id).catch(err => {});
    if(!slot)
    {
        res.status(404).json({success: 'false', reason: 'Not found', error: '1'});
        return;
    }
    if(slot.occupied_id_pat!=null)
    {
        res.status(400).json({success: 'false', reason: 'Slot occupied', error: '3'});
        return;
    }

    await Slot.deleteOne(slot);
    res.status(200).json({success: "true"});
});


module.exports = router;
