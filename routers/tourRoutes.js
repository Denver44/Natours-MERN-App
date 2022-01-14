import express from 'express';
import {
  getATour,
  getAllTours,
  createATour,
  updateATour,
  deleteATour,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import reviewRouter from './reviewRoutes.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { aliasTopTours } from '../middleware/tourMiddleware.js';

const router = express.Router();
// router.param('id');

// POST /tour/234faad4/reviews
// GET /tour/234faad4/reviews
// GET /tour/234faad4/reviews/94887fda
// Here we used merge params and any req with /tour/tourId/reviews will be re directed to review router
router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(createATour);
router
  .route('/:id')
  .get(getATour)
  .patch(updateATour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createAReview);

export default router;
