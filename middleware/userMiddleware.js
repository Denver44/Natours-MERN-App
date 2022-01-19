import multer from 'multer';
import sharp from 'sharp';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const setUserId = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Saving the image in our buffer so that we can resize it easily.
const multerStorage = multer.memoryStorage();

// IMAGE PROCESSING

// This is express middleware
const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // if no file then go to next middleware

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; // as we want filename because using this key we actually save the file in db check in updateMe Controller.

  await sharp(req.file.buffer)
    .resize(500, 500) // Width and Height set
    .toFormat('jpeg') // Format change to jpeg
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  return next();
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

export { setUserId, upload, resizeUserPhoto };
