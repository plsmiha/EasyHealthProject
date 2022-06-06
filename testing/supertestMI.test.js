
const request = require('supertest');
const app = require('../Backend/api/app.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');


beforeAll( async () => { jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DB_URL_API);
});
afterAll( () => {
   mongoose.connection.close(true);
 });
beforeEach( async () => {//altrimenti il server taglia le connessioni se arrivano tutte in blocco
    await new Promise(resolve => setTimeout(resolve, 50));
 });


 const tokenM= 'access_token='+jwt.sign({id: "629d1dff46a2046f0591d629", role: "M"}, process.env.JWT_KEY);
 const tokenP='access_token='+jwt.sign({id: "629d1eb14c6160436acda633", role: "P"}, process.env.JWT_KEY);
 const tokenAO='access_token='+jwt.sign({id: "629d1b4f9cb6ddb084043776", role: "AO"}, process.env.JWT_KEY);

describe('[SUPERTEST] /api/v1/Paziente', () => {

    header={'Content-Type': 'application/json', cookie: tokenP};
    headerM={'Content-Type': 'application/json', cookie: tokenM}; 

      test('[LOGGATO] <200> PUT Modifica dei dati paziente da P', () => {
      return request(app).put('/api/v1/Paziente')
      .set(header)
      .send(JSON.stringify(
        {
          email: "paziente1@test.cases",
          residenza: "casa modificata",
          codePA:"6298f524110402d55566676f",
          password:""
        }
      ))
      .expect(200)});

      test('[LOGGATO] <200> GET dati paziente aggiornati', () => {
        return request(app).get('/api/v1/Paziente')
        .set(header)
        .expect(200)
        .then((res)=>{
            expect(res.body.email).toEqual('paziente1@test.cases');
            expect(res.body.address).toEqual('casa modificata');
            expect(res.body.codePA).toEqual('6298f524110402d55566676f')
        })
      
      });
      test('[LOGGATO] <404> GET di un paziente non esistente', () => {
        return request(app).get('/api/v1/Paziente')
        .set(headerM)
        .expect(404)
      });

      test('[LOGGATO] <200> PUT Restore dati paziente paziente', () => {
      return request(app).put('/api/v1/Paziente')
      .set(header)
      .send(JSON.stringify(
        {
            email: "paziente@test.cases",
            residenza: "casa sua",
            codePA:"6283a7aee2e7187daa534598",
            password:"password"
          }
      ))
      .expect(200)});

      test('[LOGGATO] <403> PUT Modifica dei dati paziente da M', () => {
        return request(app).put('/api/v1/Paziente')
        .set(headerM)
        .send(JSON.stringify(
          {
            email: "paziente1@test.cases",
            residenza: "casa modificata",
            codePA:"6298f524110402d55566676f",
            password:""
          }
        ))
        .expect(403)});

      test('[LOGGATO] <400> PUT Modifica dati paziente da P incompleto', () => {
      return request(app).put('/api/v1/Paziente')
      .set(header)
      .send(JSON.stringify(
        {
            email: "paziente@test.cases",
            codePA:"6283a7aee2e7187daa534598",
            password:""
        }
      ))
      .expect(400)});

      test('[LOGGATO] <406> Modifica dati paziente da P email gia` usata ', () => {
      return request(app).put('/api/v1/Paziente')
      .set(header)
      .send(JSON.stringify(
        {
          email: "medico@test.cases",
          residenza: "casa sua",
          codePA:"6283a7aee2e7187daa534598",
          password:"password"
        }
      ))
      .expect(406)});

});

describe('[SUPERTEST] /api/v1/Paziente/all', () => {

    headerP={'Content-Type': 'application/json', cookie: tokenP};
    headerM={'Content-Type': 'application/json', cookie: tokenM};
    headerAO={'Content-Type': 'application/json', cookie: tokenAO};

      test('[LOGGATO] <200> GET Ps da AO', () => {
        return request(app).get('/api/v1/Paziente/all')
        .set(headerAO)
        .expect(200);
      });

      test('[LOGGATO] <200> GET all Ps da M', () => {
        return request(app).get('/api/v1/Paziente/all')
        .set(headerM)
        .expect(200);
      });

      test('[LOGGATO] <403> GET all Ps da P', () => {
        return request(app).get('/api/v1/Paziente/all')
        .set(headerP)
        .expect(403);
      });
  
});

