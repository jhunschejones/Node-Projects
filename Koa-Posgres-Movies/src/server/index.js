const newrelic = require('newrelic')
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
// const favicon = require('koa-favicon')
const session = require('koa-session')
const passport = require('koa-passport')
const RedisStore = require('koa-redis')

const indexRoutes = require('./routes/index')
const movieRoutes = require('./routes/movies')
const authRoutes = require('./routes/auth')

const app = new Koa()
const PORT = process.env.PORT || 3000

// sessions
app.keys = ['secret-key']

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV == 'production') {
  // Replacing session store with redis
  app.use(session({
    store: new RedisStore()
  }, app))
} else {
  app.use(session(app))
}

// body parser
app.use(bodyParser())

// authentication
require('./auth')
app.use(passport.initialize())
app.use(passport.session())

// routes
app.use(indexRoutes.routes())
app.use(movieRoutes.routes())
app.use(authRoutes.routes())
// app.use(favicon(__dirname + '../public/favicon.ico'))

// server
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})

module.exports = server