const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        if (!req.url.startswith("/auth")) {
            // TODO: Check on the auth token
        }
        next();
    })
}