import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeature.js';

const getAllTours = async (req, res) => {
  try {
    const tourFeatures = new APIFeatures(Tour.find(), req.query)
      .filter()
      .paginate()
      .limitFields()
      .sort();

    const tours = await tourFeatures.query;
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
    const { id } = req.params;
    const tour = await Tour.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'updated',
      data: {
        tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const deleteATour = async (req, res) => {
  try {
    const { id } = req.params;
    await Tour.findByIdAndDelete(id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

export { createATour, getATour, getAllTours, deleteATour, updateATour };
