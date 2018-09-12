const jwt = require('jsonwebtoken');
const config = require('../config');

exports.verifyToken = function(req, res, next) {
  console.log('Verifying token...');
  const token = req.headers['x-access-token'];
  if (!token) {
    return next(err);
    // return res.status(400).json({
    //   auth: false,
    //   message: 'Failed to authenticate.'
    // });
  }

  jwt.verify(token, config.secretKey, function(err, decoded) {
    if (err) {
      return next(err);
      // return res.status(500).json({
      //   auth: false,
      //   message: 'Failed to authenticate.'
      // });
    }
    req.userId = decoded.id;
    next();
  });
}