import Stripe from 'stripe';
import { Request, Response } from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId, successUrl, cancelUrl } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: cancelUrl,
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id as string);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);

    res.json({
      id: session.id,
      amount: paymentIntent.amount,
      status: paymentIntent.status,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}; 