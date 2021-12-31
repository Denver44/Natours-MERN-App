import express from 'express';
import {
  getATour,
  getAllTours,
  createATour,
  updateATour,
  deleteATour,
  checkBody,
} from '../controllers/tourController.js';

const router = express.Router();
// router.param('id');

router.route('/').get(getAllTours).post(checkBody, createATour);
router.route('/:id').get(getATour).patch(updateATour).delete(deleteATour);

export default router;
