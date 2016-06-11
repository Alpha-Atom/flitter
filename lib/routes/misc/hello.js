'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var hello = function hello(req, res) {
  var name = req.params.name || 'World';
  res.send('<title>Hello ' + name + '!</title>' + 'Hello ' + name + '!');
};

exports.default = hello;