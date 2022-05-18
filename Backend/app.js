const express = require('express');
const app = express();
const cors = require('cors');

const signup = require('./signup.js');
const verify_email = require('./verify_email.js');
const PA = require('./assurancePlans.js');
const modifMedico = require('./modificaMedico.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/', express.static('./Frontend/public'));

app.use('/api/v1/signup', signup);
app.use('/api/v1/verify_email', verify_email);
app.use('/api/v1/PA', PA);
app.use('/api/v1/modmed', modifMedico);


app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
