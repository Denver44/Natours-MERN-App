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

import AppError from './utils/AppError.js';
import {
  tourRouter,
  userRouter,
  reviewRouter,
  viewRouter,
  bookingRouter,
} from './routers/route.js';
import GlobalErrorHandling from './controllers/errorController.js';
import { webHookCheckout } from './controllers/bookingController.js';

const app = express();
const __dirname = path.resolve(path.dirname(''));

// Implement CORS
app.use(cors());
// Access-Control-Allow-Origin *

// If we want to allow request for cross origin for a specific point like
// API : natours.api.com   WEBAPP : natours.com
// Then we can do this so only this URL https://www.natours.com is able to make request to our api.
// app.use(
//   cors({
//     origin: 'https://www.natours.com',
//   })
// );

// Allow all
app.options('*', cors());

// Here we can allow request for only specific URL, like for this URL option request for delete, put is allow. that means u can delete or update data for this route only
// app.options('/api/v1/tours/:id', cors());

// To trust proxy we have to enable this and heroku work as proxy
app.enable('trust proxy');

//  Serving Static files
app.use(express.static(path.join(__dirname, 'public'))); // Now we don't need to put the slashes and to view the pages in public folder : http://localhost:PORT/fileName.ext => http://localhost:PORT/index.html

// Setting the Template Engine

app.set('view engine', 'pug'); // Here we have set the template engine is pug so we don't need to put the extension when we render the templates, that's the benefit of setting template.
app.set('views', path.join(__dirname, 'views')); // We have set the path of views folder.

// 1. GLOBAL  MIDDLEWARE

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

// Development Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Change the value according to your website requirement

// Limit the number of Request
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, // 100 Request is allowed for One IP in one Hour
  message: 'Too many request from this IP, please try again in an hour!',
});

// This limiter will only affect the route with /api and we can set different limiter for different route
app.use('/api', limiter);

// We need Raw data for web hooks to work
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webHookCheckout
);

// Body parser reading data from body into req.body
app.use(express.json({ limit: '10kb' })); /// Parse data from req.body and the limit is set to 10KB.

app.use(express.urlencoded({ extended: true, limit: '10kb' })); // Here we use this because we want to parse data coming from, form which encoded and that is also known as urlencoded

app.use(cookieParser()); // This will parse the data from cookie

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

// This is compression it will compress all the text and json
app.use(compression());

// Test Middleware
app.use((req, res, next) => {
  req.requestedTime = new Date().toISOString();
  // console.log('Cookie ', req?.cookies);
  next();
});

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

// For serving static files in public folder => http://localhost:5000/ + fileName

// IMPORTANT NOTE:-

// app.use(cors()) this will only work for simple request like get,post

// non-simple request like put,patch, delete or request which send cookies or non-standard headers we have to configure cors for that.

// The non-simple request require pre-flight phase.
// Like whenever we do no simple request like delete request so the browser will send first options request to check it is safe or not, that means for developer we need to respond that options request and options is just a http method like get, post.
// So basically whenever we get a options request we have to send back the same access allow origin header, so this way browser will know that the actual request in case here delete request is safe to perform.
