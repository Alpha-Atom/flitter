'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = exports.userExists = undefined;

var _emailValidator = require('email-validator');

var _bcryptNodejs = require('bcrypt-nodejs');

var _redisClient = require('../redis/redis-client.js');

var _redisClient2 = _interopRequireDefault(_redisClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUser = function createUser(email, username, password) {

  var usernameLower = username.toLowerCase();
  var validEmail = (0, _emailValidator.validate)(email);

  return userExists(usernameLower, email).then(function (result) {
    var userKey = "user:" + usernameLower;
    if (result === false && validEmail === true) {
      var hash = (0, _bcryptNodejs.hashSync)(password);
      if (hash) {
        var userObject = {
          email: email,
          username: usernameLower,
          password: hash
        };
        _redisClient2.default.hmset(userKey, userObject);
        return [200, userObject];
      } else {
        return [500, "Error when hashing password."];
      }
    } else {
      return [409, "User or email already in use."];
    }
  });
};

var userExists = function userExists(username, email) {

  var usernameLower = username.toLowerCase();
  var userKey = "user:" + usernameLower;

  return _redisClient2.default.hgetall(userKey).then(function (result) {
    var doesExist = !!result.password && result.email === email.toLowerCase();
    return doesExist;
  }).catch(function (e) {
    console.error("Error getting user key.");
    return true;
  });
};

exports.userExists = userExists;
exports.createUser = createUser;