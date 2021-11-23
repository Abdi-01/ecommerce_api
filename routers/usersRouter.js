const express = require('express')
const { usersController } = require('../controllers')
const router = express.Router()

router.get('/get', usersController.getData);
router.post('/register', usersController.register)

module.exports = router