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

const testTour = new Tour({
  name: 'Mountain Hiker Blaster',
  price: 497,
});

testTour
  .save()
  .then((doc) => console.log(doc))
  .catch((e) => console.log(e.message));

app.listen(PORT, () => {
  console.log(`server is started http://localhost:${PORT}`);
});

/*
const testTour = new Tour({
  name: 'Forest hiker',
  rating: 4.7,
  price: 497,
});

1. This is a new document which we created from our tour model.
2. It is same like Classes and Object in JS we create object from class constructor, here also not exactly same but the analogy will help us to related and understand .

*/
