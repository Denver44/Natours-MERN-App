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
  } else if (req.cookies.jwt) {
    // Here no we can authorize via cookie also not only authorizations headers.
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please login in to get access ', 401)
    );
  }
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does not longer exist ',
        401
      )
    );
  }

  // 4. Check if user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently change password! Please login again ', 401)
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE

  req.user = currentUser;
  res.locals.user = currentUser;
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

// This middleware is only for checking that user is logged in or not for frontend
// If yes then in response we have set a locals variables in that we will set the user details in that.
// If not logged in no locals variables will be there
// if no one of next middleware called in if condition then only we locals variables else we don't have as next will call th next middleware directly.
const checkLoggedIn = async (req, res, next) => {
  if (req.cookies.jwt) {
    try {
      const decoded = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET
      );

      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      if (currentUser.changePasswordAfter(decoded.iat)) return next();

      // In our template we will get the access of locals there in res
      res.locals.user = currentUser;
      return next();
    } catch (error) {
      return next();
    }
  }

  return next();
  // No cookie then we will not put the LoggedUser Details in locals so no  user detail will be shown up
};

export { restrictTo, protect, checkLoggedIn };
