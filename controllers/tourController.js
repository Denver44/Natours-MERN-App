import Tour from '../models/tourModel.js';

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query }; // Making a Deep copy here we take out all fields and create a new object and then assign to queryObj
    const excludedFields = ['page', 'sort', 'fields', 'limit'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Building Query
    const tourQuery = Tour.find(queryObj);

    // Executing Query
    const tours = await tourQuery;
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

/*

1st way of doing query, but this method is more feasible
Tour.find({duration : 5 , difficult : easy});

2nd Way of doing query

Tour.find().where("duration").equals(5).where("difficult").equals(easy)
Tour.find().where("duration").gte(5).where("difficult").equals(easy).price.lte(500)
Tour.find().where("duration").sort(1)
Tour.find().where("duration").sort(-1)

*/
