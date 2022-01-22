import express from 'express';
import {
  createBooking,
  deleteBooking,
  getAllBooking,
  getBooking,
  getCheckoutSession,
  updateBooking,
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo('admin', 'lead-guide')); // Only admin and lead-guide can create, update delete and get details of booking not for user.
router.route('/').get(getAllBooking).post(createBooking);
router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
