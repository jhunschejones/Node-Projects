const express = require('express')
const router = express.Router()

const animal_controller = require('../controllers/animal.controller')

router.get('/test', animal_controller.test)
router.get('/', animal_controller.all_animals)
router.post('/', animal_controller.animal_create)
router.get('/:id', animal_controller.animal_details)
router.put('/:id', animal_controller.animal_update)
router.delete('/:id', animal_controller.animal_delete)

module.exports = router