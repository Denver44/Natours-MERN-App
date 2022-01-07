import express from 'express';
import { signUp, login } from '../controllers/authController.js';
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

router.route('/').get(getAllUsers).post(createAUser);
router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

export default router;
