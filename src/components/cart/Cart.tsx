import React, { useState, useEffect } from 'react';
import { ShoppingCart, Minus, Plus, X, Loader2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { supabase } from '../../config/supabase';
import { toast } from 'react-toastify';
import { fetchStripeProducts, createCheckoutSession, type StripeProduct } from '../../lib/stripe';
import { getStripePriceId } from '../../config/stripe-products';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, total, itemCount, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

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

      await createCheckoutSession(checkoutItems);
    } catch (e: any) {
      console.error("Exception during checkout:", e);
      toast.error(`Checkout failed: ${e.message || "An unexpected error occurred."}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <div className="pointer-events-auto w-screen max-w-md">
            <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Shopping Cart</h2>
                  <div className="ml-3 flex h-7 items-center">
                    <button
                      type="button"
                      className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {items.length === 0 ? (
                  <div className="flex-1 px-4 py-6 sm:px-6">
                    <p className="text-center text-gray-500">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="mt-8">
                      <div className="flow-root">
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {items.map((item) => (
                            <li key={item.supplement.id} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={item.supplement.image || '/placeholder-supplement.jpg'}
                                  alt={item.supplement.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.supplement.name}</h3>
                                    <p className="ml-4">£{(item.supplement.price * item.quantity).toFixed(2)}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">{item.supplement.brand}</p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    <button
                                      onClick={() => updateQuantity(item.supplement.id, Math.max(1, item.quantity - 1))}
                                      className="p-1 text-gray-400 hover:text-gray-500"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="text-gray-500">Qty {item.quantity}</span>
                                    <button
                                      onClick={() => updateQuantity(item.supplement.id, item.quantity + 1)}
                                      className="p-1 text-gray-400 hover:text-gray-500"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </button>
                                  </div>

                                  <div className="flex">
                                    <button
                                      type="button"
                                      onClick={() => removeFromCart(item.supplement.id)}
                                      className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                )}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
