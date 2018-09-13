const restify = require('restify')
const server = restify.createServer({
  name: "NRQLjokes",
  version: 1.0
})

server.use(restify.plugins.jsonBodyParser({ mapParams: true }))

const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./db/sample.db')

server.listen(process.env.PORT || 3000, () => {
  server.get('/*/', restify.plugins.serveStatic({
    'directory': __dirname,
    'default': 'index.html'
  }))
  
  server.get('/api/v1', (req, res, next) => {
    var data = {
      "jokes": []
    }

    db.all('SELECT * FROM NRQLjokes', [], (err, rows) => {
      if (err) {
        throw err
      }
      rows.forEach((row) => {
        data.jokes.push({
          "id": row.id,
          "joke": row.joke,
          "punchline": row.punchline
        })
      })
      res.send(200, data)
    })
    return next()
  })

  server.post('/api/v1', (req, res, next) => {
    // back end data validation
    if (req.body.joke != null && req.body.punchline != null && req.body.joke != "" && req.body.punchline != ""){
      db.run('INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)', [req.body.joke, req.body.punchline], (err) => {
        if (err) {
          // handling server error
          res.send(500, {"error": err})
          return console.log(err.message)
        }
        res.send(200, {"message": "successful post"})
      })
    } else {
      // handle invalid user data
      res.send(500, {"message": "invalid post, body must contain string values for 'joke' and 'punchline'"})
    }
    return next()
  })

  server.del('/api/v1/:id', (req, res, next) => {
    db.run('DELETE FROM NRQLjokes WHERE id=?', req.params.id, function(err) {
      if (err) {
        res.send(500, {"error": err})
        return console.error(err.message)
      }

      // this.changes returns 0 if no changes were made
      if (this.changes < 1) {
        res.send(404, {"message": `could not find a joke with id: ${req.params.id}`})
      } else {
        res.send(200, {"message": `successfully deleted joke id: ${req.params.id}`})
      }
    })
  })
})