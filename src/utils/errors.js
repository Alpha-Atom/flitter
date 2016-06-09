const ResponseObjectCreationError = () => {
  this.message = 'Failed to create response object.'
  this.name = 'ResponseObjectCreationError'
  this.stack = (new Error()).stack
}
ResponseObjectCreationError.prototype = Object.create(Error.prototype)
ResponseObjectCreationError.prototype.constructor = ResponseObjectCreationError

const InvalidAuthenticationKeyError = () => {
  this.message = 'Failed to authenticate user'
  this.name = 'InvalidAuthenticationKeyError'
  this.stack = (new Error()).stack
  this.statusCode = 401
}

InvalidAuthenticationKeyError.prototype = Object.create(Error.prototype)
InvalidAuthenticationKeyError.prototype.constructor = InvalidAuthenticationKeyError

const PostTooLongError = () => {
  this.message = 'The post was too long to be stored'
  this.name = 'PostTooLongError'
  this.stack = (new Error()).stack
  this.statusCode = 413
}

PostTooLongError.prototype = Object.create(Error.prototype)
PostTooLongError.prototype.constructor = PostTooLongError

export { ResponseObjectCreationError, InvalidAuthenticationKeyError }
