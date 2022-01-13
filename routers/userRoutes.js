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
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);

router.patch('/updateMyPassword', protect, updatePassword);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword); // As we will update the password so we will to update request that's whu we used patch

router.patch('/updateMe', protect, updateMe);

router.route('/').get(getAllUsers).post(createAUser);
router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

export default router;
