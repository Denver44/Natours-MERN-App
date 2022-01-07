import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';

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

  // 3. Check if user still exists

  // 4. Check if user changed password after the token was issued

  return next();
});

export default protect;
