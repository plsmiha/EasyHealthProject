const express = require('express');
const router = express.Router();
const Referto = require('../../models/referto');

function getUser(req)
{
    return req.jwtData.id;
}

router.get('/:id', async function(req, res)
{
    var _doc = getUser(req);
    var _pat = req.params.id;

    Referto.findOne({doc_id: _doc, patient_id: _pat}).then(ref =>{
            res.status(200).json(ref);
        });
})

router.post('', async function(req, res)
{
    if(typeof req.body.id_patient == 'undefined' || typeof req.body.title == 'undefined' || (typeof req.body.pdf == 'undefined' && typeof req.body.comment == 'undefined'))
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
    }
    var _doc = getUser(req);
    var date = (new Date()).getFullYear()+"-"+((new Date()).getMonth()+1)+"-"+(new Date()).getDate();
    var comment = typeof req.body.comment == 'undefined' ? '' : req.body.comment;
    var pdf = typeof req.body.pdf == 'undefined' ? '' : req.body.pdf;
    let referto = new Referto({
        patient_id: req.body.id_patient,
        doc_id: _doc,
        title: req.body.title,
        date: date,
        pdf_file: pdf,
        comment: comment
    })
    await referto.save();
    res.status(200).json({success: 'true'});
})




module.exports = router;