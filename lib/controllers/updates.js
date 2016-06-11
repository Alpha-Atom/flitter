'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.postUpdate = undefined;

var _redisClient = require('../redis/redis-client.js');

var _redisClient2 = _interopRequireDefault(_redisClient);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _users = require('./users.js');

var _objects = require('../utils/objects.js');

var _errors = require('../utils/errors.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var postUpdate = function postUpdate(username, auth, messageContent) {
  var usernameLower = username.toLowerCase();

  return (0, _users.userFromAuth)(auth).then(function (expectedUsername) {
    if (expectedUsername === usernameLower) {
      if (messageContent.length <= 140) {
        var currentTime = Date.now();
        var postKey = 'update:' + usernameLower + ':' + currentTime;
        var postObject = {
          postId: _nodeUuid2.default.v4(),
          username: usernameLower,
          time: currentTime,
          message: messageContent
        };
        _redisClient2.default.hmset(postKey, postObject);
        return postObject;
      } else {
        throw new _errors.PostTooLongError();
      }
    } else {
      throw new _errors.InvalidAuthenticationKeyError();
    }
  }).catch(function (e) {
    return (0, _objects.responseObject)(e.statusCode, e.message);
  });
};

exports.postUpdate = postUpdate;