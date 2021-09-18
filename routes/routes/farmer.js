const FarmerCotroller = require('../../controllers/FarmerCotroller');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.post('/login-email-farmer',FarmerCotroller.loginEmailFarmer);
  app.post('/insert-farmer',auth.farmerAuthorization,FarmerCotroller.insertFarmer);
  app.put('/update-farmer',auth.farmerAuthorization,FarmerCotroller.updateFarmer);
};