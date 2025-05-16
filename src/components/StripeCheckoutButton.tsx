import { useState } from 'react';
import { useStripe } from '@stripe/stripe-react-stripe-js';
import { createCheckoutSession } from '../utils/stripe';

interface StripeCheckoutButtonProps {
  priceId: string;
  className?: string;
  children?: React.ReactNode;
}

export default function StripeCheckoutButton({
  priceId,
  className = '',
  children,
}: StripeCheckoutButtonProps) {
  const stripe = useStripe();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!stripe) {
      console.error('Stripe has not been initialized');
      return;
    }

    try {
      setLoading(true);
      const sessionId = await createCheckoutSession(priceId);
      
      // Redirect to Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={!stripe || loading}
      className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : null}
      {children || 'Checkout'}
    </button>
  );
} 