/* eslint-disable func-names */
import mongoose from 'mongoose';
import Tour from './tourModel.js';
// Here we have use Parent referencing rather than
// Here both tours & users are in a sense of this data set, because we don't want a huge array in a parent element because there can be many reviews
// So if we don't know how much our array will grow we must using parent referencing

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, ' Review can not be empty!'],
      trim: true,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// CHECK IN FUTURE:
//  Currently not working check it tomorrow

// One use review for One tour to be unique he cannot review more than once for same tour.
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo', // Only name of user and photo should be send for review
  });

  // Here we have turn off the tour populate.
  // this.populate({
  //   path: 'user',
  //   select: 'name photo', // Only name of user and photo should be send for review
  // }).populate({
  //   path: 'tour',
  //   select: 'name', // Only name of tour is needed
  // });
  next();
});

// REVIEW AVERAGE AND COUNT AGGREGATION

// Here we will create a statics methods to calculate the averageRatings and Ratings for the tours.
// Here we have to call aggregate method and in statics method this variable contains aggregate methods.

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 }, // This means if it same id it will add One to sum
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  // To use the calcAverageRatings function we used this.constructor because this points to current model and we have the function in that model.
  this.constructor.calcAverageRatings(this.tour);
});

// findByIdAndUpdate
// findByIdAndDelete

// Toughest Point
// Do it Twice
// Explore more abu the clone().

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this?.findOne()?.clone();
  console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  await this?.r?.constructor?.calcAverageRatings(this?.r?.tour);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

// The Virtual property is used to when we have a virtual property a filed which is not store in a database but calculated using some other value so we want this to show up whenever there is an output
