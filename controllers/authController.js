/* eslint-disable no-unused-vars */
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import Email from '../utils/email.js';

const createJWTToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, req, res) => {
  const token = createJWTToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000
    ),
    httpOnly: true, // THis will make sure that cookie is not accessed or modified in any way by the browser
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    // In express we have req.secure property and if the connection is secure then only req.secure is set true.

    // This heroku specific
    // The req.secure will not work as in heroku , heroku proxy's is basically redirect or modified all incoming requests so we have to check that x-forwarded-proto is https or not.

    // As in production it si not necessary that all app are secure.
  };

  // if (process.env.NODE_ENV === 'production') {
  //   cookieOptions.secure = true; // It will only send if there is a https connection
  // }

  res.cookie('jwt', token, cookieOptions);

  if (statusCode === 201) {
    // eslint-disable-next-line no-param-reassign
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } else {
    res.status(statusCode).json({
      status: 'success',
      token,
    });
  }
};

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
  const url = `${req.protocol}://${req.get('host')}/me`;
  await new Email(newUser, url).sendWelcome();
  createSendToken(newUser, 201, req, res);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError('Please provide email & password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  return createSendToken(user, 200, req, res);
});

const forgotPassword = catchAsync(async (req, res, next) => {
  // 1.Get user based on POSTed email'

  const user = await User.findOne({ email: req.body.email });

  // Return Error if user Doesn't exist
  if (!user)
    return next(new AppError('There is no user with email address', 404));

  // 2. Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false }); // This will Disable the Validation as we just need to reset Password for that no Validation is Required.

  // 3. Send it ito user email's
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    return res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Please Try again later!',
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  // 1 Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2 If the token is not expired, and there is user, set the new password
  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  // 3 Update changePasswordAt property for the user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save(); // THis time we want to validate conform password and password are same

  // 4 Log in the user in , Send JWT
  return createSendToken(user, 200, req, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  // console.log('REQ FOR PASS ', req.user);
  // Get user from collection
  const user = await User.findById(req.user.id).select('+password');
  // console.log('user ', user);

  // Check if posted current password is correct

  if (
    !(await user.correctPassword(
      req.body.passwordCurrent || req.body.currentPassword,
      user.password
    ))
  ) {
    // console.log('FROM INNER');
    return next(new AppError('Your current password is wrong ', 401));
  }

  // If so, update Password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // Log user in, send JWT
  return createSendToken(user, 200, req, res);
});

const logOut = (req, res) => {
  // Dummy cookie created
  res.cookie('jwt', 'loggedOut', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: 'success',
  });
};

export { signUp, login, logOut, forgotPassword, resetPassword, updatePassword };
