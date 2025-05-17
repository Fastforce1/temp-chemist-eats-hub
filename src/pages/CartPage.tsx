import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Minus, Plus, X, Loader2, User } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'react-toastify';
import { Head } from '../components/SEO/Head';
import ErrorBoundary from '../components/ErrorBoundary';
import { getStripePriceId } from '../config/stripe-products';

const CartPageContent: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Reset error state when items change
  React.useEffect(() => {
    setError(null);
  }, [items]);

  // Log cart state changes and check for potential issues
  React.useEffect(() => {
    try {
      console.log('Cart state in CartPage:', {
        itemCount,
        total,
        items,
        hasItems: items && items.length > 0,
        itemsValid: items?.every(item => item?.supplement?.id && item?.quantity > 0),
      });

      // Validate cart items
      if (items?.some(item => !item?.supplement?.id || item?.quantity <= 0)) {
        console.error('Invalid cart items detected:', items);
        setError(new Error('Some items in your cart are invalid'));
      }
    } catch (err) {
      console.error('Error in cart state effect:', err);
      setError(err instanceof Error ? err : new Error('Unknown error in cart state'));
    }
  }, [items, itemCount, total]);

  const handleCheckout = async () => {
    setIsLoading(true);
    console.log('Starting checkout process...', {
      itemCount,
      total,
      isAuthenticated: !!user,
      userId: user?.id,
    });

    try {
      if (items.length === 0) {
        throw new Error('Your cart is empty');
      }

      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Authentication error. Please try logging in again.');
      }

      // Validate cart items before sending
      const invalidItems = items.filter(item => !item?.supplement || !item?.quantity);
      if (invalidItems.length > 0) {
        console.error('Invalid cart items detected:', invalidItems);
        throw new Error('Some items in your cart are invalid. Please try refreshing the page.');
      }

      // Map cart items to Stripe format with price IDs
      const stripeItems = items.map(item => {
        try {
          const priceId = getStripePriceId(item.supplement.name);
          return {
            priceId,
            quantity: item.quantity,
          };
        } catch (error) {
          throw new Error(`Failed to get Stripe price for ${item.supplement.name}`);
        }
      });

      console.log('Prepared Stripe items:', stripeItems);
      console.log('Sending checkout request to Supabase function...');
      
      const { data, error: checkoutError } = await supabase.functions.invoke('create-checkout-session', {
        body: { items: stripeItems },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        }
      });

      console.log('Received response:', { data, checkoutError });

      if (checkoutError) {
        throw new Error(`Checkout failed: ${checkoutError.message}`);
      }

      if (!data?.url) {
        throw new Error('Checkout failed: Could not retrieve payment session.');
      }

      console.log('Redirecting to Stripe checkout:', data.url);
      window.location.href = data.url;
    } catch (err) {
      console.error('Error during checkout:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setError(err instanceof Error ? err : new Error(errorMessage));
      setIsLoading(false);
    }
  };

  // Safe price formatter with fallback
  const formatPrice = (price?: number) => {
    if (typeof price !== 'number') return '0.00';
    return price.toFixed(2);
  };

  // Safe total calculation
  const calculateTotal = (items: CartItem[]) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((sum, item) => {
      const price = item?.supplement?.price || 0;
      const quantity = item?.quantity || 0;
      return sum + (price * quantity);
    }, 0);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">{error.message}</div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <>
      <Head
        title="Shopping Cart - Nutrition Chemist"
        description="Review and checkout your selected supplements."
        type="website"
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2" />
            Shopping Cart ({itemCount || 0} items)
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!items || items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-500 mb-4">Your cart is empty</p>
            <button
              onClick={() => navigate('/supplements')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
            >
              Browse Supplements
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow">
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div
                    key={item?.supplement?.id || 'unknown'}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item?.supplement?.image || '/placeholder-supplement.jpg'}
                        alt={item?.supplement?.name || 'Supplement'}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item?.supplement?.name || 'Unknown Supplement'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          £{formatPrice(item?.supplement?.price)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            if (item?.supplement?.id) {
                              updateQuantity(item.supplement.id, (item.quantity || 1) - 1);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                          disabled={!item?.supplement?.id || (item?.quantity || 0) <= 1}
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <span className="text-gray-600 w-8 text-center">{item?.quantity || 0}</span>
                        <button
                          onClick={() => {
                            if (item?.supplement?.id) {
                              updateQuantity(item.supplement.id, (item.quantity || 1) + 1);
                            }
                          }}
                          className="p-1 text-gray-400 hover:text-gray-500"
                          disabled={!item?.supplement?.id}
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          if (item?.supplement?.id) {
                            removeFromCart(item.supplement.id);
                          }
                        }}
                        className="text-red-500 hover:text-red-600"
                        disabled={!item?.supplement?.id}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                <p>Subtotal</p>
                <p>£{formatPrice(calculateTotal(items))}</p>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Shipping and taxes calculated at checkout.
              </p>
              {!user && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Have an account?</h3>
                      <p className="text-sm text-gray-500">Sign in for a faster checkout</p>
                    </div>
                    <button
                      onClick={() => navigate('/login')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </button>
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading || !items || items.length === 0}
                  className="w-full flex items-center justify-center bg-emerald-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-emerald-700 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  ) : null}
                  {isLoading ? 'Processing...' : `Proceed to Checkout ${user ? '' : '(as Guest)'}`}
                </button>
                <button
                  onClick={() => {
                    console.log('Clearing cart');
                    clearCart();
                  }}
                  className="w-full text-center text-sm text-gray-500 hover:text-gray-700"
                  disabled={!items || items.length === 0}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const CartPage: React.FC = () => (
  <ErrorBoundary>
    <CartPageContent />
  </ErrorBoundary>
);

export default CartPage; 