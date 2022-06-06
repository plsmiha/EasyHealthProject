
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



describe('[SUPERTEST] /api/v1/signup (include Interazioni AO con P)', () => {

       header={'Content-Type': 'application/json', cookie:tokenAO};
       var id_delete;
       test('[NON LOGGATO] <200> POST Aggiunta P', () => {
       return request(app).post('/api/v2/signup')
       .set(header)
       .send(JSON.stringify({
           name:"Jhonny",
           surname:"Bravo",
           CF:"asd234asd3",
           address:"casa testcases",
           email:"jhonnyGood@test.cases",
           password:"password123$",
           codePA:"6298f524110402d55566676f"
       }))
       .expect(200)});
       test('[NON LOGGATO] <406> POST Aggiunta P con email presente', () => {
       return request(app).post('/api/v2/signup')
       .set(header)
       .send(JSON.stringify({
           name:"Jhonny",
           surname:"Bravo",
           CF:"asd234543sdfg",
           address:"casa testcases",
           email:"paziente@test.cases",
           password:"password123$",
           codePA:"6298f524110402d55566676f"
       }))
       .expect(406)});
       test('[NON LOGGATO] <406> POST Aggiunta P con CF presente', () => {
       return request(app).post('/api/v2/signup')
       .set(header)
       .send(JSON.stringify({
           name:"Jhonny",
           surname:"Bravo",
           CF:"asd234asd3",
           address:"casa testcases",
           email:"mailNuovissima@test.cases",
           password:"password123$",
           codePA:"6298f524110402d55566676f"
       }))
       .expect(406)});
       test('[NON LOGGATO] <400> POST Aggiunta P con dati incompleti', () => {
       return request(app).post('/api/v2/signup')
       .set(header)
       .send(JSON.stringify({
           name:"Jhonny",
           surname:"Bravo",
           CF:"asd234asd3",
           email:"mailNuovissima@test.cases",
           password:"password123$",
           codePA:"6298f524110402d55566676f"
       }))
       .expect(400)});

       test('[LOGGATO] <dataGathering> GET id new P', () => {
       request(app).get('/api/v1/Paziente/all')
       .set(header)
       .set('Accept', 'application/json')
       .end((err,res) => {
                     data= JSON.parse(res.text);
                     for (var property in data) {

                         if(data[property]["CF"] == "asd234asd3"){

                           id_delete=data[property]['_id'];//setto l'id da eliminare poi
                       }};
                 })

       });
       test('[LOGGATO] <databaseRestore> DELETE P', () => {
       return request(app).delete('/api/v1/PazienteDaAO?id='+id_delete)
       .set(header)
       .expect(200)});

 });


 describe('[SUPERTEST] /api/v1/PazienteDaAO', () => {

       header={'Content-Type': 'application/json', cookie:tokenAO};
       var id_delete;

       test('[LOGGATO] <200> PUT Modifica paziente Da AO', () => {
       return request(app).put('/api/v1/PazienteDaAO?id=629d1fbb4c6160436acda63f')//id utente@resetPassword
       .set(header)
       .send(JSON.stringify(
         {
           email: "utenteresetpassword@test.cases",
           residenza:"casa utente reset",
           nome:"reset",
           cognome:"myPassword",
           codePA:"6298f524110402d55566676f"
         }
       ))
       .expect(200)});
       test('[LOGGATO] <400> PUT Modifica paziente Da AO dati incompleti', () => {
       return request(app).put('/api/v1/PazienteDaAO?id=629d1fbb4c6160436acda63f')//id utente@resetPassword
       .set(header)
       .send(JSON.stringify(
         {
           residenza:"casa utente reset",
           nome:"reset",
           cognome:"myPassword",
           codePA:"6298f524110402d55566676f"
         }
       ))
       .expect(400)});
       test('[LOGGATO] <403> PUT Modifica paziente Da AO email in uso', () => {
       return request(app).put('/api/v1/PazienteDaAO?id=629d1fbb4c6160436acda63f')//id utente@resetPassword
       .set(header)
       .send(JSON.stringify(
         {
           email:"ao@test.cases",
           residenza:"casa utente reset",
           nome:"reset",
           cognome:"myPassword",
           codePA:"6298f524110402d55566676f"
         }
       ))
       .expect(403)});


       test('[LOGGATO] <dataGathering> POST Aggiunta P (per testare eliminazione)', () => {
       return request(app).post('/api/v2/signup')
       .set(header)
       .send(JSON.stringify({
           name:"Da",
           surname:"Abbattere",
           CF:"asasdw4edsqad",
           address:"casa testcases",
           email:"abbattimi@test.cases",
           password:"password123$",
           codePA:"6298f524110402d55566676f"
       }))
       .expect(200)});
       test('[LOGGATO] <dataGathering> GET id new P', () => {
       request(app).get('/api/v1/Paziente/all')
       .set(header)
       .set('Accept', 'application/json')
       .end((err,res) => {
                     data= JSON.parse(res.text);
                     for (var property in data) {

                         if(data[property]["CF"] == "asasdw4edsqad"){

                           id_delete=data[property]['_id'];//setto l'id da eliminare poi
                       }};
                 })

       });
       test('[LOGGATO] <200> DELETE P da AO', () => {
       return request(app).delete('/api/v1/PazienteDaAO?id='+id_delete)
       .set(header)
       .expect(200)});


 });
