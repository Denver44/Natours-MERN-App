import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import { filterObj } from '../utils/helper.js';

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
    },
  });
});

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

const createAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route for this endpoint is not defined yet',
  });
};
const getAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route for this endpoint is not defined yet',
  });
};

// THis is for updating user detail by Admin
const updateAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route for this endpoint is not defined yet',
  });
};
const deleteAUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'route for this endpoint is not defined yet',
  });
};

export {
  getAUser,
  getAllUsers,
  createAUser,
  deleteAUser,
  updateAUser,
  updateMe,
};
