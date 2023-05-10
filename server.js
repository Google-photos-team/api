require('dotenv').config();
const express = require('express');
const connectToMongoDB_andStartTheServer = require('./db/connect');

const middlewares = require('./middlewares');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/errorMiddleware');


const app = express();
const PORT = process.env.PORT || 8080;

middlewares(app);
routes(app);

app.use(errorMiddleware)

connectToMongoDB_andStartTheServer(app)