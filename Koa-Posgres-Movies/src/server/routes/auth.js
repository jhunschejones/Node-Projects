const Router = require('koa-router')
const passport = require('koa-passport')
const fs = require('fs')
const queries = require('../db/queries/users')

const router = new Router()

router.get('/auth/register', async (ctx) => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream('./src/server/views/register.html')
})

router.post('/auth/register', async (ctx) => {
  try {
    const user = await queries.addUser(ctx.request.body)
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user)
        ctx.redirect('/auth/status')
      } else {
        ctx.status = 400
        ctx.body = { status: 'error' }
      }
    })(ctx)
  } catch (err) {
    // returns true when there is a duplicate user
    console.log("Duplicate user name: " + JSON.stringify(err).includes('already exists'))
    ctx.redirect('/auth/register')
  }
})

router.get('/auth/status', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('./src/server/views/status.html')
  } else {
    ctx.redirect('/auth/login')
  }
})

router.get('/auth/login', async (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.type = 'html'
    ctx.body = fs.createReadStream('./src/server/views/login.html')
  } else {
    ctx.redirect('/auth/status')
  }
})

router.post('/auth/login', async (ctx) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.login(user)
      ctx.redirect('/auth/status')
    } else {
      ctx.status = 400
      ctx.body = { status: 'error' }
    }
  })(ctx)
})

router.get('/auth/logout', async (ctx) => {
  if (ctx.isAuthenticated()) {
    ctx.logout()
    ctx.redirect('/auth/login')
  } else {
    ctx.body = { success: false }
    ctx.throw(401)
  }
})

module.exports = router