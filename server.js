import app from './app.js';
import mongoose from 'mongoose';
const PORT = process.env.NODE_ENV === 'development' ? process.env.PORT : 3000;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then((con) => {
    console.log(con.connection);
    console.log('Remote DB connection successful');
  })
  .catch((e) => console.log(e));

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A Tour Must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: String,
    required: [true, 'A Tour Must have a price'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

app.listen(PORT, () => {
  console.log(`server is started http://localhost:${PORT}`);
});

/*
Basic Way
  name: String
  rating: Number,
  price: Number,

Detailed Way by defining Schema Types Options
 name: {
    type: String,
    required: [true, 'A Tour Must have a name'], // Here if required failed then we will get the error A Tour Must have a name
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5, // This way we can Set Default Value
  },
  price: {
    type: String,
    required: [true, 'A Tour Must have a price'],
  },



  To Create a Model
  const Tour = mongoose.model('Tour', tourSchema);
  1. Make first letter Capital and and in mongoose.model(ModelName, SchemaName)
*/
