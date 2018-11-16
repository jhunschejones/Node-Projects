const koa = require('koa')
const router = require('koa-router')()

const data = require('./user-data.js')

const app = module.exports = koa()

router.get('/user', function *() {
  this.body = yield data.users.get()
})

app.use(router.routes())

app.listen(3000)