import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Supplement } from '../types';

interface CartItem {
  supplement: Supplement;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (supplement: Supplement, quantity?: number) => void;
  removeFromCart: (supplementId: string) => void;
  updateQuantity: (supplementId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CART_STORAGE_KEY = 'nutrition-chemist-cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = useCallback((supplement: Supplement, quantity: number = 1) => {
    console.log('Adding to cart:', { supplement, quantity });
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.supplement.id === supplement.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.supplement.id === supplement.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { supplement, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((supplementId: string) => {
    console.log('Removing from cart:', supplementId);
    setItems(currentItems => 
      currentItems.filter(item => item.supplement.id !== supplementId)
    );
  }, []);

  const updateQuantity = useCallback((supplementId: string, quantity: number) => {
    if (quantity < 1) return;
    
    console.log('Updating quantity:', { supplementId, quantity });
    setItems(currentItems =>
      currentItems.map(item =>
        item.supplement.id === supplementId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    console.log('Clearing cart');
    setItems([]);
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.supplement.price * item.quantity,
    0
  );

  const itemCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 