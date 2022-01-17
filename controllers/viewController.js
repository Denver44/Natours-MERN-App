/* eslint-disable no-unused-vars */
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const getOverview = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3) Render that template using tour data from 1)
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catchAsync(async (req, res, next) => {
  // 1) Get Tour data from collection
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user',
  });

  // 2) Build template
  // 3) Render that template using tour data from 1)
  if (!tour) return new AppError('No such tour is available', 404);

  return res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

export { getTour, getOverview };
