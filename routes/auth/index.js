const express = require('express');
const router = express.Router();
// controllers
const { AuthController } = require('../../controllers');

router.post('/signup', AuthController.signup)

router.post('/login', AuthController.login)

router.post('/logout', AuthController.logout)

router.post('/reset-password', AuthController.resetPassword)

module.exports = router