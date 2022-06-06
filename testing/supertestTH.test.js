
const request = require('supertest');
const app = require('../Backend/api/app.js');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require("dotenv").config();

beforeAll( async () => { jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DB_URL_API);
});
afterAll( () => {
   mongoose.connection.close(true);
 });
beforeEach( async () => {//altrimenti il server taglia le connessioni se arrivano tutte in blocco
    await new Promise(resolve => setTimeout(resolve, 100));
 });


 const tokenM= 'access_token='+jwt.sign({id: "629d1dff46a2046f0591d629", role: "M"}, process.env.JWT_KEY);
 const tokenP='access_token='+jwt.sign({id: "629d1eb14c6160436acda633", role: "P"}, process.env.JWT_KEY);

 const tokenAO='access_token='+jwt.sign({id: "629d1b4f9cb6ddb084043776", role: "AO"}, process.env.JWT_KEY);


describe('[SUPERTEST] /api/v1/Medico', () => {


       header={'Content-Type': 'application/json', cookie:tokenM};

       test('[LOGGATO] <200> GET dati medico medico', () => {
       return request(app).get('/api/v1/Medico')
       .set(header)
       .expect(200)});

       test('[LOGGATO] <200> PUT Modifica dati medico medico', () => {
       return request(app).put('/api/v1/Medico')
       .set(header)
       .send(JSON.stringify(
         {
           email: "medico@test.cases",
           bio:"SONO UNA BIO MODIFICATA SIKE",
           numero:"3333333333",
           password:"",
           title:"628fbe011e0b7989431e2254"
         }
       ))
       .expect(200)});

       test('[LOGGATO] <200> PUT Restore dati medico medico', () => {
       return request(app).put('/api/v1/Medico')
       .set(header)
       .send(JSON.stringify(
         {
             email: "medico@test.cases",
             bio:"sono la bio di default",
             password:"password",
             numero:"3333333333",
             title:"628fbe011e0b7989431e2254"
           }
       ))
       .expect(200)});

       test('[LOGGATO] <506> PUT Modifica dati medico email registrata', () => {
       return request(app).put('/api/v1/Medico')
       .set(header)
       .send(JSON.stringify(
         {
             email: "ao@test.cases",
             bio:"sono la bio di default",
             password:"password",
             numero:"3333333333",
             title:"628fbe011e0b7989431e2254"
           }
       ))
       .expect(506)});

       test('[LOGGATO] <400> PUT Modifica dati medico medico incompleto', () => {
       return request(app).put('/api/v1/Medico')
       .set(header)
       .send(JSON.stringify(
         {
           email: "medico@test.cases",
           bio:"SONO UNA BIO MODIFICATA SIKE",
           password:"",
           title:"628fbe011e0b7989431e2254"
         }
       ))
       .expect(400)});

       test('[LOGGATO] Modifica dati medico medico email gia` usata <506>', () => {
       return request(app).put('/api/v1/Medico')
       .set(header)
       .send(JSON.stringify(
         {
           email: "paziente@test.cases",
           bio:"SONO UNA BIO MODIFICATA SIKE",
           password:"",
           title:"628fbe011e0b7989431e2254",
           numero:"3333333333"
         }
       ))
       .expect(506)});

 });

describe('[SUPERTEST] /api/v1/login', () => {


     test('[NON LOGGATO] <200> POST login con account P', () => {
     return request(app).post('/api/v1/login')
     .send({email: 'paziente@test.cases', password:"password"})
     .expect(200)});

     test('[NON LOGGATO] <200> POST login con account M', () => {
     return request(app).post('/api/v1/login')
     .send({email: 'medico@test.cases', password:"password"})
     .expect(200)});

     test('[NON LOGGATO] <200> POST login con account AO', () => {
       return request(app).post('/api/v1/login')
       .send({email: 'ao@test.cases', password:"password"})
       .expect(200)});

     test('[NON LOGGATO] <403> POST login con account P password errata', () => {
     return request(app).post('/api/v1/login')
     .send({email: 'paziente@test.cases', password:"passwordErrata"})
     .expect(403)});

     test('[NON LOGGATO] <403> POST login con account M password errata', () => {
     return request(app).post('/api/v1/login')
     .send({email: 'medico@test.cases', password:"passwordErrata"})
     .expect(403)});

     test('[NON LOGGATO] <403> POST login con account AO password errata', () => {
     return request(app).post('/api/v1/login')
     .send({email: 'ao@test.cases', password:"passwordErrata"})
     .expect(403)});

     test('[NON LOGGATO] <400> POST login con dati incompleti', () => {
     return request(app).post('/api/v1/login')
     .send({email: 'ao@test.cases'})
     .expect(400)});

 });

