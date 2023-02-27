import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const { DATABASE, DATABASE_PASSWORD } = process.env;
    const DB = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);
    await mongoose.connect(DB);
    console.log('Remote DB connection successful');
  } catch (error) {
    console.error(`Error connecting to DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
