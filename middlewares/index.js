const cors = require('cors');
const bodyParser = require('body-parser');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        if (!req.url.startsWith("/auth")) {
            // TODO: Check on the auth token and get the user_id then add header in request include the user id
        }
        next();
    })
}