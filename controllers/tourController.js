/* eslint-disable no-unused-vars */
import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeature.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

const getAllTours = catchAsync(async (req, res, next) => {
  const tourFeatures = new APIFeatures(Tour.find(), req?.query)
    .filter()
    .paginate()
    .limitFields()
    .sort();

  const tours = await tourFeatures.query;
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});

const getATour = catchAsync(async (req, res, next) => {
  const aTour = await Tour.findById(req.params?.id);
  if (!aTour) return next(new AppError('No Tour found with that ID ', 404));
  return res.status(200).json({
    status: 'success',
    data: {
      tour: aTour,
    },
  });
});

const createATour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(201).json({
    status: 'created',
    data: {
      tour: newTour,
    },
  });
});

const updateATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req?.params?.id, req?.body, {
    new: true,
    runValidators: true,
  });
  if (!tour) return next(new AppError('No Tour found with that ID ', 404));
  return res.status(200).json({
    status: 'updated',
    data: {
      tour,
    },
  });
});

const deleteATour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req?.params?.id);
  if (!tour) return next(new AppError('No Tour found with that ID ', 404));
  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        maxPrice: { $max: '$price' },
        minPrice: { $min: '$price' },
      },
    },
    {
      $sort: {
        avgPrice: 1,
      },
    },
    // {
    //   $match: { _id: { $eq: 'DIFFICULT' } },
    // },
  ]);

  res.status(200).json({
    stats: 'success',
    data: {
      stats,
    },
  });
});
const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numToursStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: '$_id',
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        numToursStarts: -1,
      },
    },
    {
      $limit: 12,
    },
  ]);

  res.status(200).json({
    stats: 'success',
    data: {
      monthlyPlan,
    },
  });
});

export {
  createATour,
  getATour,
  getAllTours,
  deleteATour,
  updateATour,
  getTourStats,
  getMonthlyPlan,
};
