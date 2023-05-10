const express = require('express');
const router = express.Router();
// controllers
const { FoldersController } = require('../../controllers');

router.get('/', FoldersController.getFolders)

router.post('/delete', FoldersController.deleteFolders)

router.post('/create', FoldersController.createFolder)

router.get('/:id', FoldersController.getFolderImages)

module.exports = router