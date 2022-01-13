/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config();

// We have to handle the uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting Down...');
  process.exit(1);
});

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
  });
// .catch((e) => console.log(e)); // We should handle this rejection Globally

const server = app.listen(PORT, () => {
  console.log(
    `${process.env.NODE_ENV} server is started http://localhost:${PORT}`
  );
});

// No we can handled any  unhandledRejection Globally entire this whole applications
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting Down...');
  server.close(() => process.exit(1));
});
