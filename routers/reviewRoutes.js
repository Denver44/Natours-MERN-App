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

const router = express.Router({ mergeParams: true }); // No the params coming from other route is accessible to all the route as we set the mergerParams true.
router.use(protect);

router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setTourUserIds, createAReview);

router
  .route('/:id')
  .get(getAReview)
  .patch(restrictTo('user', 'admin'), updateAReview)
  .delete(restrictTo('user', 'admin'), deleteAReview);

export default router;
