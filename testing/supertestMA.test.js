
const request = require('supertest');
const app = require('../Backend/api/app.js');
const Slot = require('../Backend/models/slot');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require("dotenv").config();

beforeAll( async () => { jest.setTimeout(8000);
    app.locals.db = await mongoose.connect(process.env.DB_URL_API);
});
afterAll( () => {
   mongoose.connection.close(true);
});
beforeEach( async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
});


 const tokenM= 'access_token='+jwt.sign({id: "629d1dff46a2046f0591d629", role: "M"}, process.env.JWT_KEY);
 const tokenP='access_token='+jwt.sign({id: "629d1eb14c6160436acda633", role: "P"}, process.env.JWT_KEY);

 const tokenAO='access_token='+jwt.sign({id: "629d1b4f9cb6ddb084043776", role: "AO"}, process.env.JWT_KEY);


describe('[SUPERTEST] /api/v1/verifyEmail', () => {


      header={'Content-Type': 'application/json'};

      test('[NON LOGGATO] <302> GET verifica email con id corretto', () => {
        return request(app).get('/api/v1/verifyEmail?id=629d1eb14c6160436acda633')
        .set(header)
        .expect(302)});

      test('[NON LOGGATO] <400> GET verifica email senza id', () => {
        return request(app).get('/api/v1/verifyEmail')
        .set(header)
        .expect(400)});
      
      test('[NON LOGGATO] <302> GET verifica email con id non esistente', () => {
        return request(app).get('/api/v1/verifyEmail?id=629d1eb14c6160436ac')
        .set(header)
        .expect(302)});

});

