import multer from 'multer';
import sharp from 'sharp';
import AppError from '../utils/AppError.js';

// For resizing image we will store the image in buffer and after resizing it we will store in disk
// const multerStorage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'public/img/users'); // Destination Path
//   },
// Here we are setting the fileName fro our Images
//   filename(req, file, cb) {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // FileName should be like user-userId-timestamp.ext.
// });
//   },

const multerStorage = multer.memoryStorage(); // The file will be save in buffer now.

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true); // To accept the file pass `true`, like so:
  } else {
    cb(new AppError('Not an image! Please upload only images ', 400), false);
  }
};

const resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`; // We want filename key in our object and it will not created by default as now we are storing image in memory by multer so thats why we create this key.

  const destination = `public/img/users/${req.file.filename}.jpeg`; // THis is the destination of the folder. and now sharp will save the image for us in the folder.

  sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').toFile(destination);
  // Here we choose the file from buffer then resize it image then convert jpeg format and then save to it is destination.
  return next();
};

// const upload = multer({ dest: '/public/img/users' }); // If we don't specify the dest then it will store the images in memory but we want to store image in our disk.

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

export { resizeUserPhoto, upload };
