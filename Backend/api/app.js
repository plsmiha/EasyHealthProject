const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");

const login = require('./routes/login.js');
const aree = require('./routes/aree.js');
const signup = require('./routes/signup.js');
const check = require('./routes/tokenCheck.js');
const logout = require('./routes/logout.js');
const verify_email = require('./routes/verify_email.js');
const PA = require('./routes/assurancePlans.js');
const referto = require('./routes/referto.js')

const reset = require ('./routes/resetPassword.js')

const editPaziente = require('./routes/editPaziente.js');
const modifMedico = require('./routes/modificaMedico.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(cookieParser());

app.use('/', express.static('./Frontend/public'));

app.use('/api/v1/login', login);
app.use('/api/v1/aree', aree);
app.use('/api/v1/signup', signup);
app.use('/api/v1/verifyEmail', verify_email);
app.use('/api/v1/PA', PA);
app.use('/api/v1/resetPassword', reset)

app.use((req, res, next) => {
    result = check(req.cookies.access_token);
    if (result != undefined) {
        req.jwtData = { id: result.id, role: result.role }
        next()
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});

app.use('/api/v1/Paziente', editPaziente);
app.use('/api/v1/Medico', modifMedico);

app.use('/api/v1/Referto', referto);

app.use('/api/v1/logout', logout);

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
