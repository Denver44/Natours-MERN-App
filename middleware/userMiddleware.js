import multer from 'multer';
import AppError from '../utils/AppError.js';

const setUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Here we configured the storage path for our photo
const multerStorage = multer.diskStorage({
  // Here cb (callback) it is same as next but not express next, we can send error and things which we do in our next of express.
  destination: (req, file, cb) => {
    cb(null, 'public/img/users');
  },

  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    const fileName = `user-${req.user.id}-${Date.now()}.${ext}`;

    cb(null, fileName);
  },
});

// Here we configure a filter which will check that data or the file is a image type or not.
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not and image! please upload only images', 404), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export { setUserId, upload };
