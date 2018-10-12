const express = require('express');
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const CONFIG = require('./config');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3001;
const billRoutes = require('./routes/bills');
const authRoutes = require('./routes/auth');
const schedule = require('node-schedule');
const jobs = require('./jobs');
const { handleError, unknownRoute } = require('./middleware/error');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use('/api/users', billRoutes);
app.use('/api/auth', authRoutes);

app.use(handleError);
app.use(unknownRoute);

const dueDateJob = schedule.scheduleJob('*/5 * * * *', function() {
  jobs.dates.nextDueDate();
});

const deleteBillsJob = schedule.scheduleJob('0 0 * * *', function() {
  jobs.bills.deleteBills();
});

https.createServer({
  key: fs.readFileSync(CONFIG.keyFile),
  cert: fs.readFileSync(CONFIG.certFile)
}, app).listen(port, () => {
  console.log(`Node server running on port ${port}.`);
});