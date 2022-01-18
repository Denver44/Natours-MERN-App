import express from 'express';
import multer from 'multer';
import {
  resetPassword,
  signUp,
  login,
  logOut,
  forgotPassword,
  updatePassword,
} from '../controllers/authController.js';

import {
  getAUser,
  getAllUsers,
  createAUser,
  updateAUser,
  deleteAUser,
  updateMe,
  deleteMe,
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { setUserId } from '../middleware/userMiddleware.js';

// we have to define the destination where we want to save our image.
const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logOut);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// All Route are Protected after this
router.use(protect);

router.get('/me', setUserId, getAUser);
router.patch('/updateMyPassword', updatePassword);

// Here we have to upload single image that's why we use single function and in that we have to pass the field Name which have the file
// in our request we will get one field file in there all the detail of image will be there (req.file)
router.patch('/updateMe', upload.single('photo'), updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createAUser);
router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

export default router;
