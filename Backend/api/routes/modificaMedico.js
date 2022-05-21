const express = require('express');
const router = express.Router();
const docs = require('../../models/doc'); //importo il tipo doc, definito il suo schema in models/doc
const user = require('../../models/user'); //uguale con user
const crypto = require('crypto');
router.get('', async function(req, res) //quando ricevo una richiesta get su /api/v1/modmed entro qui
    {
        var _id = getId();
        let data = await docs.findById(_id); //recupera tutte le info dalla tabella docs cercando l'id e le ritorna

        res.status(200).json(data);

    })


function getId() //qui dentro ricevaero dal jwt l'id medico
{
    return '6283a725e782405e1e1e21b1';
}

function getUser() //qui dentro ricevaero dal jwt l'id user
{
    return '6283a725e782702e1e1e21fe';
}

function creaPassword(pass) //funzione che genera l'hash della psw per non mandare robe in chiaro al db, deve essere questa la func o non sono coerenti
{
    var hash = crypto.createHash('sha512');
    data = hash.update(pass, 'utf-8');
    gen_hash = data.digest('hex');
    return gen_hash;
}


function metodoMagico(_email,address,password,title,_id,_user,res,req){

                  docs.findByIdAndUpdate( //cerca e aggiorna {parametroDiRicerca} (devo ancora capire come usarne di diversi ma tanto coi token useremo questo)
                      // {"nomeParametroNelDb":variabile,"nomeParametroNelDb2":variabile2....}
                      {
                          _id
                      }, {
                          "email": _email,
                          "address": address,
                          "title": title
                      },
                      function(err, result) {
                          console.log('Update tabella docs');
                          if (err) //errore nell'update
                          {
                              console.log('Errore update tabella docs');
                              res.status(500).json({
                                  success: 'false',
                                  reason: 'Database connection',
                                  error: '3'
                              }); //droppo errore
                              return;

                          } else {

                              console.log('Update tabella docs RIUSCITO');
                              _id = getUser(); //carico l'id della tabella user per modificare mail e password anche li

                              if (password.length > 0) //in caso la password non debba essere modificata e` lasciata a vuoto quindi length==0 e aggiorna solo l'email nella tabella user (else) altrimenti aggiorna anche password
                              {
                                  console.log('Update tabella user CON PSW')
                                  user.findByIdAndUpdate({
                                      _id
                                  }, {
                                      "email": _email,
                                      "password": creaPassword(password)
                                  }, function(err, result) {
                                      if (err) {
                                          console.log('Errore update tabella user CON PSW');
                                          res.status(500).json({
                                              success: 'false',
                                              reason: 'Database connection',
                                              error: '3'
                                          });
                                          return;

                                      } else {
                                        console.log('sono qui detrp')
                                          res.status(200).json({
                                              success: 'true',
                                              comment: 'eheh'
                                          });
                                          console.log('Update tabella user RIUSCITO');
                                          return;
                                      }
                                  })


                              } else //password == 0
                              {
                                  console.log('Update tabella user SENZA PSW')
                                  user.findByIdAndUpdate({
                                      _id
                                  }, {
                                      "email": _email
                                  }, function(err, result) {
                                      if (err) {
                                          console.log('Errore update tabella user SENZA PSW');
                                          res.status(500).json({
                                              success: 'false',
                                              reason: 'Database connection',
                                              error: '3'
                                          });
                                          return;

                                      } else {
                                        console.log('sono quello sotto')
                                          res.status(200).json({
                                              success: 'true',
                                              comment: 'eheh'
                                          });
                                          console.log('Update tabella user RIUSCITO');
                                          return;
                                      }
                                  })

                              }


                          }
                      }
                  )
}

router.post('', async function(req, res) //qui quando ricevo una post
    {
        console.log('Ricevuta POST');

        //i dati della richiesta sono dentro a req.body, e` un dictionary a cui si accede ai campi con .nomeCampo
        var _email = req.body.email;
        var address = req.body.address;
        var password = req.body.password;
        var title = req.body.title;
        var _id = getId(); //carico l'id della tabella doc per aggiornare le varie info
        var _user = getUser();


        user.findOne({ email: _email }).then(data => {
            if (data != null) {
                var tmp = String(data._id);

                if (String(tmp.includes(_user)) == "false") {

                    res.status(500).json({
                        success: 'false',
                      reason: "email gia usata",
                      error: '1'
                    }); //droppo errore
                    return;
                }
                else{
                  metodoMagico(_email,address,password,title,_id,_user,res,req);
                }
            } else {

                metodoMagico(_email,address,password,title,_id,_user,res,req);
            }


        }).catch(err => {
          res.status(500).json({
              success: 'false',
              reason: 'bonk',
              error: '3'
          }); //droppo errore

            console.log(err);
        });

    });


module.exports = router;
