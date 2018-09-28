const express = require('express')
const bodyParser = require('body-parser')
const animal = require('./routes/animal.route')
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
app.use('/animals', animal)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})