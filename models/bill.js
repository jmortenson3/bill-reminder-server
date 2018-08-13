const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billSchema = new Schema({
  title: String,
  paid: Boolean,
  amount: Number,
  payAtUrl: String,
  dueDate: Date
}, { collection: 'bills' });

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;