const express = require('express');
const router = express.Router();
router.get('/delete', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/move', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/create', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/find', (req, res) => {
    res.send("HELLO WORLD");
})

module.exports = router