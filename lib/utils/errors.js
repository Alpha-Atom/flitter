'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ResponseObjectCreationError = function ResponseObjectCreationError() {
  undefined.message = 'Failed to create response object.';
  undefined.name = 'ResponseObjectCreationError';
  undefined.stack = new Error().stack;
};
ResponseObjectCreationError.prototype = Object.create(Error.prototype);
ResponseObjectCreationError.prototype.constructor = ResponseObjectCreationError;

var InvalidAuthenticationKeyError = function InvalidAuthenticationKeyError() {
  undefined.message = 'Failed to authenticate user';
  undefined.name = 'InvalidAuthenticationKeyError';
  undefined.stack = new Error().stack;
  undefined.statusCode = 401;
};

InvalidAuthenticationKeyError.prototype = Object.create(Error.prototype);
InvalidAuthenticationKeyError.prototype.constructor = InvalidAuthenticationKeyError;

var PostTooLongError = function PostTooLongError() {
  undefined.message = 'The post was too long to be stored';
  undefined.name = 'PostTooLongError';
  undefined.stack = new Error().stack;
  undefined.statusCode = 413;
};

PostTooLongError.prototype = Object.create(Error.prototype);
PostTooLongError.prototype.constructor = PostTooLongError;

exports.ResponseObjectCreationError = ResponseObjectCreationError;
exports.InvalidAuthenticationKeyError = InvalidAuthenticationKeyError;