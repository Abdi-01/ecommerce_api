const express = require('express')
const { usersController } = require('../controllers')
const router = express.Router()

router.get('/get', usersController.getData);
router.post('/register', usersController.register)
router.post('/login', usersController.login);
router.post('/keep-login', usersController.keepLogin);

module.exports = router