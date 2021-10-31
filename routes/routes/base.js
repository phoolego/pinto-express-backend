const BaseController = require('../../controllers/BaseController');
const auth = require('../../middlewares/auth');
const UploadFile = require('../../services/FileUpload');
module.exports = (app) => {
  app.get(
    '/',
    BaseController.index
  );
  //User
  app.post('/insert-user',BaseController.insertUser);
  app.post('/login-email',BaseController.loginEmail);
  //Product
  app.get('/product-type',auth.authorization, BaseController.getProductType);
  //file upload
  app.post('/upload-test-file', UploadFile.upload.single('image'),(req,res)=>{
    console.log(req.file);
    res.send('file is store');
  });
  app.post('/upload-product-type-file', UploadFile.uploadProductTypePic.single('image'),async (req,res) =>{
    console.log(req.file);
    try{
      let sql =`UPDATE type_of_product
      SET name=?, name_eng=?, picture_of_product=?
      WHERE name = ?;`;
      res.send( await db.pintodb.query(sql,[req.body.name, req.body.nameEng, req.body.productPic, req.body.name]));
    }catch(err){
        throw err.message;
    }
  });
};
