
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


 describe('[SUPERTEST] /api/v1/MedicoDaAO', () => {

       header={'Content-Type': 'application/json', cookie:tokenAO};
       var id_delete;

       test('[LOGGATO] <200> POST Aggiunta M', () => {
       return request(app).post('/api/v1/MedicoDaAO')
       .set(header)
       .send(JSON.stringify({
         email:"mailmedicoTMP@test.cases",
         bio:"BioMedico temporanea",
         title:"629d253a895003ae988773d5",
         numero:"777777777777",
         nome:"Medico",
         cognome:"temporaneo"

       }))
       .expect(200)});
       test('[LOGGATO] <400> POST Aggiunta M dati incompleti', () => {
       return request(app).post('/api/v1/MedicoDaAO')
       .set(header)
       .send(JSON.stringify({
         bio:"BioMedico temporanea",
         title:"629d253a895003ae988773d5",
         numero:"777777777777",
         nome:"Medico",
         cognome:"temporaneo"

       }))
       .expect(400)});
       test('[LOGGATO] <506> POST Aggiunta M mail utilizzata', () => {
       return request(app).post('/api/v1/MedicoDaAO')
       .set(header)
       .send(JSON.stringify({
         email:"ao@test.cases",
         bio:"BioMedico temporanea",
         title:"629d253a895003ae988773d5",
         numero:"777777777777",
         nome:"Medico",
         cognome:"temporaneo"

       }))
       .expect(506)});

       test('[LOGGATO] <dataGathering> GET id new M', () => {
       request(app).get('/api/v1/medic')
       .set(header)
       .set('Accept', 'application/json')
       .end((err,res) => {
                     data= JSON.parse(res.text);
                     for (var property in data) {

                         if(data[property]["email"] == "mailmedicoTMP@test.cases"){

                           id_delete=data[property]['_id'];//setto l'id da eliminare poi
                       }};
                 })

       });

       test('[LOGGATO] <200> PUT Modifica medico Da AO', () => {
       return request(app).put('/api/v1/MedicoDaAO?id='+id_delete)//id utente@resetPassword
       .set(header)
       .send(JSON.stringify(
         {
           email:"mailmedicoTMP@test.cases",
           bio:"NUOVA BioMedico temporanea",
           title:"629d253a895003ae988773d5",
           numero:"8888888888",
           nome:"Medico",
           cognome:"temporaneo"
         }
       ))
       .expect(200)});
       test('[LOGGATO] <400> PUT Modifica medico dati incompleti', () => {
       return request(app).put('/api/v1/MedicoDaAO?id='+id_delete)//id utente@resetPassword
       .set(header)
       .send(JSON.stringify(
         {
           bio:"NUOVA BioMedico temporanea",
           title:"629d253a895003ae988773d5",
           numero:"8888888888",
           nome:"Medico",
           cognome:"temporaneo"
         }
       ))
       .expect(400)});
       test('[LOGGATO] <406> PUT Modifica medico mail utilizzata', () => {
       return request(app).put('/api/v1/MedicoDaAO?id='+id_delete)//id utente@resetPassword
       .set(header)
       .send(JSON.stringify(
         {
           email:"ao@test.cases",
           bio:"NUOVA BioMedico temporanea",
           title:"629d253a895003ae988773d5",
           numero:"8888888888",
           nome:"Medico",
           cognome:"temporaneo"
         }
       ))
       .expect(400)});

       test('[LOGGATO] <200> DELETE P da AO', () => {
       return request(app).delete('/api/v1/MedicoDaAO?id='+id_delete)
       .set(header)
       .expect(200)});


 });
