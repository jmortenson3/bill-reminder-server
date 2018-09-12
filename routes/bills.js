const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const { createBill, getBill, getBills,
        updateBill, deleteBill } = require('../handlers/bills');

router.use(verifyToken);

router.route('/')
  .get(getBills)
  .post(createBill);

router.route('/:id')
  .get(getBill)
  .delete(deleteBill)
  .put(updateBill);

module.exports = router;