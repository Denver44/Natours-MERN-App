import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req?.params?.id);
    if (!doc) return next(new AppError('No document found with that ID ', 404));
    return res.status(204).json({
      status: 'success',
      data: null,
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res) => {
    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'created',
      data: {
        data: newDoc,
      },
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req?.params?.id, req?.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) return next(new AppError('No document found with that ID ', 404));

    return res.status(200).json({
      status: 'updated',
      data: {
        data: doc,
      },
    });
  });

export { deleteOne, createOne, updateOne };
