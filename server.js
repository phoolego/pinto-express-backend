const express = require('express');
const http = require('http');
const cors = require('cors');
require('dotenv').config();
db = require('./config/connection');
const fs = require('fs');
const path = require('path');
const morganBody = require('morgan-body');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.static(process.env.STORAGE_PATH));
app.use(express.static(__dirname + '/public'));
require('./routes/routes')(app);

fs.mkdirSync(path.join(__dirname, 'logs'), { recursive: true });
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs/access.log'),
  { flags: 'a' }
);
morganBody(app, {
  noColors: true,
  prettify: false,
  stream: accessLogStream,
  dateTimeFormat: 'iso',
  includeNewLine: true,
});

app.listen(process.env.APP_API_PORT,process.env.APP_API_IP, () =>
  console.log('server run listening on port ' + process.env.APP_API_PORT)
);
module.exports = app;
