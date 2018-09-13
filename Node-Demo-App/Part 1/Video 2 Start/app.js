const restify = require('restify')
const server = restify.createServer({
  name: "NRQLjokes",
  version: 1.0
})

const sqlite3 = require('sqlite3').verbose()
let db = new sqlite3.Database('./db/sample.db')

server.listen(process.env.PORT || 3000, () => {
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
})