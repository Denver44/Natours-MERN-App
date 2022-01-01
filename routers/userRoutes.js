import express from 'express';
import {
  getAUser,
  getAllUsers,
  createAUser,
  updateAUser,
  deleteAUser,
} from '../controllers/userController.js';

const router = express.Router();

router.route('/').get(getAllUsers).post(createAUser);
router.route('/:id').get(getAUser).patch(updateAUser).delete(deleteAUser);

export default router;
