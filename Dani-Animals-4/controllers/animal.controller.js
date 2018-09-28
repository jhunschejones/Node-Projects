const Animal = require('../models/animal.model')

exports.test = function (req, res) {
  res.send('Greetings from Dani Animals 4 Test controller!')
}

exports.animal_create = function (req, res) {
  let animal = new Animal(
    {
      name: req.body.name,
      age: req.body.age,
      type: req.body.type,
      food: req.body.food,
      color: req.body.color
    }
  )

  animal.save(function(err) {
    if (err) {
      return next(err)
    }
    res.send('Animal created successfully!')
  })
}

exports.all_animals = function (req, res) {
  Animal.find({}, function (err, data) {
    if (err) return next(err)
    res.send(data)
  })
}

exports.animal_details = function (req, res) {
  Animal.findById(req.params.id, function (err, animal) {
    if (err) return next(err)
    if (animal) res.send(animal)
    else res.status(404).send('This animal does not exist.')
  })
}

exports.animal_update = function (req, res, next) {
  // either option works here
  Animal.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, animal) {
  // Animal.findOneAndUpdate({_id: req.params.id}, {$set: req.body}, function (err, animal) {
    if (err) return next(err)
    res.send('Animal updated!')
  })
}

exports.animal_delete = function (req, res) {
  Animal.findByIdAndRemove(req.params.id, function (err) {
    if (err) return next(err)
    res.send('Animal deleted successfully!')
  })
}