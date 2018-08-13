const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = 3001;

app.use(cors());
app.use(bodyParser);

app.listen(port, () => {
  console.log(`Node server running on port ${port}.`);
});