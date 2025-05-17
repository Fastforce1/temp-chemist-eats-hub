import React, { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, X, Loader2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../config/supabase';
import { toast } from 'react-toastify';
import { fetchStripeProducts, createCheckoutSession, type StripeProduct } from '../../lib/stripe';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [stripeProducts, setStripeProducts] = useState<StripeProduct[]>([]);

  useEffect(() => {
    const loadStripeProducts = async () => {
      try {
        const products = await fetchStripeProducts();
        setStripeProducts(products);
      } catch (error) {
        console.error('Error loading Stripe products:', error);
        toast.error('Failed to load product information');
      }
    };

    if (isOpen) {
      loadStripeProducts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      setIsLoading(false);
      return;
    }

    try {
      // Map cart items to Stripe price IDs
      const checkoutItems = items.map(item => {
        const stripeProduct = stripeProducts.find(p => 
          p.name.toLowerCase() === item.supplement.name.toLowerCase()
        );
        
        if (!stripeProduct || stripeProduct.prices.length === 0) {
          throw new Error(`No Stripe price found for ${item.supplement.name}`);
        }

        // Use the first price (assuming one price per product)
        const priceId = stripeProduct.prices[0].id;

        return {
          priceId,
          quantity: item.quantity,
        };
      });

      await createCheckoutSession(checkoutItems);
    } catch (e: any) {
      console.error("Exception during checkout:", e);
      toast.error(`Checkout failed: ${e.message || "An unexpected error occurred."}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md">
        <div className="flex h-full flex-col bg-white shadow-xl">
          <div className="flex items-center justify-between px-4 py-6 sm:px-6">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ShoppingCart className="h-6 w-6 mr-2" />
              Shopping Cart ({itemCount} items)
            </h2>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 px-4 py-6 sm:px-6">
              <p className="text-center text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.supplement.id}
                      className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={item.supplement.image || '/placeholder-supplement.jpg'}
                          alt={item.supplement.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.supplement.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            £{item.supplement.price.toFixed(2)} each
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.supplement.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-500 disabled:opacity-50"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="text-gray-600">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.supplement.id, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-500"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.supplement.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>£{total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Shipping and taxes calculated at checkout.
                </p>
                <div className="mt-6">
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading || items.length === 0}
                    className="w-full flex items-center justify-center bg-blue-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 rounded-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : null}
                    {isLoading ? 'Processing...' : 'Checkout'}
                  </button>
                </div>
                <div className="mt-4 text-center">
                    <button
                        onClick={clearCart}
                        className="text-sm text-gray-500 hover:text-gray-700"
                        disabled={items.length === 0}
                    >
                        Clear Cart
                    </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
