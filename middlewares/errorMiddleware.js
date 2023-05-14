const errorMiddleware = (err, req, res, next) => {
  res.status(err.status).json({
    type: err.name,
    error: err.message
  })
}

module.exports = errorMiddleware