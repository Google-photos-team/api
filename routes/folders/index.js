const express = require('express');
const router = express.Router();

const verifyMiddleware = require('../../middlewares/verifyMiddleware');
router.use(verifyMiddleware);

// controllers
const { FoldersController } = require('../../controllers');

router.get('/', FoldersController.getFolders)

router.post('/delete', FoldersController.deleteFolders)

router.post('/create', FoldersController.createFolder)

router.get('/:id', FoldersController.getFolderImages)


module.exports = router