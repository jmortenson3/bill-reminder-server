const CONFIG = require('../config');
const mongoose = require('mongoose');

const uri = `mongodb://${CONFIG.user}:${CONFIG.pass}@ds119702.mlab.com:19702/bills`;
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