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

router.get('/me', protect, setUserId, getAUser);
router.post('/signup', signUp);
router.post('/login', login);

router.patch('/updateMyPassword', protect, updatePassword);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword); // As we will update the password so we will to update request that's whu we used patch

router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/').get(getAllUsers).post(createAUser);
router
  .route('/:id')
  .get(getAUser)
  .patch(updateAUser)
  .delete(protect, restrictTo('admin'), deleteAUser);

export default router;
