const db = require('../models');

exports.deleteBills = function() {
  const criteria = {
    'doDelete': true
  };
  try {
    db.Bill.remove(criteria);
  } catch (err) {
    console.log(err);
  }
}