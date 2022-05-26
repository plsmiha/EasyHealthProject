const app = require("./backend/api/app.js")
const mongoose = require('mongoose');

const port = process.env.PORT || 80;


app.locals.db = mongoose.connect('mongodb+srv://NodeApp:Y1XPLdwnXWNRSKIN@cluster0.emtou.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
.then ( () => {
    
    console.log("Connected to Database");
    
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
    
});