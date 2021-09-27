const FarmerController = require('../../controllers/FarmerController');
const FarmerProductController = require('../../controllers/FarmProductController');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.post('/login-email-farmer',FarmerController.loginEmailFarmer);
  app.post('/insert-farmer',auth.farmerAuthorization,FarmerController.insertFarmer);
  app.put('/update-farmer',auth.farmerAuthorization,FarmerController.updateFarmer);
  app.post('/register-farmer',FarmerController.registerFarmer);
  app.post('/request-farmer-role',FarmerController.requestFarmerRole);

  app.get('/farmer-product',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.getFarmerProduct);
  app.post('/farmer-product/insert',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.insertFarmerProduct);
  app.put('/farmer-product/harvest',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.harvestFarmerProduct);
  app.put('/farmer-product/dispost',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.dispostFarmerProduct);

  app.get('/send-stock-product/',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.getSendStockProduct);
  app.post('/send-stock-product/insert',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.insertSendStockProduct);
};