const express = require('express');
const router = express.Router();
const docs = require('./models/doc');
const user = require('./models/user');
const crypto = require('crypto');
router.get('', async function(req, res) {
    var _id = getId();
    let data = await docs.findById(_id);
    var titolo = data['title'];
    var email = data['email'];
    var password =data['password'];
    var residenza=data['residenza'];

    res.status(200).json(data);

})


function getId()//qui dentro ricevaero dal jwt l'id medico
{
  return '6283a725e782405e1e1e21b1';
}

function getUser()//qui dentro ricevaero dal jwt l'id user
{
  return '6283a725e782702e1e1e21fe';
}

function creaPassword(pass){
  var hash = crypto.createHash('sha512');
  data = hash.update(pass, 'utf-8');
  gen_hash= data.digest('hex');
  return gen_hash;
}

router.post('', async function(req, res) {
        console.log('ecco una post');
        var email=req.body.email;
        var address=req.body.address;
        var password=req.body.password;
        var title=req.body.title;
        var _id=getId();


        docs.findByIdAndUpdate({_id},{"email": email,"address":address,"title":title}, function(err, result){
            console.log('sono nella update Medic');
            if(err){
                  console.log(err);
                  res.status(406).json({success: 'false', reason: 'esploso il db', error: '3'});
                  return;
        }
        else{
                  console.log('yuppi');

        }})

        var _id=getUser();

        if(password.length > 0){
          user.findByIdAndUpdate({_id},{"email": email,"password":creaPassword(password)}, function(err, result){
              console.log('sono nella update User');
              console.log(creaPassword(password));
              if(err){
                    console.log(err);
                    res.status(406).json({success: 'false', reason: 'esploso il db', error: '3'});
                    return;
          }
          })
          return;
        }
        else{
          user.findByIdAndUpdate({_id},{"email": email}, function(err, result){
              console.log('sono nella update User');
              if(err){
                    console.log(err);
                    res.status(406).json({success: 'false', reason: 'esploso il db', error: '3'});
                    return;
          }
          })
          return;
        }

        console.log('yuppi');
        res.status(200).json({success: 'true',comment:'eheh'});
        return;
        return;

});


module.exports = router;
