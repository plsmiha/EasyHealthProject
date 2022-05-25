const express = require('express');
const router = express.Router();
const Slot = require('../../models/slot');

function getUser(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
{
    return req.jwtData.id;
}
function getRole(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
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
        res.status(403).json({error: 'Unauthorized'});
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
        res.status(400).json({success: 'false', reason: 'Incorrect date or time', error: '2'});
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

})

router.get('', async function(req, res){

    let user = getUser(req);
    var month = req.query.month;
    var year = req.query.year;

    if(getRole(req)!='M')
    {
        res.status(403).json({error: 'Unauthorized'});
        return;
    }
    if(typeof month == 'undefined' || typeof year == 'undefined')
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }
    let slots = await Slot.find({id_doc: user, day: new RegExp(year+"-"+month+"-")}, "_id day");
    console.log(slots);
    res.status(200).json(slots);
})











module.exports = router;