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

// .all is for all the http methods like gte, post, delete and etc
// Order must be below so it means our req and res cycle is not finished that means there is no router related to that name so now this middleware will take care of it
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`,
  });
  next();
});

export default app;
