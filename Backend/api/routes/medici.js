const express = require('express');
const router = express.Router();
const doc = require('../../models/doc');

router.get('', async function(req, res) {
    let pas = await doc.find({});
    res.status(200).json(pas);
})

module.exports = router;
