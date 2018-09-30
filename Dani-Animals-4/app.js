const newrelic = require('newrelic')
const express = require('express')
const bodyParser = require('body-parser')
const apiRout = require('./routes/animal.route')
const homeRout = require('./routes/home.rout.js')
const admin = require('firebase-admin')
const serviceAccount = require('./dani-animals-4-firebase-adminsdk-wjr48-6138b5f03c.json')
const app = express()


// Set up database connection
const mongoose = require('mongoose')
// Handles depreceiation conflict between MongoDB and Mongoose, 
// both have a findAndModify() function
mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://user:password@ds027819.mlab.com:27819/danianimals', { useNewUrlParser: true })
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.use(bodyParser.json())
app.use('/api/v1', apiRout)
app.use('/', homeRout)
app.use(express.static(__dirname + '/views'));

// authentication
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// })
// const uid = 'test-uid'
// const claims = {
//   admin: false
// }
// admin.auth().createCustomToken(uid, claims).then((customToken) => {
//   console.log(customToken)
// }).catch((error) => {
//   console.log(error)
// })


app.listen(3000, () => {
  console.log('Server is running on port 3000')
})