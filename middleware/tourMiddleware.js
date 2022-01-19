import multer from 'multer';
import AppError from '../utils/AppError.js';

const aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = '_id,name,price,ratingsAverage,summary,difficulty';
  next();
};

// Store Images in memory
const multerStorage = multer.memoryStorage();

// IMAGE PROCESSING

// Here this time we will get re.files the plural from.
const resizeTourImages = (req, res, next) => {
  console.log('resizeTourImages', req.files);
  return next();
};

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not and image! please upload only images', 404), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export { aliasTopTours, upload, resizeTourImages };
