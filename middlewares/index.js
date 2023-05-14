const cors = require('cors');
const bodyParser = require('body-parser');
const verifyMiddleware = require('./verifyMiddleware');
const express = require('express');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json({ limit: '3mb' }));
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(verifyMiddleware)
}