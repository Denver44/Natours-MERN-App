import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/userModel.js';

const protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login in to get access ', 401)
    );
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exist ',
        401
      )
    );
  }

  // 4. Check if user changed password after the token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently change password! Please login again ', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  return next();
});

const restrictTo =
  (...roles) =>
  (req, res, next) => {
    // FIX this Security issue
    // req.user is coming from auth middleware so using that we can know which user is performing what;
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(' You do not have permission to perform this action', 403)
      );
    }
    return next();
  };

export { restrictTo, protect };
