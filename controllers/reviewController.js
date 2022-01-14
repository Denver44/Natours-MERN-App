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
  // Here we add User who is currently logged in as a reviewer and the tour which he/she selected for writing review.

  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;

  const newReview = await Review.create(req.body);
  res.status(201).json({
    status: 'created',
    data: {
      tour: newReview,
    },
  });
});

export { getAllReviews, createAReview };
