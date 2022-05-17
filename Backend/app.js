const express = require('express');
const app = express();
const cors = require('cors')

const signup = require('./signup.js');
//const PA = require('./AssurancePlans.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use('/', express.static('./Frontend/public'));

app.use('/api/v1/signup', signup);
//app.use('/api/v1/PA', PA);



app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;