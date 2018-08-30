const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
const billRoutes = require('./routes/bills');
const schedule = require('node-schedule');
const jobs = require('./jobs');

app.use(cors());
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded());

app.use('/api/b', billRoutes);

app.use(function(req, res, next) {
  return res.status(404).json({
    error: 'Unknown route.'
  })
});

jobs.dates.nextDueDate();
const job = schedule.scheduleJob('* */5 * * * *', function() {
  //jobs.dates.nextDueDate();
});

app.listen(port, () => {
  console.log(`Node server running on port ${port}.`);
});