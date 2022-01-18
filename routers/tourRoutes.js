import express from 'express';
import {
  getATour,
  getAllTours,
  createATour,
  updateATour,
  deleteATour,
  getTourStats,
  getMonthlyPlan,
  getToursWithIn,
  getDistances,
} from '../controllers/tourController.js';
import reviewRouter from './reviewRoutes.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { aliasTopTours } from '../middleware/tourMiddleware.js';
import {
  resizeTourPhoto,
  uploadTourImages,
} from '../middleware/tourPhotoMiddleware.js';

const router = express.Router();
// router.param('id');

router.use('/:tourId/reviews', reviewRouter);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan);

// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi (This looks more appropriate)
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithIn);

// This route will give all the route in certain distances
router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourPhoto,
    createATour
  );

router
  .route('/:id')
  .get(getATour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateATour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

export default router;
