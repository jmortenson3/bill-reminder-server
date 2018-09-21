const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createBill, getBill, getBills,
        updateBill, deleteBill } = require('../handlers/bills');

router.use(verifyToken);

router.route('/:username/bills')
  .post(createBill)
  .get(getBills);

router.route('/:username/bills/:id')
  .get(getBill)
  .delete(deleteBill)
  .put(updateBill);

module.exports = router;