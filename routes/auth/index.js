const express = require('express');
const router = express.Router();
// controllers
const { AuthController } = require('../../controllers');

const verifyMiddleware = require('../../middlewares/verifyMiddleware');

router.post('/signup', AuthController.signup)

router.post('/login', AuthController.login)

router.post('/reset-password', verifyMiddleware ,AuthController.resetPassword)

module.exports = router