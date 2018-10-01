const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createBill, getBill, getBills,
        updateBill } = require('../handlers/bills');

router.use(verifyToken);

router.route('/:username/bills')
  .post(createBill)
  .get(getBills);

router.route('/:username/bills/:id')
  .get(getBill)
  .put(updateBill);

module.exports = router;