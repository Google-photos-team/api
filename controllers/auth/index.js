const createHttpError = require("http-errors");
const User = require("../../db/Schemas/user");
const generateToken = require("../../helpers/generateToken");
const { authValidation } = require("../../utils/validation")
const sha256 = require('js-sha256').sha256

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS
const login = async (req, res, next) => {
    // TODO: Check the db if the username and password exists or not then response
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return next(createHttpError(400, "missing username or password"))
        }

        const user = await User.findOne({ username, password: sha256(password) });

        if (!user) {
            return next(createHttpError(400, "username or password is wrong"))
        }

        const token = await generateToken({ id: user._id });
        res.status(200).json({
            status: true,
            data: {
                token,
                username: user.username,
                avatar: user.avatar,
            }
        })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const signup = async (req, res, next) => {
    // TODO: Check the db if the username used or not then if not create new user
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return next(createHttpError(400, "missing username or password"))
        }
        const used = await User.exists({ username })
        if (used) {
            return next(createHttpError(409, "user already exist"))
        }

        authValidation.signupSchema.validate({ username, password })
            .then(async () => {
                const user = await User.create({
                    username,
                    password: sha256(password),
                    avatar: "",
                    folders: [],
                    images: [],
                })

                const token = await generateToken({ id: user._id });
                return res.status(201).json({
                    status: true,
                    data: {
                        token,
                        username: user.username,
                        avatar: user.avatar,
                    }
                })
            })
            .catch(error => {
                return next(createHttpError(400, error));
            })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

const token = async (req, res, next) => {
    // TODO: get data by token "for stay logged in users"
    try {
        const user = await User.findById(req.user_id);
        return res.json({
            status: true,
            data: {
                username: user.username,
                avatar: user.avatar,
            }
        })
    } catch (error) {
        return next(createHttpError(500, error.message))
    }

}

const resetPassword = async (req, res, next) => {
    // TODO: Check the db if the old_password equal current then change the value to the new_password
    try {
        const { old_password, new_password } = req.body;
        const user = await User.findById(req.user_id);
        if (!user) {
            return next(createHttpError(404, "invalid token"))
        }

        if (sha256(old_password) === user.password) {
            await authValidation.resetPasswordSchema.validate({ password: new_password })
                .then(async () => {
                    user.password = sha256(new_password);
                    await user.save();

                    return res.json({
                        status: true,
                    })
                })
                .catch((error) => {
                    return next(createHttpError(400, error))
                });
        } else {
            return next(createHttpError(400, "old password is wrong"))
        }
    } catch (error) {
        return next(createHttpError(500, error.message))
    }
}

module.exports = {
    login,
    signup,
    token,
    resetPassword
}