const db = require('../models');
const moment = require('moment');

exports.nextDueDate = async function() {
  const sysdate = moment().format('YYYY-MM-DD');
  const criteria = {
    $or: [
      { 'nextDueDate': { $exists: false } },
      { $and: [
        { 'nextDueDate': { $exists: true } },
        { 'nextDueDate': { $lt: sysdate } }
      ]}
    ]
  };

  try {
    let bills = await db.Bill.find(criteria, function(err, docs) {
      if (err) {
        console.log(err);
        return err;
      }
      let nextDueDate;
      docs.forEach(async bill => {
        if (!bill.dueEvery) {
          return;
        }
        if (moment(bill.firstDueDate) > moment()) {
          nextDueDate = bill.firstDueDate;
        } else {
          const freq = bill.dueEvery.toUpperCase();
          if (freq === 'DAY') {
            nextDueDate = moment().add(1, 'days').format('YYYY-MM-DD');
          } else if (['WEEK', 'BI-WEEK'].includes(freq)) {
            const firstDayOfWeek = moment(bill.firstDueDate).weekday();
            const dueOnDay = moment().isoWeekday(firstDayOfWeek);
            const today = moment().isoWeekday();
            if (freq === 'WEEK') {
              nextDueDate = today < dueOnDay
                      ? moment().add(1, 'week').day(dueOnDay).format('YYYY-MM-DD')
                      : moment().day(dueOnDay).format('YYYY-MM-DD');
            } else {
              // 7/20 -> 8/31
              const weeksSinceFirst = moment().day(firstDayOfWeek)
                      .diff(moment(bill.firstDueDate), 'week');
              nextDueDate = today < firstDayOfWeek
                      ? moment().add(weeksSinceFirst % 2, 'week').day(firstDayOfWeek).format('YYYY-MM-DD')
                      : moment().add((weeksSinceFirst % 2) + 1, 'week').day(firstDayOfWeek).format('YYYY-MM-DD');
            }
          } else if (freq === 'MONTH') {
            nextDueDate = moment() > moment().date(moment(bill.firstDueDate).date())
                    ? moment().add(1, 'month').date(moment(bill.firstDueDate).date()).format('YYYY-MM-DD')
                    : moment().date(moment(bill.firstDueDate).date()).format('YYYY-MM-DD');
          } else if (['BI-MONTH', 'TRI-MONTH', 'BI-YEAR'].includes(freq)) {
            const dueOnDate = moment(bill.firstDueDate).date();
            const monthsSinceFirst = moment().date(dueOnDate)
                    .diff(moment(bill.firstDueDate), 'month');
            const todayDate = moment().date();
            if (freq === 'BI-MONTH') {
              nextDueDate = todayDate < dueOnDate
                      ? moment().add(monthsSinceFirst % 2, 'month').date(dueOnDate).format('YYYY-MM-DD')
                      : moment().add((monthsSinceFirst % 2) + 1, 'month').date(dueOnDate).format('YYYY-MM-DD');
            } else if (freq === 'TRI-MONTH') {
              nextDueDate = todayDate < dueOnDate
                      ? moment().date(dueOnDate).format('YYYY-MM-DD')
                      : moment().date(dueOnDate).add(3 - (monthsSinceFirst % 3), 'month').format('YYYY-MM-DD');
            }
          } else if (freq === 'YEAR') {
            nextDueDate = moment() > moment(bill.firstDueDate).year(moment().year())
                    ? moment(bill.firstDueDate).year(moment().year() + 1).format('YYYY-MM-DD')
                    : moment(bill.firstDueDate).year(moment().year()).format('YYYY-MM-DD');
          }
        }
        const updateQuery = { nextDueDate: nextDueDate, paid: false };
        let updatedBill = await db.Bill.findByIdAndUpdate(bill._id, updateQuery, { new: true });
      });
    });
  } catch (err) {
    console.log(err);
    return err;
  }
}