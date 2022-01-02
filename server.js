/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

import mongoose from 'mongoose';
import app from './app.js';

const { PORT } = process.env;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  // eslint-disable-next-line no-unused-vars
  .then((con) => {
    console.log('Remote DB connection successful');
  })
  .catch((e) => console.log(e));

app.listen(PORT, () => {
  console.log(
    `${process.env.NODE_ENV} server is started http://localhost:${PORT}`
  );
});
