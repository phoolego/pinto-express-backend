const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const dir = process.env.STORAGE_PATH+'/images/test/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, {
        recursive: true
      });
    }
    cb(null, dir);
  },
  filename: function(req, file, cb) {
    cb(null,req.body.name.replace(/ /g,'_')+'.'+file.mimetype.split('/')[1]);
  }
})

const imageFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('invalid file type'), false);
  }
}
module.exports = {
  upload: multer({
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 5
      },
      fileFilter: imageFilter
  }),
  uploadProductTypePic: multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        const dir = process.env.STORAGE_PATH+'/images/product_type/';
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          });
        }
        cb(null, dir);
      },
      filename: function(req, file, cb) {
        cb(null,req.body.nameEng.replace(/ /g,'_')+'.'+file.mimetype.split('/')[1]);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter
  }),
  uploadProductPic: multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        const dir = process.env.STORAGE_PATH+'/images/product/';
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          });
        }
        cb(null, dir);
      },
      filename: function(req, file, cb) {
        cb(null,req.body.productId+'.'+file.mimetype.split('/')[1]);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter
  }),
  uploadFarmerTransaction: multer({
    storage: multer.diskStorage({
      destination: function(req, file, cb) {
        const dir = process.env.STORAGE_PATH+'/images/farmerTransaction/';
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, {
            recursive: true
          });
        }
        cb(null, dir);
      },
      filename: function(req, file, cb) {
        cb(null,'ft'+req.body.sspId+'.'+file.mimetype.split('/')[1]);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: imageFilter
  }),
  getFilePath(filePath){
    return filePath.replace(/\\/g,'/').replace(process.env.STORAGE_PATH,'');
  },
}