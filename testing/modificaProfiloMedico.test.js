const fetch = require("node-fetch");
require("dotenv").config();
const funzioni = require("./funzioniUtili");
const url =  "http://localhost"


it('richiesta GET dei dati del medico', async () => {

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

})
