const cluster = require('cluster')

// this code runs in the master process
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
  const express = require('express')
  const app = express()

  app.get('/', function (req, res) {
    res.send("Hello World, from Node-Cluster worker " + cluster.worker.id + "!")
  })

  app.listen(3000)
  console.log("Worker %d is running on port 3000.", cluster.worker.id)
  
  // kill some workers to see the app in action!
  // process.exit(0)
}