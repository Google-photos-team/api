const errorMiddleware = (err, req, res, next) =>{
  res.status(err.status).json({
    type: err.name,
    data: err.message
  })
}

module.exports = errorMiddleware