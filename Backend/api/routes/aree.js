const express = require('express');
const router = express.Router();
const area = require('../../models/area');

router.get('', async function(req, res) {
    let pas = await area.find({});
    res.status(200).json(pas);
})


module.exports = router;
