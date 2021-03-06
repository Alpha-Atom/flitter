'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _hello = require('./misc/hello.js');

var _hello2 = _interopRequireDefault(_hello);

var _create = require('./user/create.js');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/hello/(:name)?', _hello2.default);
router.post('/user/create/', _create2.default);

exports.default = router;