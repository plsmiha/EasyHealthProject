const express = require('express');
const router = express.Router();
const Referto = require('../../models/referto');
const Doc = require('../../models/doc');
const Patient = require('../../models/patient');

function getUser(req)
{
    return req.jwtData.id;
}

router.get('', async function(req, res)
{
    var _doc = await Doc.findOne({id_user: getUser(req)}, "_id");
    _doc = _doc._id.valueOf();
    var _pat = req.query.patient;

    Referto.find({doc_id: _doc, patient_id: _pat}).then(ref =>{
        if(ref!=null)
        {
            ref=ref.map(({_id, title, date}) => ({_id, title, date}))
        }
        res.status(200).json(ref);
    });
})

router.get('/paziente', async function(req, res)
{
    var _patient = await Patient.findOne({id_user: getUser(req)});

    await Referto.find({patient_id: _patient._id}).then(ref =>{
        if(ref!=null)
        {
            ref=ref.map(({_id, title, date}) => ({_id, title, date}))
        }
        res.status(200).json(ref);
    });
})

router.get('/:id', async function(req, res)
{
    let referto = await Referto.findById(req.params.id);
    if(!referto)
        res.status(404).json({success: 'false', reason: 'Not found', error: '1'});
    else
        res.status(200).json(ref);
})

router.post('', async function(req, res)
{
    if(typeof req.body.id_patient == 'undefined' || typeof req.body.title == 'undefined' || (typeof req.body.pdf == 'undefined' && typeof req.body.comment == 'undefined'))
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
    }
    var _doc = await Doc.findOne({id_user: getUser(req)}, "_id");
    _doc = _doc._id.valueOf();
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