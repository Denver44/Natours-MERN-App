import express from 'express';
import { createBookingCheckout } from '../controllers/bookingController.js';
import {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
  getMyTours,
} from '../controllers/viewController.js';
import { checkLoggedIn, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// We pu this checkLoggedIn in all the route

router.get('/', createBookingCheckout, checkLoggedIn, getOverview);
router.get('/tour/:slug', checkLoggedIn, getTour); // Adding slug like is using (:) is called URL Parameters
router.get('/login', checkLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

export default router;
