require('dotenv').config();
const express = require('express');

const middlewares = require('./middlewares');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

middlewares(app);
routes(app);


app.listen(PORT, () => {
    console.log(`server now is live on port ${PORT} ✨`)
})