const ResponseObjectCreationError = function () {
  this.message = 'Failed to create response object.'
  this.name = 'ResponseObjectCreationError'
  this.stack = (new Error()).stack
}
ResponseObjectCreationError.prototype = Object.create(Error.prototype)
ResponseObjectCreationError.prototype.constructor = ResponseObjectCreationError

const RequestProcessingError = function (statusCode, reason) {
  this.message = reason
  this.name = 'RequestProcessingError'
  this.stack = (new Error()).stack
  this.statusCode = statusCode
}

RequestProcessingError.prototype = Object.create(Error.prototype)
RequestProcessingError.prototype.constructor = RequestProcessingError

export { ResponseObjectCreationError, RequestProcessingError }
