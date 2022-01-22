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
import {
  aliasTopTours,
  resizeTourImages,
  upload,
} from '../middleware/tourMiddleware.js';

const router = express.Router();

// IF we have to upload just one image then we have to use single function
// upload.single('imageCover')
// If we have to upload multiple photo for one field then we have to use array function of upload
// upload.array('images',5)

// When there is a mix fro single and multiple filed then we use fields and in that we pass array of object in that we mention the key and maxCOunt of photo.
const uploadTourImages = upload.fields([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 3,
  },
]);

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
  .post(protect, restrictTo('admin', 'lead-guide'), createATour);

router
  .route('/:id')
  .get(getATour)
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    uploadTourImages,
    resizeTourImages,
    updateATour
  )
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteATour);

export default router;
