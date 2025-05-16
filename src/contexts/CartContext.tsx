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

const validateCartData = (data: any): CartItem[] => {
  if (!Array.isArray(data)) {
    console.error('Invalid cart data: not an array', data);
    return [];
  }

  return data.filter(item => {
    const isValid = item && 
      item.supplement && 
      typeof item.supplement === 'object' &&
      typeof item.supplement.id === 'string' &&
      typeof item.quantity === 'number';
    
    if (!isValid) {
      console.error('Invalid cart item:', item);
    }
    return isValid;
  });
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage if available
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      console.log('Initializing cart from localStorage');
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      console.log('Saved cart data:', savedCart);
      
      if (!savedCart) {
        console.log('No saved cart found, starting with empty cart');
        return [];
      }

      const parsedCart = JSON.parse(savedCart);
      console.log('Parsed cart data:', parsedCart);
      
      const validatedCart = validateCartData(parsedCart);
      console.log('Validated cart data:', validatedCart);
      
      return validatedCart;
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    try {
      console.log('Saving cart to localStorage:', items);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      console.log('Cart saved successfully');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  // Debug effect to log cart state changes
  useEffect(() => {
    console.log('Cart state updated:', {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.supplement.price * item.quantity, 0),
      items,
    });
  }, [items]);

  const addToCart = useCallback((supplement: Supplement, quantity: number = 1) => {
    console.log('Adding to cart:', { supplement, quantity });
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.supplement.id === supplement.id);
      
      if (existingItem) {
        console.log('Updating existing item quantity');
        return currentItems.map(item =>
          item.supplement.id === supplement.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      console.log('Adding new item to cart');
      return [...currentItems, { supplement, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((supplementId: string) => {
    console.log('Removing from cart:', supplementId);
    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.supplement.id !== supplementId);
      console.log('Updated cart after removal:', newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((supplementId: string, quantity: number) => {
    if (quantity < 1) {
      console.log('Ignoring invalid quantity:', quantity);
      return;
    }
    
    console.log('Updating quantity:', { supplementId, quantity });
    setItems(currentItems => {
      const newItems = currentItems.map(item =>
        item.supplement.id === supplementId
          ? { ...item, quantity }
          : item
      );
      console.log('Updated cart after quantity change:', newItems);
      return newItems;
    });
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