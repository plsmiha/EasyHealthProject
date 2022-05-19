const http = require('http')
const express = require("express")
const router = express()
const os = require('os')
const cluster = require("cluster")
const mongoose = require('mongoose');

const app = require("./api/app.js")

if (cluster.isMaster) {

    console.log(`MASTER ${process.pid} running`)

    cluster.on('fork', function(worker) {
        console.log(`WORKER ${worker.process.pid} up`)
    })

    cluster.on('exit', function(worker) {
        console.log(`WORKER ${worker.process.pid} down`)
        cluster.fork()
    })

    var cpu_count = os.cpus().length;
    for (var i = 0; i < cpu_count; i++) cluster.fork()

} else {

    app.locals.db = mongoose.connect('mongodb+srv://NodeApp:Y1XPLdwnXWNRSKIN@cluster0.emtou.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then ( () => {
        
        console.log(`WORKER ${worker.process.pid} connected to DB`)

        router.use("/api", app)

        let server = http.createServer(router)
        server.listen(80)
    
        process.on('uncaughtException', (code, signal) => {
            console.log(`WORKER error...\n\tcode:(${code})\n\tsignal:(${signal})`)
            process.exit()
        })
        
    });

   

}