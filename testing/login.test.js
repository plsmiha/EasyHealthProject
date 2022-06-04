const fetch = require("node-fetch");
const funzioni = require("./funzioniUtili");
const url = process.env.HEROKU || "http://localhost"

it('richiesta login con account M', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'medico@test.cases',password:'password'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(200);

})

it('richiesta login con account P', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'paziente@test.cases',password:'password'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(200);

})

it('richiesta login con account AO', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'ao@test.cases',password:'password'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(200);
})

it('richiesta login con account AO password errata', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'ao@test.cases',password:'passwordErrata'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(403);
})

it('richiesta login con account M  password errata', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'medico@test.cases',password:'passwordErrata'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(403);

})

it('richiesta login con account P password errata', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'paziente@test.cases',password:'passwordErrata'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(403);

})

it('richiesta login senza password', async () => {
  expect.assertions(1);
  var response = await fetch(url+'/api/v1/login', {
      method: 'POST', body: JSON.stringify({email: 'ao@test.cases'}),
        headers: { 'Content-Type': 'application/json' }
  })
  expect( response.status ).toEqual(400);
})
