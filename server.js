/* eslint-disable import/first */
import dotenv from 'dotenv';

dotenv.config({ silent: !process.argv.includes('silent') }); // Added silent option to suppress errors in prod

// Handle errors from dotenv.config() call
if (dotenv.error) {
  console.error(`Error loading environment variables: ${dotenv.error}`);
  process.exit(1);
}

// We have to handle the uncaught exception
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting Down...');
  process.exit(1);
});

import app from './app.js';
import connectDB from './config/datastore.js';

const { PORT } = process.env;

async function startServer() {
  try {
    await connectDB(); // Wait for database connection before starting server
    const server = app.listen(PORT, () => {
      console.log(
        `${process.env.NODE_ENV} server is started http://localhost:${PORT}`
      );
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.log(err.name, err.message);
      console.log('💥 UNHANDLED REJECTION! 💻 Shutting down...');
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM signals
    process.on('SIGTERM', () => {
      console.log('💥 SIGTERM RECEIVED 💻 Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated');
      });
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
}

startServer();
