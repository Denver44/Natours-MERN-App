import Stripe from 'stripe';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import Tour from '../models/tourModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = catchAsync(async (req, res, next) => {
  //  Get Tour from req.params.toudId
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) return next(new AppError('No Tour found', 404));

  // https://stripe.com/docs/payments/accept-a-payment

  //   THis will do api call to stripe
  const session = await stripe.checkout.sessions.create({
    // Remove the payment_method_types parameter
    // to manage payment methods in the Dashboard
    // payment_method_types: ['card'], // https://stripe.com/docs/payments/dashboard-payment-methods
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
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

// eslint-disable-next-line import/prefer-default-export
export { getCheckoutSession };
