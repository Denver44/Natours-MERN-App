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

export default protect;

// This is  promisify  from 'util' is inbuilt in node it will create a promise for us. so that we can use it in same structure as we are handling our promises using catchAsync
// jwt.verify give a callback function bu instead of that we use promisify that will gives us promise so we can await function on that and if there is any error we can catch that error using catchAsync
