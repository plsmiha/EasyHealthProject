const fetch = require("node-fetch");
require("dotenv").config();
const funzioni = require("./funzioniUtili");
const url =  "http://localhost"
const email="utenteresetpassword@test.cases"

it('[NON LOGGATO] <200> Reset password', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',

  };
  const body ={
    email:email
  }
  var code;
  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/resetPassword', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: meta})
  expect( response.status ).toEqual(200);

})

it('[NON LOGGATO] <404> Reset password email inesistente', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',

  };
  const body ={
    email:"emailInesistente@banana.com"
  }
  var code;
  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/resetPassword', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: meta})
  expect( response.status ).toEqual(404);

})

it('[NON LOGGATO] <400> Reset password dati incompleti', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',

  };
  const body ={

  }
  var code;
  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/resetPassword', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: meta})
  expect( response.status ).toEqual(400);

})
