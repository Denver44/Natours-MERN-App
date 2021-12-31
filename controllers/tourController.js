import Tour from '../models/tourModel.js';

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

export { createATour, getATour, getAllTours, deleteATour, updateATour };

/*

Old Way
const newTour = new Tour(body)
newTour.save()

Easiest Way
const newTour = await Tour.create(body);
Right now we are calling directly create method so it will create and save document for us and it will return a promise
*/
