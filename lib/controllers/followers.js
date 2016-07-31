'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.follow = undefined;

var _ioredis = require('ioredis');

var _ioredis2 = _interopRequireDefault(_ioredis);

var _users = require('users.js');

var _objects = require('../utils/objects.js');

var _errors = require('../utils/errors.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var follow = function follow(userOrigin, userTarget, auth) {
  var userOriginLower = userOrigin.toLowerCase();
  var userTargetLower = userTarget.toLowerCase();
  var userKey = 'user:' + userOriginLower;
  var targKey = 'user:' + userTargetLower;
  var originUserAuth = (0, _users.userFromAuth)(auth).then(function (r) {
    return r === userOriginLower;
  });
  var userTargetExists = (0, _users.userExists)(userTargetLower);

  Promise.all([originUserAuth, userTargetExists]).then(function (values) {
    var authd = values[0];
    var exists = values[1];
    if (authd) {
      if (exists) {
        var following = _ioredis2.default.hget(userKey, 'following');
        var followers = _ioredis2.default.hget(targKey, 'followers');
        return Promise.all([following, followers]);
      } else {
        throw new _errors.RequestProcessingError(404, 'User not found.');
      }
    } else {
      throw new _errors.RequestProcessingError(401, 'Failed to authenticate user');
    }
  }).then(function (results) {
    var following = JSON.stringify(results[0]);
    var followers = JSON.stringify(results[1]);
    following.push(userTargetLower);
    followers.push(userOriginLower);
    _ioredis2.default.hset(userKey, 'following', following);
    _ioredis2.default.hset(targKey, 'followers', followers);
    return _ioredis2.default.hgetall(userKey);
  }).then(function (r) {
    return (0, _objects.responseObject)(200, r);
  }).catch(function (e) {
    return (0, _objects.responseObject)(e.statusCode, e.message);
  });
};

exports.follow = follow;