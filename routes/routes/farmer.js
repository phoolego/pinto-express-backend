const FarmerController = require('../../controllers/FarmerController');
const FarmerProductController = require('../../controllers/FarmProductController');
const UploadFile = require('../../services/FileUpload');
const auth = require('../../middlewares/auth');
module.exports = (app) => {
  app.post('/login-email-farmer',FarmerController.loginEmailFarmer);
  app.post('/insert-farmer',auth.farmerAuthorization,FarmerController.insertFarmer);
  app.put('/update-farmer',auth.farmerAuthorization,FarmerController.updateFarmer);
  app.post('/register-farmer',FarmerController.registerFarmer);
  app.post('/request-farmer-role',FarmerController.requestFarmerRole);

  app.get('/farmer-product',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.getFarmerProduct);
  app.get('/farmer-product/detail',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.getFarmerProductDetail);
  app.post('/farmer-product/insert',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.insertFarmerProduct);
  app.put('/farmer-product/update-pic',auth.farmerAuthorization,auth.farmOwner,UploadFile.uploadProductPic.single('productPic'));

  app.put('/farmer-product/harvest',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.harvestFarmerProduct);
  app.put('/farmer-product/dispose',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.disposeFarmerProduct);

  app.get('/send-stock-product',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.getSendStockProduct);
  app.post('/send-stock-product/insert',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.insertSendStockProduct);
  app.delete('/send-stock-product/cancel',auth.farmerAuthorization,auth.farmOwner,FarmerProductController.cancelSendStockProduct);
};