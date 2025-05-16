import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { ShoppingCart, Minus, Plus, X, Loader2, User } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'react-toastify';
import { Head } from '../components/SEO/Head';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    console.log('Starting checkout process...', {
      itemCount,
      total,
      isAuthenticated: !!user,
      userId: user?.id,
    });

    if (items.length === 0) {
      console.error('Attempted checkout with empty cart');
      toast.error("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    // Validate cart items before sending
    const invalidItems = items.filter(item => !item.supplement || !item.quantity);
    if (invalidItems.length > 0) {
      console.error('Invalid cart items detected:', invalidItems);
      toast.error("Some items in your cart are invalid. Please try refreshing the page.");
      setIsLoading(false);
      return;
    }

    const cartDetails = {
      items: items.map(item => ({
        supplement: {
          id: item.supplement.id,
          name: item.supplement.name,
          price: item.supplement.price,
          image: item.supplement.image,
        },
        quantity: item.quantity,
      })),
    };

    console.log('Prepared cart details:', cartDetails);
    console.log('Sending checkout request to Supabase function...');
    
    try {
      let headers = {};
      
      // Only add Authorization header if user is logged in
      if (user) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers = {
            Authorization: `Bearer ${session.access_token}`,
          };
        }
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: cartDetails,
        headers
      });

      console.log('Received response:', { data, error });

      if (error) {
        console.error("Error invoking create-checkout-session:", error);
        toast.error(`Checkout failed: ${error.message}`);
        setIsLoading(false);
        return;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        window.location.href = data.url;
      } else {
        console.error("No session URL returned:", data);
        toast.error("Checkout failed: Could not retrieve payment session.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(`Checkout failed: ${error.message || "An unexpected error occurred"}`);
      setIsLoading(false);
    }
  };

  // Log cart state changes
  React.useEffect(() => {
    console.log('Cart state updated:', {
      itemCount,
      total,
      items,
    });
  }, [items, itemCount, total]);

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
            Shopping Cart ({itemCount} items)
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {items.length === 0 ? (
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
                    key={item.supplement.id}
                    className="flex items-center justify-between p-6"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.supplement.image || '/placeholder-supplement.jpg'}
                        alt={item.supplement.name}
                        className="h-20 w-20 rounded-md object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.supplement.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          £{item.supplement.price.toFixed(2)} each
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            console.log('Decreasing quantity:', {
                              itemId: item.supplement.id,
                              currentQuantity: item.quantity,
                            });
                            updateQuantity(item.supplement.id, item.quantity - 1);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-5 w-5" />
                        </button>
                        <span className="text-gray-600 w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => {
                            console.log('Increasing quantity:', {
                              itemId: item.supplement.id,
                              currentQuantity: item.quantity,
                            });
                            updateQuantity(item.supplement.id, item.quantity + 1);
                          }}
                          className="p-1 text-gray-400 hover:text-gray-500"
                        >
                          <Plus className="h-5 w-5" />
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          console.log('Removing item:', {
                            itemId: item.supplement.id,
                            name: item.supplement.name,
                          });
                          removeFromCart(item.supplement.id);
                        }}
                        className="text-red-500 hover:text-red-600"
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
                <p>£{total.toFixed(2)}</p>
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
                  disabled={isLoading || items.length === 0}
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
                  disabled={items.length === 0}
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

export default CartPage; 