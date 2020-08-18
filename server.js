var express = require('express')
var cors = require('cors')
var app = express()

app.use(cors())

port = process.env.PORT || 3000;

var request = require('request-promise');
var { loadTreeRecursively } = require('./src/api/dependLoader')

// fixme - pre-load "popular" from db?? keep MRU only??? use 3rd party cache framework??
const cache = {}

app.get('/:package/:version', async (req, res) => {
    try {
        await loadTreeRecursively(req.params.package, req.params.version, cache)
        res.send(cache)
    } catch (e) {
        res.status(500).send()
    }
})


app.listen(port);

console.log('todo list RESTful API server started on: ' + port);