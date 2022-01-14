import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import { createOne, deleteOne, updateOne } from './handleFactory.js';

const getAllReviews = catchAsync(async (req, res) => {
  let filterObj = {};
  if (req.params.tourId) filterObj = { tour: req.params.tourId };

  const reviews = await Review.find(filterObj);
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

const createAReview = createOne(Review);
const deleteAReview = deleteOne(Review);
const updateAReview = updateOne(Review);

export { getAllReviews, createAReview, deleteAReview, updateAReview };
