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

router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createATour);

router
  .route('/:id')
  .get(getATour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateATour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

export default router;
