import Review from '../models/reviewModel.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handleFactory.js';

const getAllReviews = getAll(Review);
const getAReview = getOne(Review);
const createAReview = createOne(Review);
const deleteAReview = deleteOne(Review);
const updateAReview = updateOne(Review);

export {
  getAllReviews,
  createAReview,
  deleteAReview,
  updateAReview,
  getAReview,
};
