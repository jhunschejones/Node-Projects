const mongoose = require('mongoose')
const Schema = mongoose.Schema

let AnimalSchema = new Schema({
  name: {type: String, required: true},
  age: {type: Number, required: true},
  type: {type: String, required: true},
  food: {type: String, required: true},
  color: {type: String, required: true},
})

module.exports = mongoose.model('Animal', AnimalSchema)