import mongoose from 'mongoose';

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

const Review = mongoose.model('Review', reviewSchema);

export default Review;

// The Virtual property is used to when we have a virtual property a filed which is not store in a database but calculated using some other value so we want this to show up whenever there is an output
