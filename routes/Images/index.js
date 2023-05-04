const express = require('express');
const router = express.Router();
// controllers
const { ImagesController } = require('../../controllers');

router.get('/delete', ImagesController.deleteImages)

router.post('/move', ImagesController.moveImages)

router.post('/create', ImagesController.createImage)

router.post('/find', ImagesController.findImages)

module.exports = router