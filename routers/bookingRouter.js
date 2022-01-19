import express from 'express';
import { getCheckoutSession } from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

export default router;
