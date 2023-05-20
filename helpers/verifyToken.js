const createHttpError = require('http-errors');
const { verify } = require('jsonwebtoken')

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const payload = verify(token, process.env.SECRET_KEY)
      resolve(payload.id)
    } catch (error) {
      reject(createHttpError(401, "invalid token"))
    }
  })
}

module.exports = verifyToken