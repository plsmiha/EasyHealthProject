const express = require('express');
const router = express.Router();

router.post('', async function(req, res) {

    res.clearCookie("access_token").status(200).json( { redirectTo: user.type });

});

module.exports = router;