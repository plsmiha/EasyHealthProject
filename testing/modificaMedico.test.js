const fetch = require("node-fetch");
const funzioni = require("./funzioniUtili");
const url = process.env.HEROKU || "http://localhost"

it('richiesta login con account AO', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'mariano52@gmail.com',password:'password'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(200);
})
