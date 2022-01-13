/* eslint-disable no-unused-vars */
import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import { createJWTToken } from '../utils/helper.js';

const signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
    passwordChangeAt: req.body.passwordChangeAt,
    role: req.body.role,
  });

  const token = createJWTToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email & password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  const token = createJWTToken(user._id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});

// eslint-disable-next-line consistent-return
const forgotPassword = catchAsync(async (req, res, next) => {
  // 1.Get user based on POSTed email'

  const user = await User.findOne({ email: req.body.email });

  // Return Error if user Doesn't exist
  if (!user) return next(AppError('There is no user with email address', 404));

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // This will Disable the Validation as we just need to reset Password for that no Validation is Required.

  // 3. Send it ito user email's
});

const resetPassword = catchAsync(async (req, res, next) => {});

export { signUp, login, forgotPassword, resetPassword };

// STEPS For Reset and Forgot Password

// 1. For Forgot Password A user will make a request to forgotPassword route with this email Id.
// So we will send
