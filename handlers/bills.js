const db = require('../models');

exports.createBill = async function(req, res, next) {
  try {
    if (!req.body.title) {
      let err = new Error();
      err.message = 'Could not create bill: no title.';
      err.statusCode = 400;
      return next(err);
    }
    if (!req.params.username) {
      let err = new Error();
      err.message = 'Could not create bill: unknown user.';
      err.statusCode = 400;
      return next(err);
    }
    const username = req.params.username;
    const { title, paid, amount, payAtUrl,
            dueEvery, firstDueDate } = req.body;
    let bill = await db.Bill.create({
      title, paid, amount, payAtUrl,
      dueEvery, firstDueDate, username
    });
    return res.status(201).json(bill);
  } catch (err) {
    next(err);
  }
};

exports.getBill = async function(req, res, next) {
  try {
    if (req.params.id && req.params.username) {
      const { username, id } = req.params;
      const criteria = {
        $and: [
          { '_id': id },
          { 'username': username }
        ]
      }
      let bill = await db.Bill.find(criteria);
      return res.status(200).json(bill);
    } else {
      let err = new Error();
      err.message = `Could not find bill with id ${id}`;
      err.statusCode = 400;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}

exports.getBills = async function(req, res, next) {
  try {
    if (!req.params.username) {
      let err = new Error();
      err.message = 'Could not get bills: unknown user.';
      err.statusCode = 400;
      return next(err);
    }
    const criteria = {
      'username': req.params.username
    }
    let bills = await db.Bill.find(criteria);
    return res.status(200).json(bills);
  } catch (err) {
    next(err);
  }
}

exports.updateBill = async function(req, res, next) {
  try {
    if (req.params.id && req.params.username) {
      const { title, paid, amount, payAtUrl,
              dueEvery, firstDueDate, doDelete } = req.body;
      const { username, id } = req.params;
      const criteria = {
        $and: [
          { '_id': id },
          { 'username': username }
        ]
      }
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
      if (doDelete !== undefined) {
        updateQuery.doDelete = doDelete;
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
      let bill = await db.Bill.findOneAndUpdate(criteria, updateQuery, { new: true });
      return res.status(201).json(bill);
    } else {
      let err = new Error();
      err.message = `Could not update bill with id ${id}`;
      err.statusCode = 400;
      return next(err);
    }
  } catch (err) {
    next(err);
  }
}