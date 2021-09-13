const FarmerCotroller = require('../../controllers/FarmerCotroller');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.post('/login-email-farmer',FarmerCotroller.loginEmailFarmer);
};