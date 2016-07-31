'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _router = require('./routes/router.js');

var _router2 = _interopRequireDefault(_router);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  next();
});

app.use(_bodyParser2.default.json()); // for parsing application/json
app.use(_bodyParser2.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use('/', _router2.default);

app.listen(3000, function () {
  return console.log('Listening on port 3000.');
});

process.on('SIGINT', function () {
  return process.exit(0);
});