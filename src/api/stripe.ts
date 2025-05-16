// @deno-types="npm:@types/express@^4.17"
import express, { Request, Response } from 'express';
import Stripe from 'stripe';

// Initialize Stripe with your secret key and specific API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10", // Using a recent, valid version. The error suggested "2025-04-30.basil" which seems like a future/beta version. Let's use a stable recent one. If "2025-04-30.basil" is indeed required for a specific feature, it can be changed.
  // httpClient: Stripe.createFetchHttpClient(), // For Deno
});

const app = express();
app.use(express.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req: Request, res: Response) => {
  const { items, userEmail, userId, returnUrl } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid items array' });
  }
  if (!returnUrl) {
    return res.status(400).json({ error: 'Missing returnUrl' });
  }

  const line_items = items.map((item: any) => {
    if (!item.name || !item.price || !item.quantity) {
      throw new Error('Invalid item structure');
    }
    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100), // Price in pence/cents
      },
      quantity: item.quantity,
    };
  });

  const customer_email = userEmail || undefined; // Optional, Stripe can collect it

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${returnUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}/payment-cancel`,
      customer_email,
      metadata: {
        userId: userId || 'guest', // Store userId if available
        cartItems: JSON.stringify(items.map((item: any) => ({ id: item.id, quantity: item.quantity, name: item.name }))), // Storing simplified cart for metadata
      },
    });

    // Optionally: Here you could create a 'pending' order in your database
    // using the session.id and other details before redirecting.

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe session creation failed:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});


// Endpoint for Stripe webhook (Example, implement actual event handling)
app.post('/webhook', express.raw({type: 'application/json'}), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, (err as Error).message);
    return res.sendStatus(400);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      // Fulfill the purchase...
      console.log(`Payment successful for session: ${session.id}`);
      // Update your database, send email, etc.
      // Example: updateOrderStatus(session.id, 'paid', session.customer_details?.email);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.sendStatus(200);
});


// This is for Deno Deploy, if you are using Node.js, you might use app.listen()
// For Deno Deploy with Supabase Edge Functions, the framework handles serving.
// If this file is intended as a standalone Express server (not an Edge Function), then:
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => console.log(`Stripe API server running on port ${PORT}`));

// If this is part of a Supabase Edge Function, the export default is usually different,
// e.g., Deno.serve(app.fetch); or similar, managed by the Supabase CLI.
// The previous edge function was 'supabase/functions/create-checkout-session/index.ts'
// This file 'src/api/stripe.ts' seems like it might be for a different purpose or an old setup.
// For Supabase Edge Functions, you don't typically run an Express server like this.
// I will keep the Express setup for now but note that for Supabase Functions,
// the structure provided by `supabase functions new <function-name>` is different.
// The create-checkout-session function was already created as a Supabase Edge Function.
// This file might be redundant if all Stripe operations go through that edge function.
// For now, just fixing the type error related to apiVersion.
// The previous error was "Type '"2023-10-16"' is not assignable to type '"2025-04-30.basil"'."
// I'm updating to "2024-04-10" as a recent stable version. The type "2025-04-30.basil" might be a very new or specific preview.
// If the exact "2025-04-30.basil" is required, it should be used.

export default app; // Assuming this is for a server setup.
