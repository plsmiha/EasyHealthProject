const express = require('express');
const router = express.Router();
const docs = require('./models/doc');
const user = require('./models/user');
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
router.post('', async function(req, res) {
        console.log('ecco una post');
        var email=req.body.email;
        var address=req.body.address;
        var password=req.body.password;
        var title=req.body.title;
        var _id=getId();
        var _user=getUser();

        if(password.length == 0){



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
          user.findByIdAndUpdate({_id},{"email": email,}, function(err, result){
              console.log('sono nella update User');
              if(err){
                    console.log(err);
                    res.status(406).json({success: 'false', reason: 'esploso il db', error: '3'});
                    return;
          }
          else{
                    console.log('yuppi');
                    res.status(200).json({success: 'true',comment:'eheh'});
                    return;
          }})
          return;
        }
        else{
            console.log('diversa  di 0');
            res.status(200).json({success: 'Modificati i dati ma non password',comment:'eheh'});
            return;
        }

        res.status(200).json({success: 'true',comment:'eheh'});
        return;

});


module.exports = router;
