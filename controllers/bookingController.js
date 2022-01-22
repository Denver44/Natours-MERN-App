import Stripe from 'stripe';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
import {
  deleteOne,
  createOne,
  updateOne,
  getOne,
  getAll,
} from './handleFactory.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = catchAsync(async (req, res, next) => {
  //  Get Tour from req.params.tourId
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) return next(new AppError('No Tour found', 404));

  // https://stripe.com/docs/payments/accept-a-payment

  //   THis will do api call to stripe
  const session = await stripe.checkout.sessions.create({
    // Remove the payment_method_types parameter
    // to manage payment methods in the Dashboard
    // payment_method_types: ['card'], // https://stripe.com/docs/payments/dashboard-payment-methods
    mode: 'payment',
    // success_url: `${req.protocol}://${req.get('host')}/`,
    success_url: `${req.protocol}://${req.get('host')}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });

  return res.status(200).json({
    status: 'success',
    session,
  });
});

const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  if (!tour || !user || !price) return next(); // Here we got to next middleware which is the / home page of our app in view because we want to show the homepage after booking that;s hwy
  await Booking.create({ tour, user, price });
  return res.redirect(req.originalUrl.split('?')[0]);
});

const createBooking = createOne(Booking);
const getBooking = getOne(Booking);
const getAllBooking = getAll(Booking);
const updateBooking = updateOne(Booking);
const deleteBooking = deleteOne(Booking);

export {
  getCheckoutSession,
  createBookingCheckout,
  createBooking,
  getBooking,
  getAllBooking,
  updateBooking,
  deleteBooking,
};

// When a website is deployed on a server we will get access of the session oject once the purchase is completed using stripe WebHooks

// Webhooks is a perfect for creating saving bookings in db.

// Right now we are doing temp fix which is not at all secure by this anyone can book a tour.
