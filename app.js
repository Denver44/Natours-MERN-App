import path from 'path';
import express from 'express';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

import {
  tourRouter,
  userRouter,
  reviewRouter,
  viewRouter,
  bookingRouter,
} from './routers/route.js';
import AppError from './utils/AppError.js';
import GlobalErrorHandling from './controllers/errorController.js';
import { webHookCheckout } from './controllers/bookingController.js';

const app = express();
const __dirname = path.resolve(path.dirname(''));

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Implement CORS
app.use(cors()); // Any domain can access our app
app.options('*', cors()); // Enable pre-flight requests for all routes using CORS.
app.enable('trust proxy'); // To trust proxy, we have to enable this as heroku work as proxy

//  Serving Static files
app.use(express.static(path.join(__dirname, 'public'))); // The "public" directory accessible to the client via the server URL.

// Setting the Template Engine

app.set('view engine', 'pug'); // Template engine set to pug.
app.set('views', path.join(__dirname, 'views')); // views path set.

// Set Security http Headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https:', 'http:', 'data:', 'ws:'],
      baseUri: ["'self'"],
      fontSrc: ["'self'", 'https:', 'http:', 'data:'],
      scriptSrc: ["'self'", 'https:', 'http:', 'blob:'],
      styleSrc: ["'self'", 'https:', 'http:', 'unsafe-inline'],
    },
  })
);

// Limit the number of Request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 Request is allowed for One IP in one Hour
  message: 'Too many request from this IP, please try again in an hour!',
});

app.use('/api', limiter); // This limiter will only affect the /api route.

// We need Raw data for web hooks to work
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webHookCheckout
);

// STRIPE DEVELOPMENT TESTING
// app.post('/', express.raw({ type: 'application/json' }), webHookCheckout);

app.use(express.json({ limit: '10kb' })); // Parse data from req.body and the limit is set to 10KB.
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Here we use this because we want to parse data coming from the form which is encoded.
app.use(cookieParser()); // This will parse the data from cookie
app.use(mongoSanitize()); // Remove all the dollar sign from the req.body, to prevent NoSQL Injection
app.use(xss()); // Data Sanitization using XSS Clean

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

app.use(compression()); // It will compress all the text and json

// Rendering template file
app.use('/', viewRouter);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// Global Error Handling middleware
app.use(GlobalErrorHandling);

export default app;
