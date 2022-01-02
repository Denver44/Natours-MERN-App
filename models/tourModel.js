import mongoose from 'mongoose';
// import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
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

// Virtual field

// eslint-disable-next-line func-names
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// PRE Document Middleware its only works for .save() and .create()

// eslint-disable-next-line func-names
// tourSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// POST Document Middleware its only works for Save and Create

// eslint-disable-next-line func-names
// tourSchema.post('save', (doc, next) => {
//   console.log('doc ', doc);
//   next();
// });

// PRE Query Middleware

//  So now for all find Query this function will get trigger
// eslint-disable-next-line func-names
tourSchema.pre(/^find/, function (next) {
  // Here this is here a query Object
  this.find({ secretTour: { $ne: true } });
  this.select('-secretTour');
  this.start = Date.now();
  next();
});

// eslint-disable-next-line func-names
tourSchema.post(/^find/, function (doc, next) {
  console.log(`Total time it take to do query ${Date.now() - this.start} ms`);
  console.log('doc ', doc);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;

// Note:-

// Mongoose middleware
// 1. Document
// 2. Query
// Just like in express we have middleware same we have middleware for mongoose that we can use before a data got through a model or after going to model pre and post and same for query middleware so.

// We have PRE and POST Middleware we can call them hook also.
