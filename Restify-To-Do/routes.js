'use strict'

module.exports = function(ctx) {
    const db     = ctx.db,
          server = ctx.server

    // this line no longer works at mongo db v3
    const collection = db.collection('todos')

    server.post('/todos', (req, res, next) => {

        const data = Object.assign({}, req.body, {
            created: new Date(),
            updated: new Date()
        })

        collection.insertOne(data)
            .then(doc => res.send(200, doc.ops[0]))
            .catch(err => res.send(500, err))

        next()
    })

    server.get('/todos', (req, res, next) => {

        let limit = parseInt(req.query.limit, 10) || 10,
            skip = parseInt(req.query.skip, 10) || 0,
            query = req.query || {}

        delete query.skip
        delete query.limit

        collection.find(query).skip(skip).limit(limit).toArray()
            .then(docs => res.send(200, docs))
            .catch(err => res.send(500, err))

        next() 
    })

    // still having trouble with PUT method, may need to look into using a custom index?
    server.put('/todos/:id', (req, res, next) => {

        // extract data from body and add timestamps
        const data = Object.assign({}, req.body, {
            updated: new Date()
        })

        let query = { _id: req.params.id },
            body  = { $set: data },
            opts  = {
                returnOriginal: false,
                upsert: true
            }

        // find and update document based on passed in id (via route)
        collection.findOneAndUpdate(query, body, opts)
            .then(doc => res.send(204))
            .catch(err => res.send(500, err))

        next()

    })

    server.del('/todos/:id', (req, res, next) => {

        collection.findOneAndDelete({ _id: req.params.id })
            .then(doc => res.send(204))
            .catch(err => res.send(500, err))

        next()
    })
}