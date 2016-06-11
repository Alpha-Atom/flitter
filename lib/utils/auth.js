'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcryptNodejs = require('bcrypt-nodejs');

var generate = function generate(username) {
  var obfuscator = (Math.random() + 1).toString(36).substring(7);
  return (0, _bcryptNodejs.hashSync)(Date.now().toString() + username + obfuscator);
};

exports.default = generate;