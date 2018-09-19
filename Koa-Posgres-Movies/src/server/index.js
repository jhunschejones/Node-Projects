const newrelic = require('newrelic')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const favicon = require('koa-favicon')

const indexRoutes = require('./routes/index')
const movieRoutes = require('./routes/movies')

const app = new Koa()
const PORT = process.env.PORT || 3000

app.use(bodyParser())
app.use(indexRoutes.routes())
app.use(movieRoutes.routes())
app.use(favicon(__dirname + '/public/favicon.ico'))

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server