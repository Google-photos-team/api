require('dotenv').config();
const express = require('express');

const middlewares = require('./middlewares');
const routes = require('./routes');
const connectToMongoDB_andStartTheServer = require('./db/connect');

const app = express();
const PORT = process.env.PORT || 8080;

middlewares(app);
routes(app);

connectToMongoDB_andStartTheServer(app)