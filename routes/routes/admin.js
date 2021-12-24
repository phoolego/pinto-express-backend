const AdminController = require('../../controllers/AdminController');
const FarmerProductController = require('../../controllers/FarmProductController');
const auth = require('../../middlewares/auth');
const UploadFile = require('../../services/FileUpload');
const uploadProductTypePic = UploadFile.uploadProductTypePic.single('productPic')
const uploadFarmerTransaction = UploadFile.uploadFarmerTransaction.single('farmerTransaction');
module.exports = (app) => {
  app.post('/login-email-admin',AdminController.loginEmailAdmin);

  app.post('/product-type/insert',auth.adminAuthorization,AdminController.insertProductType);
  app.put('/product-type/update',auth.adminAuthorization,AdminController.updateProductType);
  app.put('/product-type/update/pic',auth.adminAuthorization,function (req, res, next) {
    uploadProductTypePic(req, res, function (err) {
      if(err){
        res.status(500).send({ message: err.message });
      }
      next();
    })
  },AdminController.updateProductTypePic);

  app.get('/stock-list',auth.adminAuthorization,AdminController.getStockList);
  app.get('/stock-detail',auth.adminAuthorization,AdminController.getStockDetail);
  app.get('/stock-detail/product',auth.adminAuthorization,AdminController.getFarmStockProduct);
  app.get('/stock-detail/send-stock-product',auth.adminAuthorization,FarmerProductController.getSendStockProduct);
  app.put('/stock/dispose',auth.adminAuthorization,AdminController.disposedStock);

  app.put('/stock-product/receive',auth.adminAuthorization,AdminController.receiveSendStockProduct);
  app.put('/stock-product/pay',auth.adminAuthorization,function (req, res, next) {
    uploadFarmerTransaction(req, res, function (err) {
      if(err){
        res.status(500).send({ message: err.message });
      }
      next();
    })
  },AdminController.paySendStockProduct);

  app.get('/all-farmer',auth.adminAuthorization,AdminController.getAllFarmer);
  app.get('/all-farmer-request',auth.adminAuthorization,AdminController.getAllFarmRequest);
  app.put('/approve-farmer',auth.adminAuthorization,AdminController.approveFarmRequest);
  app.put('/reject-farmer',auth.adminAuthorization,AdminController.rejectFarmRequest);
  app.put('/gain-admin',auth.adminAuthorization,AdminController.gainAdminRole);
  app.put('/set-farmer',auth.adminAuthorization,AdminController.setToFarmer);

  app.get('/admin/order',auth.adminAuthorization,AdminController.getAllUserOrder);
  app.put('/admin/order/validate',auth.adminAuthorization,AdminController.validateOrder);
  app.put('/admin/order/complete',auth.adminAuthorization,AdminController.completeOrder);

  app.get('/admin/pre-order',auth.adminAuthorization,AdminController.getAllUserPreOrder);
};