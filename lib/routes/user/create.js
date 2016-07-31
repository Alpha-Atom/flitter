'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _users = require('../../controllers/users.js');

var create = function create(req, res) {
  var uname = req.body.username;
  var email = req.body.email;
  var passw = req.body.password;
  if (uname && email && passw) {
    (0, _users.createUser)(email, uname, passw).then(function (r) {
      return res.status(r.statusCode).json(r.body);
    });
  } else {
    res.status(400).send('Missing parameters');
  }
};

exports.default = create;