'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userFromAuth = exports.authUser = exports.createUser = exports.userExists = exports.userEmailExists = undefined;

var _redisClient = require('../redis/redis-client.js');

var _redisClient2 = _interopRequireDefault(_redisClient);

var _auth = require('../utils/auth.js');

var _auth2 = _interopRequireDefault(_auth);

var _emailValidator = require('email-validator');

var _bcryptNodejs = require('bcrypt-nodejs');

var _objects = require('../utils/objects.js');

var _errors = require('../utils/errors.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createUser = function createUser(email, username, password) {
  var usernameLower = username.toLowerCase();
  var validEmail = (0, _emailValidator.validate)(email);

  return userEmailExists(usernameLower, email).then(function (result) {
    var userKey = 'user:' + usernameLower;
    if (result === false && validEmail === true) {
      var hash = (0, _bcryptNodejs.hashSync)(password);
      if (hash) {
        var authKey = (0, _auth2.default)(usernameLower);
        var authRedis = 'auth:' + authKey;
        var userObject = {
          email: email,
          username: usernameLower,
          password: hash,
          authKey: authKey,
          following: JSON.stringify([]),
          followers: JSON.stringify([])
        };
        _redisClient2.default.set(authRedis, usernameLower);
        _redisClient2.default.hmset(userKey, userObject);
        return (0, _objects.responseObject)(200, userObject);
      } else {
        throw new _errors.RequestProcessingError(500, 'Error when hashing password.');
      }
    } else if (result === true) {
      throw new _errors.RequestProcessingError(409, 'User or email already in use.');
    } else if (validEmail === false) {
      throw new _errors.RequestProcessingError(422, 'Email is invalid.');
    } else {
      throw new _errors.RequestProcessingError(500, 'Database error.');
    }
  }).catch(function (e) {
    return (0, _objects.responseObject)(e.statusCode, e.message);
  });
};

var authUser = function authUser(username, password) {
  var usernameLower = username.toLowerCase();
  var userKey = 'user:' + usernameLower;

  return _redisClient2.default.hgetall(userKey).then(function (result) {
    if (result.username === usernameLower) {
      var passwordMatch = (0, _bcryptNodejs.compareSync)(password, result.password);
      if (passwordMatch === true) {
        var authKey = result.authKey;
        var newAuthKey = (0, _auth2.default)(username);
        var authObject = {
          authKey: newAuthKey
        };
        if (authKey) {
          _redisClient2.default.del('auth:' + authKey);
        }
        _redisClient2.default.set('auth:' + newAuthKey, usernameLower);
        _redisClient2.default.hset(userKey, 'auth', newAuthKey);
        return (0, _objects.responseObject)(200, authObject);
      } else {
        return (0, _objects.responseObject)(401, 'Incorrect password');
      }
    } else {
      return (0, _objects.responseObject)(401, 'Username not found');
    }
  });
};

var userEmailExists = function userEmailExists(username, email) {
  console.log(username, email);
  var usernameLower = username.toLowerCase();
  var userKey = 'user:' + usernameLower;

  return _redisClient2.default.hgetall(userKey).then(function (result) {
    var doesExist = !!result.password || result.email === email.toLowerCase();
    return doesExist;
  }).catch(function (e) {
    console.error('Error getting user key.');
    return undefined;
  });
};

var userExists = function userExists(user) {
  return _redisClient2.default.hgetall('user:' + user.toLowerCase()).then(function (r) {
    return !!r.password;
  });
};

var userFromAuth = function userFromAuth(auth) {
  return _redisClient2.default.get('auth:' + auth);
};

exports.userEmailExists = userEmailExists;
exports.userExists = userExists;
exports.createUser = createUser;
exports.authUser = authUser;
exports.userFromAuth = userFromAuth;