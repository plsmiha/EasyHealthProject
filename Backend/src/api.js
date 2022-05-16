const express = require("express")
let router = express()

router.use(function(req, res, next) {
    // welcoming every incoming request (regardless of type)
    console.log(`> ip:${req.ip} - ${(new Date(Date.now())).toUTCString()}, pid:${process.pid}`)
    next()
})

router.get("/test", function(req, res, next) {
    res.status(200).send('TEST SUCCESSFUL')
})

module.exports = router