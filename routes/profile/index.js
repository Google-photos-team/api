const express = require('express');
const router = express.Router();
// controllers
const { ProfileController } = require('../../controllers');

router.post('/delete', ProfileController.deleteProfile)

router.post('/update', ProfileController.updateProfile)

router.get('/:userId', ProfileController.getProfile)

module.exports = router