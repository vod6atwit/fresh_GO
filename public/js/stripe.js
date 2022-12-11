/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const buyProduct = async (productId) => {
  try {
    // public key
    const stripe = Stripe(
      'pk_test_51LYFzpHfwLOevx7wY5FQBpYiy8dcvqE76BKnrIxv9ZrnDHMbPuDTuo0BH7HsEPN5HGgorYaoHiMAYFT5MciOwge800CZMh7RRB'
    );
    // get checkout session from API - orderController
    const session = await axios(
      // `http://127.0.0.1:8000/api/v1/orders/checkout-session/${productId}`
      `api/v1/orders/checkout-session/${productId}`
    );
    console.log(session);

    //create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
