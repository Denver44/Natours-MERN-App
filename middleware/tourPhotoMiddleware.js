import multer from 'multer';
// eslint-disable-next-line no-unused-vars
import sharp from 'sharp';
import AppError from '../utils/AppError.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images ', 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'imgaes', maxCount: 3 },
]);

const resizeTourPhoto = (req, res, next) => {
  console.log(req.file);
  return next();
};

export { resizeTourPhoto, uploadTourImages };
