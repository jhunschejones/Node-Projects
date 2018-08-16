'use strict'

var newrelic = require('newrelic');

const config  = require('./config'),
      restify = require('restify'),
      mongodb = require('mongodb').MongoClient

      const server = restify.createServer({
        name    : config.name,
        version : config.version
    })

server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

server.listen(config.port, () => {
    mongodb.connect(config.db.uri, (err, db) => {

        if (err) {
            console.log('An error occured while attempting to connect to the database.')
            progress.exit(1)
        }

        console.log(
            '%s v%s ready to accept connections on port %s in %s environment.',
            server.name,
            config.version,
            config.port,
            config.env
        )

        require('./routes')({ db, server })
    })
})