import Tour from '../models/tourModel.js';

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(200).json({
      status: 'success',
      result: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
const getATour = async (req, res) => {
  try {
    const { id } = req.params;
    const aTour = await Tour.findById(id);
    // const aTour = await Tour.findOne({ _id: id });

    res.status(200).json({
      status: 'success',
      data: {
        tour: aTour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

const createATour = async (req, res) => {
  try {
    const { body } = req;
    const newTour = await Tour.create(body);

    res.status(201).json({
      status: 'created',
      data: {
        tour: newTour,
      },
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data sent',
    });
  }
};

const updateATour = async (req, res) => {
  try {
    const { body } = req;
    const id = req.params.id;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true, // It will return the new update data
      runValidators: true, // It will run the validators on the body
    });

    res.status(200).json({
      status: 'updated',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    });
  }
};
const deleteATour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

export { createATour, getATour, getAllTours, deleteATour, updateATour };
