const restify = require('restify')
const server = restify.createServer({
  name: "NRQLjokes",
  version: 1.0
})

server.use(restify.plugins.jsonBodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/sample.db')

server.listen(process.env.PORT || 3000, () => {
  server.get('/public/*', restify.plugins.serveStatic({
    directory: __dirname,
  }))

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
          "joke" : row.joke,
          "answer" : row.answer
        })
      });
      res.send(200, jokes);
    });
    return next();
  });

  server.post('/api/v1', (req, res, next) => {
    if (req.body.joke != null && req.body.answer != null) {
      db.run(`INSERT INTO NRQLjokes(joke, answer) VALUES(?, ?)`, [req.body.joke, req.body.answer], function(err) {
        if (err) {
          res.send(500, {"error" : err})
          return console.log(err.message);
        }
        res.send(200, {"message" : "successful post"})
        // console.log(`A row has been inserted with rowid ${this.lastID}`);
      });
    } else {
      res.send(500, {"message" : "invalid post, body must contain string values for 'joke' and 'answer'"})
    }
    return next()
  })
})
