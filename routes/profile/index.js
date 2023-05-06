const express = require('express');
const router = express.Router();
// const verifyToken = require('../../helpers/verifyToken');
// controllers
const { ProfileController } = require('../../controllers');

router.delete('user/delete', ProfileController.deleteProfile)

router.post('user/update', ProfileController.updateProfile)

router.get('user/:id', ProfileController.getProfile)

module.exports = router