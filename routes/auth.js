const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { register, getUserId, login } = require('../handlers/auth');

router.route('/register')
  .post(register);

router.route('/')
  .get(verifyToken, getUserId);

router.route('/login')
  .post(login);

module.exports = router;