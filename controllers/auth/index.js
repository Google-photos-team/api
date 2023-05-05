const User = require("../../db/Schemas/user")
const { signupSchema } = require("../../utils/validation")
const sha256 = require('js-sha256').sha256

// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

const login = (req, res, next) => {
    // TODO: Check the db if the username and password exists or not then response
}

const signup = async (req, res, next) => {
    // TODO: Check the db if the username used or not then if not create new user
    const {name, password} = req.body;
    try{
        const used = await User.exists({ name })
        if(used){
            const err = new Error("USER_ALREADY_EXIST")
            err.name = "exist_user" 
            throw err;
        }
        await signupSchema.validate({
            name,
            password
        },{abortEarly: false})
        const user = await User.create({
            name,
            password: sha256(password),
            avatar:"",
            folders: [],
            images:[],
        })

        res.json({
            data: user
        })
    }catch (error){
        if(error.name === "ValidationError"){
            const errs = {};
            error.inner.forEach(({ message, params }) => {
                errs[params.path] = message;
            });

            res.status(400).json({
                type: error.name,
                data: errs,
            })
        }else if(error.name === "exist_user"){
            res.status(400).json({
                type: error.name,
                data: error.message
            })
        }
    }
}

const logout = (req, res, next) => {
    // TODO: revoke the token
}

const resetPassword = (req, res, next) => {
    // TODO: Check the db if the old_password equal current then change the value to the new_password
}

module.exports = {
    login,
    signup,
    logout,
    resetPassword
}