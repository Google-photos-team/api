const express = require('express');
const router = express.Router();
const verifyToken = require('../../helpers/verifyToken');
// controllers
const { ProfileController } = require('../../controllers');

router.delete('user/delete/:id',verifyToken, ProfileController.deleteProfile)

router.post('user/update/:id',verifyToken, ProfileController.updateProfile)

router.get('user/:id',verifyToken, ProfileController.getProfile)

module.exports = router