const cors = require('cors');
const bodyParser = require('body-parser');
const verifyMiddleware = require('./verifyMiddleware');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(verifyMiddleware)
}