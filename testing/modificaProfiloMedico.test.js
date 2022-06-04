const fetch = require("node-fetch");
require("dotenv").config();
const funzioni = require("./funzioniUtili");
const url =  "http://localhost"

const defaultMedico ={
  email: "medico@test.cases",
  bio:"sono la bio di default",
  password:"password",
  numero:"3333333333",
  title:"628fbe011e0b7989431e2254"
}


it('[LOGGATO] GET dati medico medico <200>', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token
  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };
  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'GET', headers: meta}) .then((res) => {
    code = res.status;
    return res.json()
  })
  .then((jsonResponse) => {
    data=jsonResponse;
  })

  expect( code ).toEqual(200);
  //console.log("[LOGGATO] GET dati medico medico: ",data.bio);
})

it('[LOGGATO] Modifica dati medico medico <200>', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token
  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };
  const body ={
    email: "medico@test.cases",
    bio:"SONO UNA BIO MODIFICATA SIKE",
    numero:"3333333333",
    password:"",
    title:"628fbe011e0b7989431e2254"
  }
  var code;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: meta})
  expect( response.status ).toEqual(200);

})

it('[LOGGATO] GET nuovi dati medico medico <200>', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token
  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };
  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'GET', headers: meta}) .then((res) => {
    code = res.status;
    return res.json()
  })
  .then((jsonResponse) => {
    data=jsonResponse;
  })

  expect( code ).toEqual(200);
  //console.log("[LOGGATO] GET nuovi dati medico medico: ",data.bio);
})

it('[LOGGATO] Restore dati medico medico <200>', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token
  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };

  var code;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'PUT',
    body: JSON.stringify(defaultMedico),
    headers: meta})
  expect( response.status ).toEqual(200);

})

it('[LOGGATO] Modifica dati medico medico incompleto <400>', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token
  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };
  const body ={
    email: "medico@test.cases",
    bio:"SONO UNA BIO MODIFICATA SIKE",
    password:"",
    title:"628fbe011e0b7989431e2254"
  }
  var code;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: meta})
  expect( response.status ).toEqual(400);

})

it('[LOGGATO] Modifica dati medico medico email gia` usata <506>', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token
  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };
  const body ={
    email: "paziente@test.cases",
    bio:"SONO UNA BIO MODIFICATA SIKE",
    password:"",
    title:"628fbe011e0b7989431e2254",
    numero:"3333333333"
  }
  var code;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: meta})
  expect( response.status ).toEqual(506);

})
