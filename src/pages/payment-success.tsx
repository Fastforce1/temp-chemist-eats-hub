import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Head } from '../components/SEO/Head';

interface OrderDetails {
  id: string;
  amount: number;
  status: string;
}

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    // You would typically make an API call to your backend here to verify the payment
    // and get order details using the session_id
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        if (!response.ok) {
          throw new Error('Payment verification failed');
        }
        const data = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify payment');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <Head
          title="Processing Payment"
          description="Processing your payment, please wait..."
          type="website"
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head
          title="Payment Error"
          description="There was an error processing your payment."
          type="website"
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="text-red-600 text-xl mb-4">❌ {error}</div>
            <a href="/" className="text-primary hover:underline">
              Return to Home
            </a>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head
        title="Payment Successful"
        description="Your payment has been processed successfully. Thank you for your order!"
        type="website"
      />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-gray-600">
              Thank you for your order. Your payment has been processed successfully.
            </p>
            {orderDetails && (
              <div className="mt-6 border-t border-gray-200 pt-6">
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                    <dd className="mt-1 text-sm text-gray-900">{orderDetails.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Amount Paid</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${(orderDetails.amount / 100).toFixed(2)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Status</dt>
                    <dd className="mt-1 text-sm text-green-600">{orderDetails.status}</dd>
                  </div>
                </dl>
              </div>
            )}
            <div className="mt-8">
              <a
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Return to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 