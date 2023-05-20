const express = require('express');
const router = express.Router();

const verifyMiddleware = require('../../middlewares/verifyMiddleware');
router.use(verifyMiddleware);

// controllers
const { ProfileController } = require('../../controllers');

router.delete('/delete', ProfileController.deleteProfile)

router.post('/update', ProfileController.updateProfile)

router.get('/', ProfileController.getProfile)

module.exports = router