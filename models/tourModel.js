import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must have a name'],
      unique: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A Tour Must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true, // THis will remove the whitespace from the end and start of the text
      required: [true, 'A tour must have a description'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //  This way we exclude it so no it will be not send as response to client
    },
    startDates: [Date],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// eslint-disable-next-line func-names
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;

// Note:-

// Virtual properties are fields which are  basically fields that we can define in our schema but it will not be persisted so they will not be save in our database.
// Fields like miles to kilometers conversion these can find cane bes said has virtual fields

// durationWeeks We cannot use this virtual property for our query as the are not part of our DB.

// In mongoose schema we can not only define our schema but we can pass the object of schema options
/*
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
*/

// So here we have set that whenever data is send in output in json and object please send the virtuals also.
