'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.responseObject = undefined;

var _errors = require('../utils/errors.js');

var responseObject = function responseObject(statusCode, body) {
  if (Object.prototype.toString.call(body) === '[object Object]') {
    return {
      statusCode: statusCode,
      body: body
    };
  } else if (typeof body === 'string') {
    return {
      statusCode: statusCode,
      body: {
        error: body
      }
    };
  } else {
    throw new _errors.ResponseObjectCreationError();
  }
};

exports.responseObject = responseObject;