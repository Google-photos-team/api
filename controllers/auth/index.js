// ! CHECK THE REQUIREMENT DOCUMENT TO KNOW THE REQUEST AND RESPONSE SCHEMAS

const login = (req, res, next) => {
    // TODO: Check the db if the username and password exists or not then response
}

const signup = (req, res, next) => {
    // TODO: Check the db if the username used or not then if not create new user
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