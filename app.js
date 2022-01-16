import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

import AppError from './utils/AppError.js';
import { tourRouter, userRouter, reviewRouter } from './routers/route.js';
import GlobalErrorHandling from './controllers/errorController.js';

const app = express();
const __dirname = path.resolve(path.dirname(''));

//  Serving Static files
app.use(express.static(path.join(__dirname, 'public'))); // Now we don't need to put the slashes and to view the pages in public folder : http://localhost:PORT/fileName.ext => http://localhost:PORT/index.html
// app.use(express.static(`${__dirname}/public`));

// Setting the Template Engine
app.set('view engine', 'pug'); // Here we have set the template engine is pug so we don't need to put the extension when we render the templates, that's the benefit of setting template.
app.set('views', path.join(__dirname, 'views')); // We have set the path of views folder.

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

// This limiter will only affect the route with /api and we can set different limiter for different route
app.use('/api', limiter);

// Body parser reading data from body into req.body, Here we have limited the body data to 10KB
app.use(express.json({ limit: '10kb' }));

// Mongo Sanitize, It will remove all the dollar sign from the req.body so that the query don't work
app.use(mongoSanitize());

// Data Sanitization using XSS Clean
app.use(xss());

// Prevent Parameter Pollution, It will clear up the polluted query string & using whitelist we can allow the query which we want.
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

// Test Middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  next();
});

// Rendering template file

// http://localhost:5000/
app.get('/', (req, res) => {
  res.status(200).render('base', {
    title: 'Exciting tours for adventurous people',
    user: 'Denver',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The forest Hiker Tour',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling middleware
app.use(GlobalErrorHandling);

export default app;

// For serving static files in public folder
// http://localhost:5000/ + fileName
