import User from '../models/userModel.js';
import APIFeatures from '../utils/apiFeature.js';
import catchAsync from '../utils/catchAsync.js';

const getAllUsers = catchAsync(async (req, res) => {
  const userFeatures = new APIFeatures(User.find(), req.query);
  const users = await userFeatures.query;
  res.status(200).json({
    status: 'success',
    result: users.length,
    data: {
      users,
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

export { getAUser, getAllUsers, createAUser, deleteAUser, updateAUser };
