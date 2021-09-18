const Base = require('./routes/base');
const Admin = require('./routes/admin');
const Farmer = require('./routes/farmer');
module.exports = (app) => {
  app.use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Headers',
      'x-access-token, Origin, Content-Type, Accept'
    );
    next();
  });
  Base(app);
  Admin(app);
  Farmer(app);
};
