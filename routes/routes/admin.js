const AdminController = require('../../controllers/AdminController');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.post('/login-email-admin',AdminController.loginEmailAdmin);

  app.get('/stock-list',auth.adminAuthorization,AdminController.getStockList);
  app.get('/stock-detail',auth.adminAuthorization,AdminController.getStockDetail);
};