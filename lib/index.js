'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _router = require('./routes/router.js');

var _router2 = _interopRequireDefault(_router);

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _users = require('./controllers/users.js');

var _updates = require('./controllers/updates.js');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var getData = function getData() {
  return {
    name: _faker2.default.name.firstName(),
    email: _faker2.default.internet.email(),
    pass: _faker2.default.name.lastName()
  };
};

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

for (var i = 0; i <= 100; i++) {
  (0, _users.createUser)(getData().email, getData().name, getData().pass).then(function (result) {
    return (0, _updates.postUpdate)(result.body.username, result.body.authKey, 'This is an update.');
  }).then(console.log);
}

process.on('SIGINT', function () {
  return process.exit(0);
});