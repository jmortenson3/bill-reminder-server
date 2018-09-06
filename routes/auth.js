const express = require('express');
const router = express.Router();
const {
  register,
  getUserId
} = require('../handlers/auth');

router.route('/register')
  .post(register);

router.route('/')
  .get(getUserId);

module.exports = router;