const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyToken = function(req, res, next) {
  console.log('Verifying token...');
  const token = req.headers['x-access-token'];
  if (!token) {
    let err = new Error();
    err.statusCode = 401;
    err.message = 'Invalid token';
    return next(err);
  }
  jwt.verify(token, config.secretKey, function(err, decoded) {
    if (err) {
      return next(err);
    }
    req.userId = decoded.id;
    next();
  });
}