describe('[SUPERTEST] /api/v1/logout', () => {

      test('[LOGGATO] <200> POST logout con account P', () => {
      return request(app).post('/api/v1/logout')
      .set({'Content-Type': 'application/json', cookie:tokenP})
      .expect(200)});

      test('[LOGGATO] <200> POST logout con account M', () => {
      return request(app).post('/api/v1/logout')
      .set({'Content-Type': 'application/json', cookie:tokenM})
      .expect(200)});

      ck  = 'access_token='+process.env.AO_TOKEN;
      test('[LOGGATO] <200> POST logout con account AO', () => {
      return request(app).post('/api/v1/logout')
      .set({'Content-Type': 'application/json', cookie:tokenAO})
      .expect(200)});

      test('[NON LOGGATO] <403> POST logout senza token', () => {
      return request(app).post('/api/v1/logout')
      .expect(403)});


  });

describe('[SUPERTEST] /api/v1/resetPassword', () => {

    test('[NON LOGGATO] <200> POST Reset password', () => {
    return request(app).post('/api/v1/resetPassword')
    .send({email: 'utenteresetpassword@test.cases'})
    .expect(200)});

    test('[NON LOGGATO] <404> POST Reset password email inesistente', () => {
    return request(app).post('/api/v1/resetPassword')
    .send({email: 'emailInesistente@banana.com'})
    .expect(404)});

    test('[NON LOGGATO] <400> POST Reset password dati incompleti', () => {
    return request(app).post('/api/v1/resetPassword')
    .send({})
    .expect(400)});

});

describe('[SUPERTEST] /api/v1/PA', () => {

      var id_delete;
      var data;
      const paName="PATaroccoTestCases";
      const datiPA =JSON.stringify({
      name: paName,
      sconto:30
      })
      const header = {'Content-Type': 'application/json',cookie:tokenAO};

      test('[LOGGATO] <200> GET dati PA', () => {
      return request(app).get('/api/v1/PA')
      .set(header)
      .expect(200)});

      test('[LOGGATO] <200> POST nuovo PA', () => {
      return request(app).post('/api/v1/PA')
      .set(header)
      .send(datiPA)
      .expect(200)});

      test('[LOGGATO] <dataGathering> GET id new PA', () => {
      request(app).get('/api/v1/PA')
      .set(header)
      .set('Accept', 'application/json')
      .end((err,res) => {
                    data= JSON.parse(res.text);
                    for (var property in data) {
                        if(data[property]["name"] == paName){
                          id_delete=data[property]['_id'];//setto l'id da eliminare poi
                      }};
                })

      });

      test('[LOGGATO] <506> POST PA con nome esistente', () => {
      return request(app).post('/api/v1/PA')
      .set(header)
      .send(datiPA)
      .expect(506)});

      test('[LOGGATO] <504> POST PA con sconto non valido', () => {
      return request(app).post('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
      name: "nuovoNome",
      sconto:200
      }))
      .expect(504)});

      test('[LOGGATO] <400> POST PA con dati incompleti', () => {
      return request(app).post('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
      sconto:10
      }))
      .expect(400)});

      test('[LOGGATO] <200> PUT PA con dati validi', () => {
      return request(app).put('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
      name: "nomeNuovissimoPerPA",
      sconto:10,
      id: id_delete
      }))
      .expect(200)});

      test('[LOGGATO] <506> PUT PA con nome non valido', () => {
      return request(app).put('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
      name: "vitatua",
      sconto:10,
      id: id_delete
      }))
      .expect(506)});

      test('[LOGGATO] <504> PUT PA con sconto non valido', () => {
      return request(app).put('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
      name: "nomeRandom",
      sconto:101,
      id: id_delete
      }))
      .expect(504)});

      test('[LOGGATO] <400> PUT PA con dati incompleti', () => {
      return request(app).put('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
      name: "nomeRandom",
      id: id_delete
      }))
      .expect(400)});

      test('[LOGGATO] <200> DELETE PA', () => {
      return request(app).delete('/api/v1/PA')
      .set(header)
      .send(JSON.stringify({
        id: id_delete
      }))
      .expect(200)});




});
