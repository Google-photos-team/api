const express = require('express');
const router = express.Router();
// controllers
const { ImagesController } = require('../../controllers');
const verifyMiddleware = require('../../middlewares/verifyMiddleware');
router.use(verifyMiddleware);

router.get('/:id', ImagesController.findImageById);

router.post('/delete', ImagesController.deleteImages);

router.post('/move', ImagesController.moveImages);

router.post('/create', ImagesController.createImage);

router.get('/find', ImagesController.findImages);


router.get('/find/:value', ImagesController.findImages);

module.exports = router