describe('[SUPERTEST] /api/v1/Prenotazione', () => {

    headerP={'Content-Type': 'application/json', cookie: tokenP};
    headerM={'Content-Type': 'application/json', cookie: tokenM};
    headerAO={'Content-Type': 'application/json', cookie: tokenAO};
    
    const id_medico= "629d1dff46a2046f0591d62b";
    const not_id= "629b21b9c75ce70fe210284";

//______________GET SLOT______________________________________________

      test('[LOGGATO] <200> GET slot liberi da AO', () => {
        return request(app).get('/api/v1/Prenotazione?id='+id_medico)
        .set(headerAO)
        .expect(200);
      });

      test('[LOGGATO] <403> GET slot liberi da M', () => {
        return request(app).get('/api/v1/Prenotazione?id='+id_medico)
        .set(headerM)
        .expect(403);
      });

      test('[LOGGATO] <200> GET slot liberi  da P', () => {
        return request(app).get('/api/v1/Prenotazione?id='+id_medico)
        .set(headerP)
        .expect(200);
      });

      test('[LOGGATO] <406> GET slot passando id medico formato sbagliato', () => {
        return request(app).get('/api/v1/Prenotazione?id='+not_id)
        .set(headerP)
        .expect(406);
      });

//___________PRENOTA SLOT______________________________________________________________

    var id_slot= "629d2ad11f6e21af9186091f";
    var not_slot="629d2ad11f6e21af9146091f";
      
    test('[LOGGATO] <200> PUT prenotato da P', () => {
        return request(app).put('/api/v1/Prenotazione')
        .set(headerP)
        .send(JSON.stringify({
            _idSlot: id_slot
        }))
        .expect(200);
    });
    

    test('[LOGGATO] <404> PUT prenotato da P SLOT GIA PRENOTATO', () => {
        return request(app).put('/api/v1/Prenotazione')
        .set(headerP)
        .send(JSON.stringify({
            _idSlot: id_slot
        }))
        .expect(404);
    });

    test('[LOGGATO] <200> DELETE restore slot eliminando prenotazione', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+id_slot)
        .set(headerP)
        .expect(200);
    });

    test('[LOGGATO] <403> PUT prenotato da M', () => {
        return request(app).put('/api/v1/Prenotazione')
        .set(headerM)
        .expect(403);
    });

    test('[LOGGATO] <403> PUT prenotato da AO', () => {
        return request(app).put('/api/v1/Prenotazione')
        .set(headerAO)
        .send(JSON.stringify({
            _idSlot: id_slot
        }))
        .expect(403);
    });

    test('[LOGGATO] <404> PUT prenotato uno slot inesistente (=idSlotSbagliato)', () => {
        return request(app).put('/api/v1/Prenotazione')
        .set(headerP)
        .send(JSON.stringify({
            _idSlot: not_slot
        }))
        .expect(404);
    });
  
});

describe('[SUPERTEST] /api/v1/Medico/id', () => {

    headerP={'Content-Type': 'application/json', cookie: tokenP};

    const id_doc="629d1dff46a2046f0591d62b";
    const not_id="629d1dff46a2046f1591d72";
    const wrong_id = "629d1dff46a2046f1591d72b";

      test('[LOGGATO] <200> GET doc by id ', () => {
        return request(app).get('/api/v1/Medico/'+id_doc)
        .set(headerP)
        .expect(200);
      });

      test('[LOGGATO] <403> GET formato id non valido', () => {
        return request(app).get('/api/v1/Medico/'+not_id)
        .set(headerP)
        .expect(403);
      });

      test('[LOGGATO] <404> GET id inesistente', () => {
        return request(app).get('/api/v1/Medico/'+wrong_id)
        .set(headerP)
        .expect(404);
      });
  
});

describe('[SUPERTEST] /api/v1/agendaPaziente', () => {

    headerP={'Content-Type': 'application/json', cookie: tokenP};
    headerM={'Content-Type': 'application/json', cookie: tokenM};
    headerAO={'Content-Type': 'application/json', cookie: tokenAO};

//________________GET APPUNTAMENTI PRESI DA P___________________________________

      test('[LOGGATO] <200> GET visite di P da P', () => {
        return request(app).get('/api/v1/agendaPaziente')
        .set(headerP)
        .expect(200);
      });

      test('[LOGGATO] <403> GET visite di P da AO', () => {
        return request(app).get('/api/v1/agendaPaziente')
        .set(headerAO)
        .expect(403);
      });

      test('[LOGGATO] <403> GET visite di P da M', () => {
        return request(app).get('/api/v1/agendaPaziente')
        .set(headerM)
        .expect(403);
      });

//_____________________ELIMINA PRENOTAZIONE___________________________
      var id_slot ="629d47a11f6e21af91860921";
      var libero_slot="629d2ad11f6e21af9186091f";
      var non_mio ="629d48291f6e21af91860924";
      var oggi_slot="629d48ee1f6e21af91860927";
      var wrong_id="629d47a11f6e21af9186092";

      test('[LOGGATO] <200> DELETE uno slot di P da P non di oggi', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+id_slot)
        .set(headerP)
        .expect(200);
    });

    test('[LOGGATO] <200> PUT restore slot occupato', () => {
        return request(app).put('/api/v1/Prenotazione')
        .set(headerP)
        .send(JSON.stringify({
            _idSlot: id_slot
        }))
        .expect(200);
    });

    test('[LOGGATO] <403> DELETE uno slot di P da AO', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+id_slot)
        .set(headerAO)
        .expect(403);
    });
    test('[LOGGATO] <403> DELETE uno slot di P da M', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+id_slot)
        .set(headerM)
        .expect(403);
    });

    test('[LOGGATO] <404> DELETE uno slot libero', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+libero_slot)
        .set(headerP)
        .expect(404);
    });

    test('[LOGGATO] <404> DELETE uno slot di X da P', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+non_mio)
        .set(headerP)
        .expect(404);
    });
    

   /* test('[LOGGATO] <404> DELETE uno slot di P di oggi', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+oggi_slot)
        .set(headerP)
        .expect(404);
    });*/

    test('[LOGGATO] <406> DELETE passo slot con id format sbagliato', () => {
        return request(app).delete('/api/v1/agendaPaziente/'+wrong_id)
        .set(headerP)
        .expect(406);
    });
    
});



