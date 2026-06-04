const multer = require('multer');

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const profileUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

module.exports = profileUpload;
