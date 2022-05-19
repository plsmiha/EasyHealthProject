const http = require('http')
const express = require("express")
const router = express()
const os = require('os')
const cluster = require("cluster")

const api_router = require("./api")

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

    router.use("/api", api_router)

    let server = http.createServer(router)
    server.listen(3000)

    process.on('uncaughtException', (code, signal) => {
        console.log(`WORKER error...\n\tcode:(${code})\n\tsignal:(${signal})`)
        process.exit()
    })

}