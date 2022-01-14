import express from 'express';
import {
  getAllReviews,
  createAReview,
  deleteAReview,
  updateAReview,
  getAReview,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { setTourUserIds } from '../middleware/reviewMiddleware.js';

// No the params coming from other route is accessible to all the route as we set the mergerParams true.
const router = express.Router({ mergeParams: true });

// POST /tour/234faad4/reviews
// GET /tour/234faad4/reviews
// GET /tour/234faad4/reviews/94887fda

router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createAReview); // Only User can create Reviews

router
  .route('/:id')
  .get(protect, getAReview)
  .patch(protect, updateAReview)
  .delete(protect, deleteAReview);

export default router;
