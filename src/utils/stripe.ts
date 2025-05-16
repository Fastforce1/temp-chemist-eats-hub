import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId: string) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        successUrl: import.meta.env.VITE_STRIPE_SUCCESS_URL,
        cancelUrl: import.meta.env.VITE_STRIPE_CANCEL_URL,
      }),
    });

    const { sessionId } = await response.json();
    return sessionId;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}; 