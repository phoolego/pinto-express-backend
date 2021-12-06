const CustomerController = require('../../controllers/CustomerController');
// const FarmerProductController = require('../../controllers/FarmProductController');
const auth = require('../../middlewares/auth');
const UploadFile = require('../../services/FileUpload');
module.exports = (app) => {
  app.post('/customer/register',CustomerController.registerUser);

  app.get('/customer/get-sell-product',auth.authorization,CustomerController.getSellProduct);
  app.get('/customer/get-sell-product/detail',auth.authorization,CustomerController.getSellProductDetail);
  app.get('/customer/get-pre-order-product/detail',auth.authorization,CustomerController.getPreOrderProductDetail);
};