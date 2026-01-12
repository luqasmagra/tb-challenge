class ValidationError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ValidationError'
    this.statusCode = 400
  }
}

class NotFoundError extends Error {
  constructor (message) {
    super(message)
    this.name = 'NotFoundError'
    this.statusCode = 404
  }
}

class ExternalServiceError extends Error {
  constructor (message) {
    super(message)
    this.name = 'ExternalServiceError'
    this.statusCode = 502
  }
}

module.exports = { ValidationError, NotFoundError, ExternalServiceError }
