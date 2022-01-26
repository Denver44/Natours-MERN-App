/* eslint-disable no-unused-vars */
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/userModel.js';
import Booking from '../models/bookingModel.js';

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
  if (!tour) return next(new AppError('There is no tour with that name', 404));

  return res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

const getLoginForm = (req, res) =>
  res.status(200).render('login', {
    title: `Login into your account`,
  });

const getSignUpForm = (req, res) =>
  res.status(200).render('signup', {
    title: `Create your account`,
  });

const getAccount = (req, res) =>
  res.status(200).render('account', {
    title: `Your account`,
  });

const updateUserData = catchAsync(async (req, res, next) => {
  const updateUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: `Your account`,
    user: updateUser,
  });
});

const getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourId = bookings.map((tour) => tour.tour._id);
  const tours = await Tour.find({ _id: { $in: tourId } }); // As it is array and we have to find all the tour which are in the tourId so we have to sue $in operator.

  res.status(200).render('overview', {
    title: 'My tours',
    tours,
  });
});

export {
  getTour,
  getOverview,
  getLoginForm,
  getAccount,
  updateUserData,
  getMyTours,
  getSignUpForm,
};
