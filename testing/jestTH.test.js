const fetch = require("node-fetch");
require("dotenv").config();
const url =  "http://localhost";
const jwt = require('jsonwebtoken');

const tokenM= 'access_token='+jwt.sign({id: "629d1dff46a2046f0591d629", role: "M"}, process.env.JWT_KEY);
const tokenP='access_token='+jwt.sign({id: "629d1eb14c6160436acda633", role: "P"}, process.env.JWT_KEY);

const tokenAO='access_token='+jwt.sign({id: "629d1b4f9cb6ddb084043776", role: "AO"}, process.env.JWT_KEY);


describe('[JEST] /api/v1/Medico', () => {
const defaultMedico ={
    email: "medico@test.cases",
    bio:"sono la bio di default",
    password:"password",
    numero:"3333333333",
    title:"628fbe011e0b7989431e2254"
  };


it('[LOGGATO] <200> GET dati medico medico', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:tokenM
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

it('[LOGGATO] <200> PUT Modifica dati medico medico', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:tokenM
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

it('[LOGGATO] <200> GET nuovi dati medico medico', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:tokenM
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

it('[LOGGATO] <200> Restore dati medico medico', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:tokenM
  };

  var code;

  expect.assertions(1);//mi aspetto 1 risultato

  var response =  await fetch(url+'/api/v1/Medico', {
    method: 'PUT',
    body: JSON.stringify(defaultMedico),
    headers: meta})
  expect( response.status ).toEqual(200);

})

it('[LOGGATO] <400> Modifica dati medico medico incompleto', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:tokenM
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

it('[LOGGATO] <506> Modifica dati medico medico email gia` usata', async () => {


  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:tokenM
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

});

describe('[JEST] /api/v1/login',()=>{

  it('[NON LOGGATO] <200> POST login con account M', async () => {
    await new Promise(r => setTimeout(r, 100));//evita che il server esploda
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'medico@test.cases',password:'password'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(200);

  })

  it('[NON LOGGATO] <200> POST login con account P', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'paziente@test.cases',password:'password'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(200);

  })

  it('[NON LOGGATO] <200> POST login con account AO', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'ao@test.cases',password:'password'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(200);
  })

  it('[NON LOGGATO] <403> POST login con account AO password errata', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'ao@test.cases',password:'passwordErrata'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(403);
  })

  it('[NON LOGGATO] <403> POST login con account M password errata', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'medico@test.cases',password:'passwordErrata'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(403);

  })

  it('[NON LOGGATO] <403> POST login con account P password errata', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'paziente@test.cases',password:'passwordErrata'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(403);

  })

  it('[NON LOGGATO] <400> POST login login dati incompleti', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/login', {
        method: 'POST', body: JSON.stringify({email: 'ao@test.cases'}),
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(400);
  })

});

describe('[JEST] /api/v1/logout',()=>{


  it('[LOGGATO] <200> POST logout con account P', async () => {
    await new Promise(r => setTimeout(r, 100));//evita che il server esploda

    expect.assertions(1);
    var response = await fetch(url+'/api/v1/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', cookie:tokenP}
    })
    expect( response.status ).toEqual(200);

  })

  it('[LOGGATO] <200> POST logout con account M', async () => {
    await new Promise(r => setTimeout(r, 100));//evita che il server esploda

    expect.assertions(1);
    var response = await fetch(url+'/api/v1/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', cookie:tokenM}
    })
    expect( response.status ).toEqual(200);
  })

  it('[LOGGATO] <200> POST logout con account AO', async () => {
    await new Promise(r => setTimeout(r, 100));//evita che il server esploda

    expect.assertions(1);
    var response = await fetch(url+'/api/v1/logout', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', cookie:tokenAO}
    })
    expect( response.status ).toEqual(200);
  })

  it('[NON LOGGATO] <403> POST logout senza token', async () => {
    expect.assertions(1);
    var response = await fetch(url+'/api/v1/logout', {
        method: 'POST',
          headers: { 'Content-Type': 'application/json' }
    })
    expect( response.status ).toEqual(403);
  })



});

describe('[JEST] /api/v1/resetPassword',()=>{
  const email="utenteresetpassword@test.cases"

  it('[NON LOGGATO] <200> POST Reset password', async () => {


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

  it('[NON LOGGATO] <404> POST Reset password email inesistente', async () => {


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

  it('[NON LOGGATO] <400> POST Reset password dati incompleti', async () => {


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

});

describe('[JEST] /api/v1/PA',()=>{
var id_delete;

const paName="PATaroccoTestCases";
const datiPA =JSON.stringify({
name: paName,
sconto:30
})

//uncommentare tutti i console.log per vedere le modifiche al db in corso d'opera
//rename //console.log => console.log
const meta = {'Content-Type': 'application/json',cookie:tokenAO};

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

it('[LOGGATO] <dataGathering> GET id new PA', async () => {

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

it('[LOGGATO] <506> POST PA con nome esistente', async () => {

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

it('[LOGGATO] <400> PUT PA con dati incompleti', async () => {

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
});
