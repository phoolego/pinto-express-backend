const multer = require('multer');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, '../storage/images/test/');
  },
  filename: function(req, file, cb) {
    cb(null,req.body.name+'.'+file.mimetype.split('/')[1]);
  }
})

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
  } else {
      cb(null, false);
  }
}
module.exports = {
    upload: multer({
        storage: storage,
        limits: {
          fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    }),
    uploadProductTypePic: multer({
      storage: multer.diskStorage({
        destination: function(req, file, cb) {
          cb(null, '../storage/images/product_type/');
        },
        filename: function(req, file, cb) {
          cb(null,req.body.nameEng.replace(/ /g,'_')+'.'+file.mimetype.split('/')[1]);
        }
      }),
      limits: {
        fileSize: 1024 * 1024 * 5
      },
      fileFilter: fileFilter
  }),
}