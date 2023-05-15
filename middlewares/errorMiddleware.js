const errorMiddleware = (err, req, res, next) => {
  res.status(err.status).json({
    status: false,
    message: err.message
  })
}

module.exports = errorMiddleware