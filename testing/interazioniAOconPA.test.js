const fetch = require("node-fetch");
require("dotenv").config();
const funzioni = require("./funzioniUtili");

const url =  "http://localhost"
var id_delete;
const paName="PATaroccoTestCases";
const datiPA =JSON.stringify({
name: paName,
sconto:30
})

//uncommentare tutti i console.log per vedere le modifiche al db in corso d'opera
//rename //console.log => console.log
const meta = {'Content-Type': 'application/json',cookie:'access_token='+process.env.AO_TOKEN};

it('[LOGGATO] <200> GET dati PA', async () => {

  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'GET', headers: meta}) .then((res) => {
    code = res.status;
    return res.json()
  })
  .then((jsonResponse) => {
    data=jsonResponse;
  })

  expect( code ).toEqual(200);
  var nomi='';
  for (var property in data) {
      nomi=nomi+data[property]["name"]+'; '
}
//console.log('PA iniziali: ',nomi)
})

it('[LOGGATO] <200> POST nuovo PA', async () => {

  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'POST',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(200);

})

it('[LOGGATO] <proof> GET dati PA dopo POST(e retrive id nuovo elemento)', async () => {

  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'GET', headers: meta}) .then((res) => {
    code = res.status;
    return res.json()
  })
  .then((jsonResponse) => {
    data=jsonResponse;
  })

  expect( code ).toEqual(200);

  var nomi='';
  for (var property in data) {
      nomi=nomi+data[property]["name"]+'; '
      if(data[property]["name"] == paName){
        id_delete=data[property]['_id'];//setto l'id da eliminare poi
    }
}
//console.log('PA dopo POST: ',nomi)
})

it('[LOGGATO] <506> POST PA con nome esistente ', async () => {

  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'POST',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(506);

})

it('[LOGGATO] <504> POST PA con sconto non valido', async () => {

  var code;
  var data;
  const datiPA =JSON.stringify({
  name: "nuovoNome",
  sconto:200
  })

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'POST',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(504);

})

it('[LOGGATO] <400> POST PA con dati incompleti', async () => {

  var code;
  var data;
  const datiPA =JSON.stringify({
  sconto:10
  })

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'POST',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(400);

})

it('[LOGGATO] <200> PUT PA con dati validi', async () => {

  var code;
  var data;
  const datiPA =JSON.stringify({
  name: "nomeNuovissimoPerPA",
  sconto:10,
  id: id_delete
  })

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'PUT',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(200);

})

it('[LOGGATO] <506> PUT PA con nome non valido', async () => {

  var code;
  var data;
  const datiPA =JSON.stringify({
  name: "vitatua",
  sconto:10,
  id: id_delete
  })

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'PUT',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(506);

})

it('[LOGGATO] <504> PUT PA con sconto non valido', async () => {

  var code;
  var data;
  const datiPA =JSON.stringify({
  name: "nomeRandom",
  sconto:101,
  id: id_delete
  })

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'PUT',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(504);

})

it('[LOGGATO] <504> PUT PA con dati incompleti', async () => {

  var code;
  var data;
  const datiPA =JSON.stringify({
  name: "nomeRandom",
  id: id_delete
  })

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'PUT',body:datiPA ,headers: meta})

  expect( response.status ).toEqual(400);

})

it('[LOGGATO] <proof> GET dati PA dopo PUT', async () => {

  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'GET', headers: meta}) .then((res) => {
    code = res.status;
    return res.json()
  })
  .then((jsonResponse) => {
    data=jsonResponse;
  })

  expect( code ).toEqual(200);
  var nomi='';
  for (var property in data) {
      nomi=nomi+data[property]["name"]+'; '
}
//console.log('PA dopo PUT: ',nomi)
})

it('[LOGGATO] <200> DELETE PA', async () => {

  var code;
  var data;

  const dati =JSON.stringify({
    id: id_delete
  });

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'DELETE',body:dati ,headers: meta})

  expect( response.status ).toEqual(200);
  //console.log("[LOGGATO] GET dati PA: ",data[0].name);

})

it('[LOGGATO] <proof> GET dati PA dopo DELETE', async () => {

  var code;
  var data;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/PA', {
    method: 'GET', headers: meta}) .then((res) => {
    code = res.status;
    return res.json()
  })
  .then((jsonResponse) => {
    data=jsonResponse;
  })

  expect( code ).toEqual(200);
  var nomi='';
  for (var property in data) {
      nomi=nomi+data[property]["name"]+'; '
}
//console.log('PA dopo DELETE: ',nomi)
})
