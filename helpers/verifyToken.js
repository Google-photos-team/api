const {verify} = require('jsonwebtoken')

const verifyToken = (token) =>
  new Promise((resolve, reject) => {
    verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        err.name = "INVALID";
        err.message = "INVALID_TOKEN";
        err.status = 400;
        reject(err)
      } else {
        resolve(decoded.id)
      }
    })
  })

module.exports = verifyToken