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

const isValidSupplement = (supplement: any): supplement is Supplement => {
  console.log('Validating supplement:', supplement);
  
  if (!supplement) {
    console.error('Supplement is null or undefined');
    return false;
  }

  if (typeof supplement !== 'object') {
    console.error('Supplement is not an object:', typeof supplement);
    return false;
  }

  const hasValidId = typeof supplement.id === 'string' && supplement.id.length > 0;
  const hasValidName = typeof supplement.name === 'string' && supplement.name.length > 0;
  const hasValidPrice = typeof supplement.price === 'number' && !isNaN(supplement.price);

  console.log('Supplement validation results:', {
    hasValidId,
    hasValidName,
    hasValidPrice,
    id: supplement.id,
    name: supplement.name,
    price: supplement.price
  });

  if (!hasValidName) {
    console.error('Supplement is missing a valid name:', supplement);
  }

  return hasValidId && hasValidName && hasValidPrice;
};

const isValidCartItem = (item: any): item is CartItem => {
  console.log('Validating cart item:', item);
  
  if (!item) {
    console.error('Cart item is null or undefined');
    return false;
  }

  if (typeof item !== 'object') {
    console.error('Cart item is not an object:', typeof item);
    return false;
  }

  const hasValidSupplement = isValidSupplement(item.supplement);
  const hasValidQuantity = typeof item.quantity === 'number' && item.quantity > 0;

  console.log('Cart item validation results:', {
    hasValidSupplement,
    hasValidQuantity,
    quantity: item.quantity
  });

  return hasValidSupplement && hasValidQuantity;
};

const validateCartData = (data: any): CartItem[] => {
  console.log('Validating cart data:', data);

  if (!Array.isArray(data)) {
    console.error('Invalid cart data: not an array', data);
    return [];
  }

  const validItems = data.filter(item => {
    try {
      const isValid = isValidCartItem(item);
      if (!isValid) {
        console.error('Invalid cart item:', item);
      }
      return isValid;
    } catch (error) {
      console.error('Error validating cart item:', error);
      return false;
    }
  });

  console.log('Validated cart items:', validItems);
  return validItems;
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
      // Validate before saving
      const validItems = validateCartData(items);
      if (validItems.length !== items.length) {
        console.warn('Some cart items were invalid and will be removed');
        setItems(validItems);
        return;
      }

      console.log('Saving cart to localStorage:', items);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      console.log('Cart saved successfully');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = useCallback((supplement: Supplement, quantity: number = 1) => {
    console.log('Adding to cart:', { supplement, quantity });
    
    if (!isValidSupplement(supplement)) {
      console.error('Invalid supplement:', supplement);
      return;
    }

    if (quantity <= 0) {
      console.error('Invalid quantity:', quantity);
      return;
    }

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
    
    if (typeof supplementId !== 'string') {
      console.error('Invalid supplement ID:', supplementId);
      return;
    }

    setItems(currentItems => {
      const newItems = currentItems.filter(item => item.supplement.id !== supplementId);
      console.log('Updated cart after removal:', newItems);
      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((supplementId: string, quantity: number) => {
    console.log('Updating quantity:', { supplementId, quantity });
    
    if (typeof supplementId !== 'string') {
      console.error('Invalid supplement ID:', supplementId);
      return;
    }

    if (quantity <= 0) {
      console.error('Invalid quantity:', quantity);
      return;
    }
    
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
    (sum, item) => {
      if (!isValidCartItem(item)) {
        console.warn('Invalid item found while calculating total:', item);
        return sum;
      }
      return sum + item.supplement.price * item.quantity;
    },
    0
  );

  const itemCount = items.reduce(
    (sum, item) => {
      if (!isValidCartItem(item)) {
        console.warn('Invalid item found while calculating item count:', item);
        return sum;
      }
      return sum + item.quantity;
    },
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