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
import { aliasTopTours } from '../middleware/tourMiddleware.js';

const router = express.Router();
// router.param('id');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createATour);
router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour);

export default router;
