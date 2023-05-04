const express = require('express');
const router = express.Router();

router.post('/delete', (req, res) => {
    res.send("HELLO WORLD from delete profile");
})

router.post('/update', (req, res) => {
    res.send("HELLO WORLD from update profile");
})

router.get('/:userId', (req, res) => {
    res.send("HELLO WORLD");
})

module.exports = router