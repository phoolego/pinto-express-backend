const BaseController = require('../../controllers/BaseController');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.get(
    '/',
    BaseController.index
  );
  //User
  app.post('/insert-user',BaseController.insertUser);
  app.post('/login-email',BaseController.loginEmail);
  //Product
  app.get('/product-type',auth.authorization, BaseController.getProductType);
};
