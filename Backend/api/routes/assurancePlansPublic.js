const express = require('express');
const router = express.Router();
const PA = require('../../models/PA');
const Patient = require('../../models/patient');
const mongoose = require('mongoose');
router.get('', async function(req, res) {
    let pas = await PA.find({});
    res.status(200).json(pas);
})

module.exports = router;
