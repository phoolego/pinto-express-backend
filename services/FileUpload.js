const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, process.env.STORAGE_PATH+'/images/test/');
  },
  filename: function(req, file, cb) {
    cb(null,req.body.name.replace(/ /g,'_')+'.'+file.mimetype.split('/')[1]);
  }
})

const imageFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
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
          cb(null, process.env.STORAGE_PATH+'/images/product_type/');
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
  getFilePath(filePath){
    return filePath.replace(/\\/g,'/').replace(process.env.STORAGE_PATH,'');
  },
}