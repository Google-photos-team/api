const express = require('express');
const router = express.Router();

// controllers
const { ProfileController } = require('../../controllers');

router.delete('/delete' ,ProfileController.deleteProfile)

router.post('/update', ProfileController.updateProfile)

router.get('/', ProfileController.getProfile)

module.exports = router