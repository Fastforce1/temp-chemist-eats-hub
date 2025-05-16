import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Supplement } from '../types';

interface CartItem {
  supplement: Supplement;
  quantity: number;
}

interface AddToCartParams {
  supplement: Supplement;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (supplementOrParams: Supplement | AddToCartParams, quantity?: number) => void;
  removeFromCart: (supplementId: string) => void;
  updateQuantity: (supplementId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((supplementOrParams: Supplement | AddToCartParams, quantity: number = 1) => {
    setItems(currentItems => {
      // Handle both object and separate parameter versions
      const supplement = 'supplement' in supplementOrParams ? supplementOrParams.supplement : supplementOrParams;
      const qty = 'quantity' in supplementOrParams ? supplementOrParams.quantity || 1 : quantity;
      
      const existingItem = currentItems.find(item => item.supplement.id === supplement.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.supplement.id === supplement.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }

      return [...currentItems, { supplement, quantity: qty }];
    });
  }, []);

  const removeFromCart = useCallback((supplementId: string) => {
    setItems(currentItems => 
      currentItems.filter(item => item.supplement.id !== supplementId)
    );
  }, []);

  const updateQuantity = useCallback((supplementId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.supplement.id === supplementId
          ? { ...item, quantity }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
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