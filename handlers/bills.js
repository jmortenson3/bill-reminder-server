const db = require('../models');

exports.createBill = async function(req, res, next) {
  try {
    if (!req.body.title) {
      let err = new Error();
      err.message = 'Could not create bill: no title.';
      err.statusCode = 400;
      return next(err);
    }
    if (!req.body.userId) {
      let err = new Error();
      err.message = 'Could not create bill: unknown user.';
      err.statusCode = 400;
      return next(err);
    }
    const { title, paid, amount, payAtUrl,
            dueEvery, firstDueDate } = req.body;
    let bill = await db.Bill.create({
      title, paid, amount, payAtUrl,
      dueEvery, firstDueDate
    });
    return res.status(201).json(bill);
  } catch (err) {
    next(err);
  }
};

exports.getBill = async function(req, res, next) {
  try {
    if (req.params.id) {
      let bill = await db.Bill.findById(req.params.id);
      return res.status(200).json(bill);
    } else {
      let err = new Error();
      err.message = `Could not find bill with id ${req.params.id}`;
      err.statusCode = 400;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}

exports.getBills = async function(req, res, next) {
  try {
    if (!req.body.userId) {
      let err = new Error();
      err.message = 'Could not get bills: unknown user.';
      err.statusCode = 400;
      return next(err);
    }
    let bills = await db.Bill.find();
    return res.status(200).json(bills);
  } catch (err) {
    next(err);
  }
}

exports.updateBill = async function(req, res, next) {
  try {
    if (req.params.id) {
      const { title, paid, amount, payAtUrl,
              dueEvery, firstDueDate, userId } = req.body;
      const updateQuery = {};
      if (title) {
        updateQuery.title = title;
      }
      if (amount) {
        updateQuery.amount = amount;
      }
      if (paid !== undefined) {
        updateQuery.paid = paid;
      }
      if (dueEvery) {
        updateQuery.dueEvery = dueEvery;
      }
      if (payAtUrl) {
        updateQuery.payAtUrl = payAtUrl;
      }
      if (firstDueDate) {
        updateQuery.firstDueDate = firstDueDate;
      }
      let bill = await db.Bill.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
      return res.status(201).json(bill);
    } else {
      let err = new Error();
      err.message = `Could not update game with id ${req.params.id}`;
      err.statusCode = 400;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}

exports.deleteBill = async function(req, res, next) {
  try {
    if (!req.params.id) {
      let err = new Error();
      err.message = `Could not find game to delete with id ${req.params.id}`;
      err.statusCode = 400;
      return next(err);
    }
    let bill = await db.Bill.findById(req.params.id);
    await bill.remove();
    return res.status(201).json(bill);
  } catch (err) {
    next(err);
  }
}