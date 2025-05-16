import { XCircleIcon } from '@heroicons/react/24/solid';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <XCircleIcon className="mx-auto h-16 w-16 text-red-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Cancelled</h2>
          <p className="mt-2 text-gray-600">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <div className="mt-8 space-y-4">
            <a
              href="/checkout"
              className="block w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Try Again
            </a>
            <a
              href="/"
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 