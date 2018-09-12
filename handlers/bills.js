const db = require('../models');

exports.createBill = async function(req, res, next) {
  console.log(req.body);
  try {
    if (!req.body.title) {
      let err = new Error();
      err.message = 'Could not create game without title.';
      err.statusCode = 400;
      return next(err);
      // return res.status(400).json({
      //   error: 'Could not create game without title.'
      // });
    }
    let bill = await db.Bill.create({
      title: req.body.title,
      paid: req.body.paid,
      amount: req.body.amount,
      payAtUrl: req.body.payAtUrl,
      dueEvery: req.body.dueEvery,
      firstDueDate: req.body.firstDueDate
    });
    console.log(`Created game with id ${bill.id}.`);
    return res.status(200).json(bill);
  } catch (err) {
    next(err);
    // return res.status(400).json({
    //   error: 'Could not create bill.'
    // });
  }
};

exports.getBill = async function(req, res, next) {
  try {
    if (req.params.id) {
      console.log(`Getting bill with id ${req.params.id}`);
      let bill = await db.Bill.findById(req.params.id);
      return res.status(200).json(bill);
    } else {
      let err = new Error();
      err.message = `Could not find bill with id ${req.params.id}`;
      err.statusCode = 400;
      return next(err);
      // return res.status(400).json({
      //   error: `Could not find bill with id ${req.params.id}`
      // });
    }
  } catch (err) {
    console.log('Could not find bill.');
    next(err);
    // return res.status(400).json({
    //   error: 'Could not find bill.'
    // });
  }
}

exports.getBills = async function(req, res, next) {
  console.log(`Getting bills...`);
  try {
    let bills = await db.Bill.find();
    return res.status(200).json(bills);
  } catch (err) {
    console.log('Could not find bills.');
    next(err);
    // return res.status(400).json({
    //   error: 'Could not find bills'
    // });
  }
}

exports.updateBill = async function(req, res, next) {
  console.log(`Getting bill with id ${req.params.id}`);
  try {
    if (req.params.id) {
      const updateQuery = {};
      if (req.body.title) {
        updateQuery.title = req.body.title;
      }
      if (req.body.amount) {
        updateQuery.amount = req.body.amount;
      }
      if (req.body.paid !== undefined) {
        updateQuery.paid = req.body.paid;
      }
      if (req.body.dueEvery) {
        updateQuery.dueEvery = req.body.dueEvery;
      }
      if (req.body.payAtUrl) {
        updateQuery.payAtUrl = req.body.payAtUrl;
      }
      if (req.body.firstDueDate) {
        updateQuery.firstDueDate = req.body.firstDueDate;
      }
      let bill = await db.Bill.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
      return res.status(200).json(bill);
    } else {
      let err = new Error();
      err.message = `Could not update game with id ${req.params.id}`;
      err.statusCode = 400;
      return next(err);
      // return res.status(400).json({
      //   error: `Could not update game with id ${req.params.id}`
      // });
    }
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    next(err);
    // return res.status(400).json({
    //   error: 'Could not update game.'
    // });
  }
}

exports.deleteBill = async function(req, res, next) {
  console.log(`Getting bill with id ${req.params.id}`);
  try {
    if (!req.params.id) {
      let err = new Error();
      err.message = `Could not find game to delete with id ${req.params.id}`;
      err.statusCode = 400;
      return next(err);
      // return res.status(400).json({
      //   error: `Could not find game to delete with id ${req.params.id}`
      // });
    }
    let bill = await db.Bill.findById(req.params.id);
    await bill.remove();
    return res.status(200).json(bill);
  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    next(err);
    // return res.status(400).json({
    //   error: 'Could not delete game'
    // });
  }
}