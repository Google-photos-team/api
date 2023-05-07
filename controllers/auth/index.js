const User = require("../../db/Schemas/user");
const generateToken = require("../../helpers/generateToken");
const { signupSchema } = require("../../utils/validation")
const sha256 = require('js-sha256').sha256

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

const login = async (req, res, next) => {
    // TODO: Check the db if the username and password exists or not then response
    const { username, password } = req.body;
    try {
        if(!username || !password){
            const err = new Error("MISSING_SOME_PARAMETERS")
            err.name = "missing_params"
            throw err;
        }
        
        const user = await User.findOne({ username, password: sha256(password) });

        if (!user) {
            const err = new Error("USERNAME_OR_PASSWORD_IS_WRONG");
            err.name = "WRONG_INPUTS"
        }

        const token = await generateToken({ id: user._id });
        res.json({
            token,
            username: user.username,
            avatar: user.avatar,
        })
    } catch (error) {
        if (error.name === "WRONG_INPUTS") {
            res.status(400).json({
                type: error.name,
                data: error.message
            })
        } else if (error.name === "missing_params") {
            res.status(400).json({
                type: error.name,
                data: error.message
            })
        } else {
            res.status(404).json({
                type: "unknow_error",
                data: "something went wrong"
            })
        }
    }
}

const signup = async (req, res, next) => {
    // TODO: Check the db if the username used or not then if not create new user
    const { username, password } = req.body;
    try {
        if(!username || !password){
            const err = new Error("MISSING_SOME_PARAMETERS")
            err.name = "missing_params"
            throw err;
        }
        const used = await User.exists({ username })
        if (used) {
            const err = new Error("USER_ALREADY_EXIST")
            err.name = "exist_user"
            throw err;
        }

        await signupSchema.validate({
            username,
            password
        }, { abortEarly: false })
        const user = await User.create({
            username,
            password: sha256(password),
            avatar: "",
            folders: [],
            images: [],
        })

        res.json({
            data: user
        })
    } catch (error) {
        if (error.name === "ValidationError") {
            const errs = {};
            error.inner.forEach(({ message, params }) => {
                errs[params.path] = message;
            });

            res.status(400).json({
                type: error.name,
                data: errs,
            })
        } else if (error.name === "exist_user") {
            res.status(400).json({
                type: error.name,
                data: error.message
            })
        } else if (error.name === "missing_params") {
            res.status(400).json({
                type: error.name,
                data: error.message
            })
        } else {
            res.status(404).json({
                type: "unknow_error",
                data: "something went wrong"
            })
        }
    }
}

const token = async(req, res, next) => {
    // TODO: get data by token "for stay logged in users"

    try {
        const user = await User.findById(req.user_id);

        if (!user) {
            const err = new Error("USER_NOT_FOUND");
            err.name = "WRONG_ID"
        }

        res.json({
            username: user.username,
            avatar: user.avatar,
        })
    } catch (error) {
        if (error.name === "WRONG_ID") {
            res.status(400).json({
                type: error.name,
                data: error.message
            })
        } else {
            res.status(404).json({
                type: "unknow_error",
                data: "something went wrong"
            })
        }
    }

}

const resetPassword = (req, res, next) => {
    // TODO: Check the db if the old_password equal current then change the value to the new_password
}

module.exports = {
    login,
    signup,
    token,
    resetPassword
}