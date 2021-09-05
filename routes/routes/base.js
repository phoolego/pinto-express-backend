const BaseController = require('../../controllers/BaseController');
module.exports = (app) => {
  app.get(
    '/',
    BaseController.index
  );
  app.post('/insert-user',BaseController.insertUser);
  app.post('/login-email',BaseController.loginEmail);
};
