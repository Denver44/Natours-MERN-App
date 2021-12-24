import express from 'express';
import morgan from 'morgan';
import { tourRouter, userRouter } from './routers/route.js'
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use((req, res, next) => {
    req.requestedTime = new Date().toISOString();
    next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;


// Here for handling the route handlers we created a folder controllers as they called as controller only so we put all the handle router in that folder
// We create a router folder and all the router is put there.
// Here Server.js is our main file which will be run and start the server.
// app.js is only for getting all the file and folder and then import to server.js and server.js will run and our sever will start.