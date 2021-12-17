const CustomerController = require('../../controllers/CustomerController');
const auth = require('../../middlewares/auth');
const UploadFile = require('../../services/FileUpload');
const uploadOrderTransaction = UploadFile.uploadOrderTransaction.single('tranPic')
module.exports = (app) => {
  app.post('/customer/register',CustomerController.registerUser);

  app.get('/customer/get-sell-product',auth.authorization,CustomerController.getSellProduct);
  app.get('/customer/get-sell-product/detail',auth.authorization,CustomerController.getSellProductDetail);
  app.get('/customer/get-pre-order-product/detail',auth.authorization,CustomerController.getPreOrderProductDetail);

  app.get('/customer/pre-order',auth.authorization,CustomerController.getUserPreOrder);
  app.post('/customer/pre-order/create',auth.authorization,CustomerController.insertPreOrder);
  app.put('/customer/pre-order/cancel',auth.authorization,CustomerController.cancelPreOrder);

  app.get('/customer/order',auth.authorization,CustomerController.getUserOrder);
  app.post('/customer/order/create',auth.authorization,CustomerController.insertOrder);
  app.put('/customer/order/paid',auth.authorization,function (req, res, next) {
    uploadOrderTransaction(req, res, function (err) {
      if(err){
        res.status(500).send({ message: err.message });
      }
      next();
    })
  }
  ,CustomerController.updateOrderTransactionImage);
};