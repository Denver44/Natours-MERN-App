const sendErrorDev = (res, err) =>
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    error: err,
    message: err.message || '',
    stack: err.stack,
  });

const sendErrorProd = (res, err) => {
  // Operational error which we trust
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message || '',
    });
  } else {
    // Programming or Unknown error which we don't leak to our clients

    // 1. Log Error
    console.log('ERROR 💥', err);

    // 2. Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

// eslint-disable-next-line no-unused-vars
export default (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') sendErrorDev(res, err);
  else if (process.env.NODE_ENV === 'production') sendErrorProd(res, err);
};
