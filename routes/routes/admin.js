const AdminController = require('../../controllers/AdminController');
const FarmerProductController = require('../../controllers/FarmProductController');
const auth = require('../../middlewares/auth');
const UploadFile = require('../../services/FileUpload');
module.exports = (app) => {
  app.post('/login-email-admin',AdminController.loginEmailAdmin);

  app.post('/product-type/insert',auth.adminAuthorization,UploadFile.uploadProductTypePic.single('productPic'),AdminController.insertProductType);

  app.get('/stock-list',auth.adminAuthorization,AdminController.getStockList);
  app.get('/stock-detail',auth.adminAuthorization,AdminController.getStockDetail);
  app.get('/stock-detail/product',auth.adminAuthorization,AdminController.getFarmStockProduct);
  app.get('/stock-detail/send-stock-product',auth.adminAuthorization,FarmerProductController.getSendStockProduct);

  app.put('/stock-product/receive',auth.adminAuthorization,AdminController.receiveSendStockProduct);
  app.put('/stock-product/pay',auth.adminAuthorization,AdminController.paySendStockProduct);
};