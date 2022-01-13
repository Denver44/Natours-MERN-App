import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { tourRouter, userRouter } from './routers/route.js';
import AppError from './utils/AppError.js';
import GlobalErrorHandling from './controllers/errorController.js';

const app = express();
const __dirname = path.resolve(path.dirname(''));

// 1. GLOBAL  MIDDLEWARE

// Set Security http Headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Adapt this upon your website requirement

// Limit the number of Request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 Request is allowed for One IP in one Hour
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter); // This limiter will only affect the route with /api

// Body parser reading data from body into req.body, Here we have limited the body data to 10KB
app.use(express.json({ limit: '10kb' }));
//  Serving Static files

app.use(express.static(`${__dirname}/public`));

// Test Middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling middleware
app.use(GlobalErrorHandling);

export default app;
