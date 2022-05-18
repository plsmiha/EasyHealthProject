const express = require('express');
const router = express.Router();
const docs = require('./models/doc');

router.get('', async function(req, res) {
    let data = await docs.findById('6283a725e782405e1e1e21b1');
    var titolo = data['title'];
    var email = data['email'];
    var password =data['password'];
    var residenza=data['residenza'];
    console.log(data['title'])
    res.status(200).json(data);
    console.log("AAAAAAAAA")
})


router.post('', async function(req, res) {
        var email=req.body.email;
        var residenza=req.body.residenza;
        var password=req.body.password;
        var titolo=req.body.titolo;
        console.log(residenza,email,password,titolo)
        res.status(200).json({success: 'true', reason: 'eheh'});
        console.log('got post req');
        return;

});


module.exports = router;
