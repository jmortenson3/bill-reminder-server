const bcrypt = require('bcryptjs');
const db = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.getUserId = async function(req, res, next) {
  try {
    const user = await db.User.findById(req.userId, { "password": 0 });
    return res.status(200).json(user);
  } catch(err) {
    next(err);
    // return res.status(500).json({
    //   auth: false,
    //   message: 'Failed to authenticate user.'
    // });
  }
}

exports.register = async function(req, res, next) {
  if (!req.body.password) {
    let err = new Error();
    err.message = 'Password can not be blank.';
    err.statusCode = 400;
    return next(err);
    // return res.status(400).json({
    //   error: 'Password can not be blank.'
    // });
  }

  if (!req.body.email) {
    let err = new Error();
    err.message = 'Email can not be blank.';
    err.statusCode = 400;
    return next(err);
    // return res.status(400).json({
    //   error: 'Email can not be blank.'
    // });
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
    next(err);
    // return res.status(500).json({
    //   error: 'Error registering the user.',
    //   message: err.message
    // });
  }
}

exports.login = async function(req, res, next) {
  if (!req.body.email) {
    let err = new Error();
    err.message = 'Email can not be blank.';
    err.statusCode = 400;
    return next(err);
    // return res.status(400).json({
    //   error: 'Email can not be blank.'
    // });
  }
  if (!req.body.password) {
    let err = new Error();
    err.message = 'Password can not be blank.';
    err.statusCode = 400;
    return next(err);
    // return res.status(400).json({
    //   error: 'Password can not be blank.'
    // });
  }
  try {
    const user = await db.User.findOne({ email: req.body.email });
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      return res.status(400).json({
        auth: false,
        message: 'Invalid password.',
        token: null
      })
    }

    const token = jwt.sign(
      { id: user._id },
      config.secretKey,
      { expiresIn: 86400 }
    );
    return res.status(200).json({
      auth: true,
      message: 'success',
      token: token
    });
  } catch(err) {
    console.log('catching login error');
    next(err);
    // return res.status(500).json({
    //   auth: false,
    //   message: 'Unable to log in.',
    //   token: null
    // });
  }
}