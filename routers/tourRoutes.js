import express from 'express';
import {
  getATour,
  getAllTours,
  createATour,
  updateATour,
  deleteATour,
  aliasTopTours,
} from '../controllers/tourController.js';

const router = express.Router();
// router.param('id');

router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/').get(getAllTours).post(createATour);
router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour);

export default router;
