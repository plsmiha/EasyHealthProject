const express = require('express');
const router = express.Router();
const patient = require('../../models/patient');

router.get('', async function(req, res) {
    let pas = await patient.find({});
    res.status(200).json(pas);
})

module.exports = router;
