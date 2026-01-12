function errorHandler (err, req, res, next) {
  const status = err.statusCode || 500

  console.error({
    name: err.name,
    timestamp: new Date().toISOString(),
    message: err.message,
    status,
    path: req.originalUrl,
    method: req.method
  })

  res.status(status).json({
    error: status === 500 ? 'Unexpected error' : err.message
  })
}

module.exports = { errorHandler }
