import express from 'express';
import {
  resetPassword,
  signUp,
  login,
  forgotPassword,
} from '../controllers/authController.js';
import {
  getAUser,
  getAllUsers,
  createAUser,
  updateAUser,
  deleteAUser,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.post('/resetPassword', resetPassword);

router.route('/').get(getAllUsers).post(createAUser);
router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

export default router;
