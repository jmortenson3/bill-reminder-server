const db = require('../models');
const moment = require('moment');

exports.notifyDailyBills = function() {
  const criteria = {
    'paid': false,
    'dueEvery': 'day'
  };
  return findAndEmail(criteria);
}

exports.notifyWeeklyBills = function() {
  const sysdate = moment().add(3, 'days').format('YYYY-MM-DD');
  const criteria = {
    'paid': false,
    'dueEvery': { $in: [ 'week', 'bi-week' ] },
    'nextDueDate': sysdate
  };
  return findAndEmail(criteria);
}

exports.notifyMonthlyBills = function() {
  const sysdate = moment().add(7, 'days').format('YYYY-MM-DD');
  const criteria = {
    'paid': false,
    'dueEvery': { $in: [ 'month', 'bi-month', 'tri-month', 'bi-year', 'year' ] },
    'nextDueDate': sysdate
  };
  return findAndEmail(criteria);
}

// This will actually send emails when I decide to pay for it.
async function findAndEmail(criteria) {
  try {
    await db.Bill.find(criteria, function(err, docs) {
      if (err) {
        // console.log(err);
        return err;
      }
      docs.forEach(bill => {
        // console.log(JSON.stringify(bill));
        return;
      });
    });
    return true;
  } catch (err) {
    return err;
  }
}