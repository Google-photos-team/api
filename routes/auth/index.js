const express = require('express');
const router = express.Router();
router.post('/signup', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/login', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/logout', (req, res) => {
    res.send("HELLO WORLD");
})

router.post('/reset-password', (req, res) => {
    res.send("HELLO WORLD");
})

module.exports = router