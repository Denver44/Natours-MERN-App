import express from 'express';
import {
  getAllReviews,
  createAReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), createAReview); // Only User can create Reviews

export default router;
