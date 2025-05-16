import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'; // Corrected import

interface StripeCheckoutButtonProps {
  amount: number; // Amount in smallest currency unit (e.g., pence/cents)
  currency: string; // e.g., 'gbp', 'usd'
  onSuccessfulCheckout: (paymentMethodId: string) => void;
  disabled?: boolean;
}

const StripeCheckoutButton: React.FC<StripeCheckoutButtonProps> = ({
  amount,
  currency,
  onSuccessfulCheckout,
  disabled = false,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      console.log("Stripe.js has not loaded yet.");
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      console.error("CardElement not found");
      return;
    }

    // For one-off payments, typically you'd create a PaymentIntent on your server
    // and use the clientSecret here to confirm the card payment.
    // This example focuses on tokenizing card details for a custom flow.
    // For a full checkout flow, consider using Stripe Checkout (redirect) or Payment Element.

    try {
      // Create a PaymentMethod
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        // billing_details: { // Optional: collect billing details
        //   name: 'Jenny Rosen',
        //   email: 'jenny.rosen@example.com',
        // },
      });

      if (error) {
        console.error('[stripe error]', error);
        // Show error to your customer (e.g., insufficient funds, card declined).
        alert(error.message); // Replace with user-friendly error display
      } else if (paymentMethod) {
        console.log('[PaymentMethod]', paymentMethod);
        // Send paymentMethod.id to your server to create a charge or save the card
        onSuccessfulCheckout(paymentMethod.id);
      }
    } catch (e) {
      console.error('Error processing payment:', e);
      alert('Payment processing failed.'); // Replace with user-friendly error display
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-4 border rounded-md bg-gray-50">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      <button 
        type="submit" 
        disabled={!stripe || disabled}
        className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
      >
        Pay £{(amount / 100).toFixed(2)}
      </button>
    </form>
  );
};

export default StripeCheckoutButton;
