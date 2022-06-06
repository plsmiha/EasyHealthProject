const express = require('express');
const router = express.Router();
const User = require('../../models/user');

router.get('', async function(req, res) {

    if(typeof req.query.id == 'undefined')
    {
        res.status(400);
        res.json({ error: 'Bad Request' });
        return;
    }
    await User.findByIdAndUpdate(req.query.id, { verified: true }).catch(error => {});
    res.redirect('../../index.html');
});

module.exports = router;