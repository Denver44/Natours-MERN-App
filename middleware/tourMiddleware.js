import multer from 'multer';
import sharp from 'sharp';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

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
const resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1. Process Image Cover
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333) // Width and Height set
    .toFormat('jpeg') // Format change to jpeg
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2. Images

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333) // Width and Height set
        .toFormat('jpeg') // Format change to jpeg
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      req.body.images.push(filename);
    })
  );
  // We sue map to save all the promise of the 3 images and then using promise.all we solve the promises and then we move to next middleware.
  // If we don't have use await before promise.all we directly gone to next middleware.

  return next();
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not and image! please upload only images', 404), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export { aliasTopTours, upload, resizeTourImages };
