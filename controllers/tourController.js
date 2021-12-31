import Tour from '../models/tourModel.js';

const findItem = (tours, val) => tours.find((el) => el.id === val * 1);

const checkBody = (req, res, next, val) => {
  const { body } = req;
  if (!body.name || !body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'name or price property missing',
    });
  }
  next();
};

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedTime: req.requestedTime,
    // result: tours.length,
    // data: {
    //   tours,
    // },
  });
};
const getATour = (req, res) => {
  const { id } = req.params;
  //   res.status(200).json({
  //     status: 'success',
  //     data: {
  //       tour: findItem(id),
  //     },
  //   });
};

const createATour = (req, res) => {
  const { body } = req;
  res.status(201).json({
    status: 'created',
    // data: {
    //   tour,
    // },
  });
};
const updateATour = (req, res) => {
  const { body } = req;
  const id = req.params.id;

  res.status(200).json({
    status: 'updated',
    // data: {
    //   tour: updatedTour,
    // },
  });
};
const deleteATour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export {
  createATour,
  getATour,
  getAllTours,
  deleteATour,
  updateATour,
  checkBody,
};
