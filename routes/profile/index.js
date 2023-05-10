const express = require('express');
const router = express.Router();
// const verifyToken = require('../../helpers/verifyToken');
// controllers
const { ProfileController } = require('../../controllers');

router.delete('/delete', ProfileController.deleteProfile)

router.post('/update', ProfileController.updateProfile)

router.get('/', ProfileController.getProfile)

module.exports = router