/* eslint-disable object-shorthand */
/* eslint-disable func-names */
/* eslint-disable no-undef */
import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A Tour Must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can be either easy, medium or validator',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A Tour Must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price; // This will not work for update only works for creating a document
        },
        message: ' Discount price ({VALUE}) should be below regular price',
      },
    },
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

    // Here we can remove the startLocation and make location[0].Day As start default location

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point', // But we can make Polygon, Line any one default, As it start location so it will be apoint only
        enum: ['Point'],
      },
      coordinates: [Number], // That we except an Array of Numbers first longitude and then latitude
      address: String,
      description: String,
    },

    // Here the locations is an array of object and that's how we create a embedded documents in Mongoose Schema
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes

// tourSchema.index({ price: 1 }); // Single Index
tourSchema.index({ price: 1, ratingsAverage: -1 }); // Compound Index
tourSchema.index({ slug: 1 }); // Compound Index

// Virtual field

// eslint-disable-next-line func-names
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate and doing Parent referencing
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.post('save', (doc, next) => {
//   console.log('doc ', doc);
//   next();
// });

//  QUERY  MIDDLEWARE

//  So now for all find Query this function will get trigger
tourSchema.pre(/^find/, function (next) {
  // Here this is here a query Object
  this.find({ secretTour: { $ne: true } });
  this.select('-secretTour');
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  // this always points to current Query
  this.populate({
    path: 'guides',
    select: ['-__v', '-passwordChangedAt'],
  });
  next();
});

tourSchema.post(/^find/, function (doc, next) {
  // in doc We actually get the document for the pre and post hooks
  // console.log(doc);
  console.log(`Total time it take to do query ${Date.now() - this.start} ms`);
  next();
});

//  AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  // Here in this function this is our aggregation framework
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
export default Tour;
