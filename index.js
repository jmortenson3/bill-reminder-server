const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;
const billRoutes = require('./routes/bills');

app.use(cors());
app.use(bodyParser.urlencoded());

app.use('/api/b', billRoutes);

app.use(function(req, res, next) {
  return res.status(404).json({
    error: 'Unknown route.'
  })
});

app.listen(port, () => {
  console.log(`Node server running on port ${port}.`);
});