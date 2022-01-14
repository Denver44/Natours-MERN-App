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

// eslint-disable-next-line import/prefer-default-export
export { deleteOne };
