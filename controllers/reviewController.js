import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';

const getAllReviews = catchAsync(async (req, res) => {
  const reviews = await Review.find();
  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

const createAReview = catchAsync(async (req, res) => {
  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'created',
    data: {
      tour: newReview,
    },
  });
});

export { getAllReviews, createAReview };
