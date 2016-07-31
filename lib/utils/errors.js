'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var ResponseObjectCreationError = function ResponseObjectCreationError() {
  this.message = 'Failed to create response object.';
  this.name = 'ResponseObjectCreationError';
  this.stack = new Error().stack;
};
ResponseObjectCreationError.prototype = Object.create(Error.prototype);
ResponseObjectCreationError.prototype.constructor = ResponseObjectCreationError;

var RequestProcessingError = function RequestProcessingError(statusCode, reason) {
  this.message = reason;
  this.name = 'RequestProcessingError';
  this.stack = new Error().stack;
  this.statusCode = statusCode;
};

RequestProcessingError.prototype = Object.create(Error.prototype);
RequestProcessingError.prototype.constructor = RequestProcessingError;

exports.ResponseObjectCreationError = ResponseObjectCreationError;
exports.RequestProcessingError = RequestProcessingError;