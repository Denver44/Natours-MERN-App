/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51KJaKjSEw2T9HrV8vPjYM8J7eyvLB40hBKz1ZhBMd0Dg4shc3uAckMSsKt8zAzcQEZSyyN1H5YPFCDk3GifoW23N00q4tF1mzR');

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
