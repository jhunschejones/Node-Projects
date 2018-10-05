'use strict'
const newrelic = require('newrelic')
const cluster = require('cluster')

if (cluster.isMaster) {
  // count the machine's CPU's
  const cpuCount = require('os').cpus().length

  // create a worker for each CPU
  for (var i = 0; i < cpuCount; i += 1) {
    cluster.fork()
  }

  // listen for dying workers
  cluster.on('exit', function (worker) {
    console.log("Worker %d died :(", worker.id)

    // replace the dead worker
    cluster.fork()
  }) 
} else {
  // this code runs in a worker process
  const koa = require('koa')
  const path = require('path')
  const render = require('koa-ejs')
  const koarouter = require('koa-router')
  const morgan = require('koa-morgan')
  const serve = require('koa-static')

  const app = new koa()
  const router = new koarouter()
  const PORT = 3000
  // request logging
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
  // serving up the public folder so we can get to it from our index.html
  app.use(serve('./public'))

  render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: false
  })

  router.get('koala', '/', (ctx) => {
    let koala_attributes = []
    koala_attributes.push({
      meta_name: 'Color',
      meta_value: 'Grey and white'
    })
    koala_attributes.push({
      meta_name: 'Native Country',
      meta_value: 'Austrailia'
    })
    koala_attributes.push({
      meta_name: 'Animal Classification',
      meta_value: 'Mammal'
    })
    koala_attributes.push({
      meta_name: 'Life Span',
      meta_value: '13 - 18 years'
    })
    koala_attributes.push({
      meta_name: 'Are they bears',
      meta_value: 'No!'
    })
    return ctx.render('index', {
      attributes: koala_attributes,
      image_path: "../images/koala_friends.png",
      worker: cluster.worker.id
    })
  })

  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(PORT, () => console.log(`Koala worker ${cluster.worker.id} is running on port: ${PORT}`))
}