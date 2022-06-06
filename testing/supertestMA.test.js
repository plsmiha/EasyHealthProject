
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
beforeEach( async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
});


 const tokenM= 'access_token='+jwt.sign({id: "629d1dff46a2046f0591d629", role: "M"}, process.env.JWT_KEY);
 const tokenP='access_token='+jwt.sign({id: "629d1eb14c6160436acda633", role: "P"}, process.env.JWT_KEY);

 const tokenAO='access_token='+jwt.sign({id: "629d1b4f9cb6ddb084043776", role: "AO"}, process.env.JWT_KEY);


describe('[SUPERTEST] /api/v1/verifyEmail', () => {


      header={'Content-Type': 'application/json'};

      test('[NON LOGGATO] <302> GET verifica email con id corretto', () => {
        return request(app).get('/api/v1/verifyEmail?id=629d1eb14c6160436acda633')
        .set(header)
        .expect(302)});

      test('[NON LOGGATO] <400> GET verifica email senza id', () => {
        return request(app).get('/api/v1/verifyEmail')
        .set(header)
        .expect(400)});
      
      test('[NON LOGGATO] <302> GET verifica email con id non esistente', () => {
        return request(app).get('/api/v1/verifyEmail?id=629d1eb14c6160436ac')
        .set(header)
        .expect(302)});

});

describe('[SUPERTEST] /api/v1/agendaMedico', () => {


  header={'Content-Type': 'application/json'};

  test('[NON LOGGATO] <302> GET verifica email con id corretto', () => {
    return request(app).get('/api/v1/verifyEmail?id=629d1eb14c6160436acda633')
    .set(header)
    .expect(302)});

  test('[NON LOGGATO] <400> GET verifica email senza id', () => {
    return request(app).get('/api/v1/verifyEmail')
    .set(header)
    .expect(400)});
  
  test('[NON LOGGATO] <302> GET verifica email con id non esistente', () => {
    return request(app).get('/api/v1/verifyEmail?id=629d1eb14c6160436ac')
    .set(header)
    .expect(302)});

});