describe('[SUPERTEST] /api/v1/agendaMedico', () => {


  header={'Content-Type': 'application/json', cookie: tokenM};
  headerP={'Content-Type': 'application/json', cookie: tokenP};
  headerWJWT={'Content-Type': 'application/json'};

  today=new Date();
  today.setDate(today.getDate() + 1);
  let day = today.getFullYear()+"-"+(today.getMonth()+1)+"-"+today.getDate();

  test('[LOGGATO] <200> POST apertura slot', () => {
    return request(app).post('/api/v1/agendaMedico')
    .set(header)
    .send(
      JSON.stringify({
      day: day,
      from: "08:00",
      to: "09:00"
      })
    )
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe("true");
    })
  });

  test('[LOGGATO] <400> POST apertura slot con data scorretta', () => {
    return request(app).post('/api/v1/agendaMedico')
    .set(header)
    .send(
      JSON.stringify({
      day: "2020-1-1",
      from: "08:00",
      to: "09:00"
      })
    )
    .expect(400)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("3");
    })
  });

  test('[LOGGATO] <400> POST apertura slot con tempo scorretto', () => {
    return request(app).post('/api/v1/agendaMedico')
    .set(header)
    .send(
      JSON.stringify({
      day: day,
      from: "08:00",
      to: "07:00"
      })
    )
    .expect(400)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("3");
    })
  });

  test('[LOGGATO] <400> POST apertura slot in mancanza di uno o più parametri', () => {
    return request(app).post('/api/v1/agendaMedico')
    .set(header)
    .send(
      JSON.stringify({
      day: day
      })
    )
    .expect(400)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("1");
    })
  });

  test('[LOGGATO] <403> POST apertura slot con token di un paziente', () => {
    return request(app).post('/api/v1/agendaMedico')
    .set(headerP)
    .send(
      JSON.stringify({
        day: "2020-1-1",
        from: "08:00",
        to: "09:00"
      })
    )
    .expect(403)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("2");
    })
  });

  test('[NON LOGGATO] <403> POST apertura slot senza token', () => {
    return request(app).post('/api/v1/agendaMedico')
    .set(headerWJWT)
    .send(
      JSON.stringify({
        day: "2020-1-1",
        from: "08:00",
        to: "09:00"
      })
    )
    .expect(403)
    .expect((res) => {
      expect(res.body.error).toBe("Unauthorized");
    })
  });

  test('[LOGGATO] <200> GET lista slot determinato medico, mese e anno', () => {
    return request(app).get('/api/v1/agendaMedico?month='+(today.getMonth()+1)+'&year='+today.getFullYear())
    .set(header)
    .expect(200)
  });

  test('[LOGGATO] <200> GET lista slot determinato medico, mese, anno e giorno', () => {
    return request(app).get('/api/v1/agendaMedico?month='+(today.getMonth()+1)+'&year='+today.getFullYear()+'&day='+today.getDate())
    .set(header)
    .expect(200)
  });

  test('[LOGGATO] <400> GET lista slot senza anno', () => {
    return request(app).get('/api/v1/agendaMedico?month=5')
    .set(header)
    .expect(400)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("1");
    })
  });

  test('[LOGGATO] <400> GET lista slot senza mese', () => {
    return request(app).get('/api/v1/agendaMedico?year=2022')
    .set(header)
    .expect(400)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("1");
    })
  });

  test('[LOGGATO] <403> GET lista slot con token di un paziente', () => {
    return request(app).get('/api/v1/agendaMedico?month=5&year=2022&day=6')
    .set(headerP)
    .expect(403)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("2");
    })
  });

  test('[LOGGATO] <200> GET info slot', async () => {
    let slot = new Slot({
      id_doc: "629d1dff46a2046f0591d629",
      day: day,
      from: "08:00",
      to: "09:00",
      occupied_id_pat: null
    });
    slot = await slot.save();
    return request(app).get('/api/v1/agendaMedico/'+slot._id)
    .set(header)
    .expect(200)
    .expect((res) => {
      expect(res.body._id).toEqual(expect.any(String));
      expect(res.body.id_doc).toEqual(expect.any(String));
      expect(res.body.day).toEqual(expect.any(String));
      expect(res.body.from).toEqual(expect.any(String));
      expect(res.body.to).toEqual(expect.any(String));
      expect(res.body.occupied_id_pat).toEqual(expect.any(Object));
    })
    .then(() => {
      Slot.findByIdAndDelete(slot._id);
    })
  });

  test('[LOGGATO] <404> GET info slot non esistente', () => {
    return request(app).get('/api/v1/agendaMedico/593929493')
    .set(header)
    .expect(404)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("1");
    })
  });

  test('[LOGGATO] <403> GET info slot da paziente', async () => {
    let slot = new Slot({
      id_doc: "629d1dff46a2046f0591d629",
      day: day,
      from: "08:00",
      to: "09:00",
      occupied_id_pat: null
    });
    slot = await slot.save();
    return request(app).get('/api/v1/agendaMedico/'+slot._id)
    .set(headerP)
    .expect(403)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("2");
    })
    .then(() => {
      Slot.findByIdAndDelete(slot._id);
    })
  });

  test('[NON LOGGATO] <403> GET info slot da utente non loggato', () => {
    return request(app).get('/api/v1/agendaMedico')
    .set(headerWJWT)
    .expect(403)
    .expect((res) => {
      expect(res.body.error).toBe("Unauthorized");
    })
  });

  test('[LOGGATO] <200> DELETE elimina slot', async () => {
    let slot = new Slot({
      id_doc: "629d1dff46a2046f0591d629",
      day: day,
      from: "08:00",
      to: "09:00",
      occupied_id_pat: null
    });
    slot = await slot.save();
    return request(app).delete('/api/v1/agendaMedico/'+slot._id)
    .set(header)
    .expect(200)
    .expect((res) => {
      expect(res.body.success).toBe("true");
    })
  });

  test('[LOGGATO] <400> DELETE elimina slot occupato', async () => {
    let slot = new Slot({
      id_doc: "629d1dff46a2046f0591d629",
      day: day,
      from: "08:00",
      to: "09:00",
      occupied_id_pat: "629d1eb14c6160436acda633"
    });
    slot = await slot.save();
    return request(app).delete('/api/v1/agendaMedico/'+slot._id)
    .set(header)
    .expect(400)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("3");
    })
    .then(() => {
      Slot.findByIdAndDelete(slot._id);
    })
  });

  test('[LOGGATO] <404> DELETE elimina slot non esistente', () => {
    return request(app).delete('/api/v1/agendaMedico/535753245')
    .set(header)
    .expect(404)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("1");
    })
  });

  test('[LOGGATO] <403> DELETE elimina slot con token paziente', async () => {
    let slot = new Slot({
      id_doc: "629d1dff46a2046f0591d629",
      day: day,
      from: "08:00",
      to: "09:00",
      occupied_id_pat: null
    });
    slot = await slot.save();
    return request(app).delete('/api/v1/agendaMedico/'+slot._id)
    .set(headerP)
    .expect(403)
    .expect((res) => {
      expect(res.body.success).toBe("false");
      expect(res.body.error).toBe("2");
    })
    .then(() => {
      Slot.findByIdAndDelete(slot._id);
    })
  });

  test('[NON LOGGATO] <403> DELETE elimina slot senza token', async () => {
    let slot = new Slot({
      id_doc: "629d1dff46a2046f0591d629",
      day: day,
      from: "08:00",
      to: "09:00",
      occupied_id_pat: null
    });
    slot = await slot.save();
    return request(app).delete('/api/v1/agendaMedico/'+slot._id)
    .set(headerWJWT)
    .expect(403)
    .expect((res) => {
      expect(res.body.error).toBe("Unauthorized");
    })
    .then(() => {
      Slot.findByIdAndDelete(slot._id);
    })
  });

});