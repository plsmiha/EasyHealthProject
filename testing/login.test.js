const fetch = require("node-fetch");
const funzioni = require("./funzioniUtili");
const url = process.env.HEROKU || "http://localhost"

it('[NON LOGGATO] <200> POST login con account M', async () => {
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
