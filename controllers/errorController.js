import AppError from '../utils/AppError.js';

const sendErrorDev = (res, err) =>
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message || '',
    stack: err.stack,
  });

const sendErrorProd = (res, err) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message || '',
    });
  } else {
    /* 1. Log Error */ console.log('ERROR 💥', err);
    /* 2. Send generic message */ res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path} : ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value : /'${err.keyValue.name}'/. Please use another value`;
  return new AppError(message, 400);
};

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(res, err);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    else if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    sendErrorProd(res, error);
  }
};
