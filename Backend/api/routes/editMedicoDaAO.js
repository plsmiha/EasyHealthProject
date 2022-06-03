const express = require('express');
const router = express.Router();
const docs = require('../../models/doc'); //importo il tipo doc, definito il suo schema in models/doc
const user = require('../../models/user'); //uguale con user
const crypto = require('crypto');

router.delete('', async function(req, res) {
    console.log('dentro delete backend');
    
    var id_user= await docs.findOne({_id: v}).id_user
    await user.deleteOne({_id: id_user})
    await docs.deleteOne({_id: req.query.id})
    res.status(200).json({success: 'true',comment:'medico eliminato'});
})

router.get('', async function(req, res) //quando ricevo una richiesta get su /api/v1/modmed entro qui
{
  var _user = req.query.id;

  docs.findOne({id_user:_user}).then(utente =>{

    var _id = String(utente._id).split('"')[0];

      docs.findById({_id}).then(data =>{
      
          res.status(200).json(data);
      }); //recupera tutte le info dalla tabella docs cercando l'id e le ritorna

      });
})

function metodoMagico(_email,bio,title,numero,nome,cognome,_id,_user,res,req)//essendo asincrone le richieste al db sono nidificate, ho fatto un metodoMagico perche` essendoci una serie
//di if avevo bisogno di ricapitare comunque in questo metodo e copia incollarlo non si fa, quindi sta qui dentro la gestione di invio roba al db per l'update di user e doc
{

                  docs.findByIdAndUpdate( //cerca e aggiorna {parametroDiRicerca} (devo ancora capire come usarne di diversi ma tanto coi token useremo questo)
                      // {"nomeParametroNelDb":variabile,"nomeParametroNelDb2":variabile2....}
                      {_id}, {"email": _email,"bio": bio,"title": title,"numero":numero,"name":nome,"surname":cognome  }, function(err, result) {

                          if (err) //errore nell'update
                          {
                              res.status(500).json({ success: 'false',reason: 'Database connection',error: 3  }); //droppo errore
                              return;
                          } else {
                              //carico l'id della tabella user per modificare mail
                            user.findByIdAndUpdate({_id:_user}, {"email": _email }, function(err, result) {
                                if (err) {
                                    res.status(500).json({success: 'false',  reason: 'Database connection',error: 3});
                                    return;

                                } else {
                                    res.status(200).json({success: 'true',  comment: 'eheh'});
                                    return;
                                }
                            })

                          }
                      }
                    )
}

router.put('', async function(req, res) //qui quando ricevo una put
    {
        //i dati della richiesta sono dentro a req.body, e` un dictionary a cui si accede ai campi con .nomeCampo
        var _email = req.body.email;
        var bio = req.body.bio;
        var title = req.body.title;
        var numero = req.body.numero;
        var nome = req.body.nome;
        var cognome = req.body.cognome;

        docs.findOne({_id:req.query.id}).then(utente =>{

          var _id = String(utente._id).split('"')[0];
          user.findOne({ email: _email }).then(data => {

              if (data != null) {
                  var tmp = String(data._id);

                  if (String(tmp.includes(utente.id_user)) == "false") {

                      res.status(506).json({success: 'false',  reason: "email gia usata",error: 1}); //droppo errore
                      return;
                  }
                  else{
                    metodoMagico(_email,bio,title,numero,nome,cognome,_id,utente.id_user,res,req);
                  }
              } else {

                  metodoMagico(_email,bio,title,numero,nome,cognome,_id,utente.id_user,res,req);
              }


          }).catch(err => {
            res.status(500).json({success: 'false',reason: 'bonk',error: 3});
              console.log(err);
          });

      });


    });

router.post('', async function(req, res) //qui quando ricevo una post
{
    //i dati della richiesta sono dentro a req.body, e` un dictionary a cui si accede ai campi con .nomeCampo
    var _email = req.body.email;
    var bio = req.body.bio;
    var title = req.body.title;
    var numero = req.body.numero;
    var nome = req.body.nome;
    var cognome = req.body.cognome;

    if(typeof _email == 'undefined' || typeof bio == 'undefined' || typeof title == 'undefined' || typeof numero == 'undefined' || typeof nome == 'undefined' || typeofcognome == 'undefined')
    {
        res.status(400).json({success: 'false', reason: 'Wrong format', error: '1'});
        return;
    }

    user_check = await User.find().where('email',req.body.email);
    if(Object.keys(user_check).length>=1)
    {
        res.status(406).json({success: 'false', reason: 'Email already exists', error: '3'});
        return;
    }

    let user = new User({
        email: req.body.email,
        password: "",
        type: 'M',
        verified: false
    });
    user = await user.save();

    let doc = new docs({
        id_user: user._id.valueOf(),
        email:_email,
        name: nome,
        surname: cognome,
        address: req.body.address,
        CF: req.body.CF,
        codePA: req.body.codePA==''?null:req.body.codePA
    })
    patient = await patient.save();

    let link = process.env.DOMAIN + "/api/v1/verifyEmail?id=" + user._id.valueOf();
    transporter.sendMail({
        from: '"EasyHealth+" <easy.health.app.info@gmail.com>',
        to: req.body.email,
        subject: "Conferma il tuo account su EasyHealth+ ✔",
        text: "",
        html: "<a href='"+link+"'>Clicca qui per confermare la tua identità!</a> O copia incolla il link qui sotto:<br/>"+link,
    }).then().catch(console.error);

    res.status(200).json({success: 'true'});
    console.log("User saved");

});


});

module.exports = router;
