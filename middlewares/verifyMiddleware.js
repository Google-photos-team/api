const verifyToken = require('../helpers/verifyToken');
const User = require('../db/Schemas/user');
const createHttpError = require('http-errors');

const verifyMiddleware = async (req, res, next) => {
    // TODO: Check on the auth token and get the user_id then add header in request include the user id
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return next(createHttpError(401, "you need to login before send this request (there is no token passed)"))
    }

    try {
        const user_id = await verifyToken(token);
        const existUser = await User.exists({ _id: user_id });

        if (existUser) {
            req.user_id = user_id;
            next();
        } else {
            return next(createHttpError(401, "invalid token"))
        }
    } catch (error) {
        console.log(error)
        return next(createHttpError(401, "invalid token"))
    }
}

module.exports = verifyMiddleware