var mysql = require('mysql');
const util = require('util');
var dbDetail = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

const pintodb = mysql.createPool(dbDetail);
pintodb.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
  }
  if (connection) connection.release();
  return;
});

pintodb.query = util.promisify(pintodb.query);
setInterval(function () {
  pintodb.query('SELECT 1');
}, 5000);

module.exports = { pintodb };
