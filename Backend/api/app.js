const http = require('http')
const os = require('os')
const cluster = require("cluster")
const mongoose = require('mongoose');

require("dotenv").config();


const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require("cookie-parser");

const login = require('./routes/login.js');
const patient = require('./routes/pazienti.js');
const doc = require('./routes/medici.js');
const aree = require('./routes/aree.js');
const signup = require('./routes/signup.js');
const check = require('./routes/tokenCheck.js');
const logout = require('./routes/logout.js');
const verify_email = require('./routes/verify_email.js');
const calendarioP = require('./routes/calendarioP.js');
const PA = require('./routes/assurancePlans.js');
const referto = require('./routes/referto.js');

const AO = require('./routes/modificaAO.js');
const reset = require ('./routes/resetPassword.js');

const editPaziente = require('./routes/paziente.js');
const modifMedico = require('./routes/modificaMedico.js');
const profileM = require('./routes/profiloM.js');
const visita = require('./routes/prenotazione.js');
const admin = require('./routes/admin.js');
const agendaMedico = require('./routes/agendaMedico.js');


const editPazienteDaAO = require('./routes/editPazienteDaAO.js');
const editMedicoDaAO = require('./routes/editMedicoDaAO.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use('/', express.static('./Frontend/public'));

app.use('/api/v1/login', login);
app.use('/api/v1/aree', aree);
app.use('/api/v2/signup', signup);
app.use('/api/v1/verifyEmail', verify_email);
app.use('/api/v1/PA', PA);
app.use('/api/v1/resetPassword', reset);


//_______________________________________________________________________-



app.use('/api/v1/patient', patient);
app.use('/api/v1/medic', doc);

//__________________________________________________________


app.use((req, res, next) => {
    result = check(req.cookies.access_token);
    if (result != undefined) {
        req.jwtData = { id: result.id, role: result.role }
        next()
    } else {
        res.status(403).json({ error: 'Unauthorized' });
    }
});



app.use('/api/v1/Medico', modifMedico);
app.use('/api/v1/Admin', admin);




app.use('/api/v1/prenotazione', visita);
app.use('/api/v1/Paziente', editPaziente);

app.use('/api/v1/agendaMedico', agendaMedico);
app.use('/api/v1/profileM', profileM);

app.use('/api/v1/editPazienteDaAO', editPazienteDaAO);
app.use('/api/v1/editMedicoDaAO', editMedicoDaAO);

app.use('/api/v1/agendaPaziente', calendarioP);
app.use('/api/v1/Referto', referto);

app.use('/api/v1/editPaziente', editPaziente);
app.use('/api/v1/editMedico', modifMedico);
app.use('/api/v1/AO', AO);
app.use('/api/v1/logout', logout);

app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

module.exports = app;
