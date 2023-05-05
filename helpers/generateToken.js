const jwt = require('jsonwebtoken')

const generateToken = (payload) => new Promise((resolve, reject) => {
  const secretKey = process.env.SECRET_KEY
  jwt.sign(payload, secretKey, (err, token) => {
    if (err) {
      reject(err)
    } else {
      resolve(token)
    }
  })
})

module.exports = generateToken