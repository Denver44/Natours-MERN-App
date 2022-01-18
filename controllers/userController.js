import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { filterObj } from '../utils/helper.js';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handleFactory.js';

const getAllUsers = getAll(User);
const getAUser = getOne(User);
const createAUser = createOne(User);

// Don't update password with this && This is for updating user detail by Admin
const updateAUser = updateOne(User);

const deleteAUser = deleteOne(User);

// THis is for updating user detail by user
const updateMe = catchAsync(async (req, res, next) => {
  // 1. Create error if user POSTS password Data
  if (req.body.password || req.body.ConfirmPassword) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 2. Update user documents
  const filterBody = filterObj(req.body, 'name', 'email');
  if (req.file) filterBody.photo = req.file.filename;

  // In options we set new true adn runValidators true , new options true means it will return new object as response so that we can send it in response

  // Never update everything filter and Update data otherwise someone will change role and password
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });

  return res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const { password } = req.body;

  if (!password) return next(new AppError('Please provide your password', 400));

  const user = await User.findById(req.user.id).select([
    '+password',
    '+active',
  ]);

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(
      new AppError('Incorrect Credentials, Please enter correct password', 401)
    );

  user.active = false;
  user.save({ validateBeforeSave: false });

  return res.status(204).json({
    status: 'success',
    data: null,
  });
});

export {
  getAUser,
  getAllUsers,
  createAUser,
  deleteAUser,
  updateAUser,
  updateMe,
  deleteMe,
};
