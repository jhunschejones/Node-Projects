const newrelic = require('newrelic')
const restify = require('restify')
const logger  = require('morgan')

const server = restify.createServer({
  name: "NRQLjokes",
  version: 1.0
})

server.use(logger('dev'))
server.use(restify.plugins.jsonBodyParser({ mapParams: true }))

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./db/sample.db')

server.listen(process.env.PORT || 3000, () => {
  server.get('/*/', restify.plugins.serveStatic({
    'directory': __dirname,
    'default': 'index.html'
  }));

  server.get('/403', (req, res, next) => {
    var message = {'message': 'this resource has been moved'}
    // newrelic.addCustomAttributes({
    //   'my message': JSON.stringify(message)
    // });
    res.send(403, message)
  })

  server.get('/403/:id', (req, res, next) => {
    var message = {'message': 'this resource has been moved'}
    // newrelic.addCustomAttributes({
    //   'my message': JSON.stringify(message),
    //   'search string': req.params.id
    // });
    res.send(403, message)
  })

  server.get('/api/v1', (req, res, next) => {
    var data = { 
      "jokes": []
    }

    db.all('SELECT * FROM NRQLjokes', [], (err, rows) => {
      if (err) {
        // newrelic.noticeError(err)
        throw err;
      }
      // try {
        rows.forEach((row) => {
          data.jokes.push({
            "id" : row.id,
            "joke" : row.joke,
            "punchline" : row.punchline
          })
        });
      // } catch (error) {
      //   newrelic.noticeError(error)
      //   console.log(error)
      // }
      res.send(200, data);
    });
    return next();
  })

  server.post('/api/v1', (req, res, next) => {
    // newrelic.setTransactionName('add_new_joke');
    if (req.body.joke != null && req.body.punchline != null && req.body.joke != "" && req.body.punchline != "") {
      db.run(`INSERT INTO NRQLjokes(joke, punchline) VALUES(?, ?)`, [req.body.joke, req.body.punchline], (err) => {
        // handles a query statement error
        if (err) {
          res.send(500, {"error" : err})
          return console.log(err.message);
        }
        // newrelic.recordCustomEvent('add_joke', {'joke': req.body.joke, 'punchline': req.body.punchline})
        res.send(200, {"message" : "successful post"})
      });
    } else {
      // handles an invalid input data error
      res.send(500, { "message" : "invalid post, body must contain string values for 'joke' and 'punchline'" })
    }
    return next()
  })

  server.del('/api/v1/:id', (req, res, next) => {
    // newrelic.setTransactionName('delete_joke');
    db.run(`DELETE FROM NRQLjokes WHERE id=?`, req.params.id, function(err) {
      if (err) {
        res.send((500, {"error" : err}))
        return console.error(err.message);
      }

      // this.changes returns 0 if no changes were made
      if (this.changes < 1) {
        res.send(404, {"message" : `could not find a joke with id: ${req.params.id}`})
      } else {
        // newrelic.recordCustomEvent('delete_joke', {'message': `successfully deleted joke id: ${req.params.id}`})
        res.send(200, {"message" : `successfully deleted joke id: ${req.params.id}`})
      }
    });
  })
})