const express = require('express');
const router = express.Router();

const user = require('../../models/user'); //uguale con user
const crypto = require('crypto');
router.get('', async function(req, res) //quando ricevo una richiesta get su /api/v1/modmed entro qui
{
  var _user = getUser(req);

  user.findOne({_id:_user}).then(utente =>{

    var _id = String(utente._id).split('"')[0];

      user.findById({_id}).then(data =>{
          res.status(200).json(data);
      }); //recupera tutte le info dalla tabella user cercando l'id e le ritorna

      });
})



function getUser(req) //qui dentro ricevaero dal jwt l'id user, attesa token ascari
{
    return req.jwtData.id;
}

function creaPassword(pass) //funzione che genera l'hash della psw per non mandare robe in chiaro al db, deve essere questa la func o non sono coerenti
{
    var hash = crypto.createHash('sha512');
    data = hash.update(pass, 'utf-8');
    gen_hash = data.digest('hex');
    return gen_hash;
}

function metodoMagico(_email,password,_user,res,req)//essendo asincrone le richieste al db sono nidificate, ho fatto un metodoMagico perche` essendoci una serie
//di if avevo bisogno di ricapitare comunque in questo metodo e copia incollarlo non si fa, quindi sta qui dentro la gestione di invio roba al db per l'update di user e doc
{

                  user.findByIdAndUpdate( //cerca e aggiorna {parametroDiRicerca} (devo ancora capire come usarne di diversi ma tanto coi token useremo questo)
                      // {"nomeParametroNelDb":variabile,"nomeParametroNelDb2":variabile2....}
                      {_id:_user}, {"email": _email  }, function(err, result) {

                          if (err) //errore nell'update
                          {
                              res.status(500).json({ success: 'false',reason: 'Database connection',error: 3  }); //droppo errore
                              return;
                          } else {
                              //carico l'id della tabella user per modificare mail e password anche li
                              if (password.length > 0) //in caso la password non debba essere modificata e` lasciata a vuoto quindi length==0 e aggiorna solo l'email nella tabella user (else) altrimenti aggiorna anche password
                              {
                                  user.findByIdAndUpdate({_id:_user}, {"email": _email,  "password": creaPassword(password)}, function(err, result) {
                                      if (err) {
                                          res.status(500).json({success: 'false',  reason: 'Database connection',error: 3});
                                          return;

                                      } else {
                                          res.status(200).json({success: 'true',  comment: 'eheh'});
                                          return;
                                      }
                                  })
                              } else //password == 0
                              {
                                  user.findByIdAndUpdate({  _id:_user}, {"email": _email}, function(err, result) {
                                      if (err) {
                                          res.status(500).json({success: 'false',  reason: 'Database connection',error: 3});
                                          return;

                                      } else {
                                          res.status(200).json({ success: 'true',comment: 'eheh'});
                                          return;
                                      }
                                  })
                              }
                          }
                      }
                    )
}

router.put('', async function(req, res) //qui quando ricevo una post
    {
        //i dati della richiesta sono dentro a req.body, e` un dictionary a cui si accede ai campi con .nomeCampo
        if(typeof req.body.email == 'undefined' ||  typeof req.body.password == 'undefined')
        {
            res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
            console.log('wrong format');
        }
        var _email = req.body.email;

        var password = req.body.password;

        var _user = getUser(req);
        console.log(_user);

        user.findOne({ _id:_user }).then(data => {
              if (data != null) {
                  var tmp = String(data._id);

                  if (String(tmp.includes(_user)) == "false") {

                      res.status(506).json({success: 'false',  reason: "email gia usata",error: 1}); //droppo errore
                      return;
                  }
                  else{
                    metodoMagico(_email,password,_user,res,req);
                  }
              } else {

                  metodoMagico(_email,password,_user,res,req);
              }


          }).catch(err => {
            res.status(500).json({success: 'false',reason: err,error: 3});
              console.log(err);
          });




    });


module.exports = router;
