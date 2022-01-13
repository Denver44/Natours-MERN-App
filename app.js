import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
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

// Mongo Sanitize, It will remove all the dollar sign from the req.body so that the query don't work
app.use(mongoSanitize());

// Data Sanitization using XSS Clean
app.use(xss());

// Prevent Parameter Pollution, It will clear up the polluted query string
// using whitelist we can allow the query which we want.
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

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

// hpp means http parameter pollution
// It is used to remove the duplicate params from the query string
// Eg :- /api/v1/tours?sort=duration&sort=price

// Now due to hpp it will take only the last query which is sort One.
