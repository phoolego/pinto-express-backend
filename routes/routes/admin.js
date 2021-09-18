const AdminController = require('../../controllers/AdminController');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.post('/login-email-admin',AdminController.loginEmailAdmin);
};