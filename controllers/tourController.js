/* eslint-disable no-unused-vars */
import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeature.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { createOne, deleteOne, updateOne } from './handleFactory.js';

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
  const aTour = await Tour.findById(req.params?.id).populate('reviews');

  if (!aTour) return next(new AppError('No Tour found with that ID ', 404));
  return res.status(200).json({
    status: 'success',
    data: {
      tour: aTour,
    },
  });
});

const createATour = createOne(Tour);
const updateATour = updateOne(Tour);
const deleteATour = deleteOne(Tour);

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
