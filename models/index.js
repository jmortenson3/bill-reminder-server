const CONFIG = require('../config');
const mongoose = require('mongoose');

const uri = `mongodb://${CONFIG.user}:${CONFIG.pass}@localhost:27001/bills`;
const options = {
  keepAlive: true,
  useNewUrlParser: true
}

mongoose.set('debug', true);
mongoose.connect(uri, options)
  .then( () => {
    console.log(`Connected to mongodb as user ${CONFIG.user}`);
  })
  .catch( () => {
    console.log(`ERROR:  Database connection failed.`)
  });

module.exports.Bill = require('./bill');
module.exports.User = require('./user');