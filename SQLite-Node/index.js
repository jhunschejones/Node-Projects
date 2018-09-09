const restify = require('restify')
const logger  = require('morgan')
const fs = require('fs')
const path = require('path')
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'application.log'), {flags: 'a'})
const server = restify.createServer({
  name: "NRQLjokes",
  version: 1.0
})

// write logs to file
server.use(logger(':method :url :status - :response-time ms', {stream: accessLogStream}));
// write logs to console
server.use(logger('dev'))
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/sample.db')

server.listen(process.env.PORT || 3000, () => {
  server.get('/*/', restify.plugins.serveStatic({
    'directory': __dirname,
    'default': 'index.html'
  }));

  server.get('/api/v1', function(req, res, next) {
    var jokes = { 
      "jokes": []
    }

    db.all('SELECT * FROM NRQLjokes', [], (err, rows) => {
      if (err) {
        throw err;
      }
      rows.forEach((row) => {
        jokes.jokes.push({
          "id" : row.id,
          "joke" : row.joke,
          "punchline" : row.punchline
        })
      });
      res.send(200, jokes);
    });
    return next();
  });

  server.post('/api/v1', (req, res, next) => {
    if (req.body.joke != null && req.body.punchline != null && req.body.joke != "" && req.body.punchline != "") {
      db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, [req.body.joke, req.body.punchline], function(err) {
        if (err) {
          res.send(500, {"error" : err})
          return console.log(err.message);
        }
        res.send(200, {"message" : "successful post"})
      });
    } else {
      res.send(500, 
        {
          "message" : "invalid post, body must contain string values for 'joke' and 'punchline'"
        })
    }
    return next()
  })

  server.del('/api/v1/:id', (req, res, next) => 
    db.run(`DELETE FROM NRQLjokes WHERE id=?`, req.params.id, function(err) {
      if (err) {
        res.send((500, {"error" : err}))
        return console.error(err.message);
      }

      if (this.changes < 1) {
        res.send(404, {"message" : `could not find a joke with id: ${req.params.id}`})
      } else {
        res.send(200, {"message" : `successfully deleted joke id: ${req.params.id}`})
      }
    })
  )
})
