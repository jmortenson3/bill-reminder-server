const bcrypt = require('bcryptjs');
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getUserId = async function(req, res, next) {
  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).json({
        auth: false,
        message: 'No token provided.'
      });
    }

    const decoded = jwt.verify(token, config.secretKey);
    return res.status(200).send(decoded);
  } catch(err) {
    return res.status(500).json({
      auth: false,
      message: 'Failed to authenticate user.'
    });
  }
}


exports.register = async function(req, res, next) {
  if (!req.body.password) {
    return res.status(400).json({
      error: 'Password can not be blank.'
    })
  }

  if (!req.body.email) {
    return res.status(400).json({
      error: 'Email can not be blank.'
    });
  }

  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    let user = await db.User.create({
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      config.secretKey,
      { expiresIn: 86400 }  // 24 hours
    );

    return res.status(200).json({ auth: true, token: token });

  } catch (err) {
    return res.status(500).json({
      error: 'Error registering the user.',
      message: err.message
    });
  }
}