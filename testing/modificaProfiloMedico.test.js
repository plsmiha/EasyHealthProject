const fetch = require("node-fetch");
require("dotenv").config();
const funzioni = require("./funzioniUtili");
const url = process.env.HEROKU || "http://localhost"


it('richiesta GET dei dati del medico', async () => {

  var ck  = 'access_token='+process.env.M_TOKEN;//il jwt token

  const meta = {//creo l'headers
  'Content-Type': 'application/json',
  cookie:ck
  };

  expect.assertions(1);//mi aspetto 1 risultato
  var response = await fetch(url+'/api/v1/Medico', {//la get non ha body
    method: 'GET',
      headers: meta})//setto l'header
  expect( response.status ).toEqual(200);
})
