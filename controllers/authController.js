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

export { signUp, login };
