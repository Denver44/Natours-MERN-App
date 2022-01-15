import express from 'express';
import {
  resetPassword,
  signUp,
  login,
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

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

// All Route are Protected after this
router.use(protect);

router.get('/me', setUserId, getAUser);
router.patch('/updateMyPassword', updatePassword);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

router.use(restrictTo('admin'));

router.route('/').get(getAllUsers).post(createAUser);
router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

export default router;
