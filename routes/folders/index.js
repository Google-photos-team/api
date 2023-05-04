const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/delete', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/create', (req, res) => {
    res.send("HELLO WORLD");
})

// GET LIST OF IMAGES => in requirement documentation section #Images
router.post('/:folderId', (req, res) => {
    res.send("HELLO WORLD");
})

module.exports = router