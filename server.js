var express = require('express');
const http = require('http');
var bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
db = require('./config/connection');
const fs = require('fs');
const path = require('path');
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
require('./routes/routes')(app);

fs.mkdirSync(path.join(__dirname, 'logs'), { recursive: true });
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs/access.log'),
  { flags: 'a' }
);

app.listen(process.env.APP_API_PORT, () =>
  console.log('server run listening on port ' + process.env.APP_API_PORT)
);
module.exports = app;
