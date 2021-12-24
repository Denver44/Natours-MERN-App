import express from 'express';
import morgan from 'morgan';
import path from "path";
import { tourRouter, userRouter } from './routers/route.js'
const app = express();

const __dirname = path.resolve(path.dirname(''));

app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;


// To serve a static files we have to use express.static() middle ware where we have to pass the path of the folder which we want to server static after than we can serve the files of that folder