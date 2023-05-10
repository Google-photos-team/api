const express = require('express');
const router = express.Router();

// controllers
const { ProfileController } = require('../../controllers');

router.delete('/user/delete' ,ProfileController.deleteProfile)

router.post('/user/update', ProfileController.updateProfile)

router.get('/user/', ProfileController.getProfile)

module.exports = router