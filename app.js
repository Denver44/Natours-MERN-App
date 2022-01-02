import path from 'path';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { tourRouter, userRouter } from './routers/route.js';

dotenv.config();

const app = express();
const __dirname = path.resolve(path.dirname(''));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });
  const err = new Error(`Can't find ${req.originalUrl} on this server`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

// Global Error Handling middleware
// Express will automatically identify this error handling middleware  by justing see its function definition

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message || '',
  });
});

export default app;

// NOTE
//  So whenever we pass anything in next() express will think that it is an error no matter what it is
