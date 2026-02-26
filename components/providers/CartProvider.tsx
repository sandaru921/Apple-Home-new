'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useOverlay } from './OverlayProvider';

export interface CartItem {
  _id: string; // Product string ID from frontend
  cartItemId?: string; // Optional unique ID for duplicate items
  model: string;
  price: number;
  imageUrl: string;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (idToRemove: string) => void;
  updateQuantity: (idToUpdate: string, delta: number) => void;
  clearCart: () => void;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { showToast } = useOverlay();

  // Load and merge logic
  useEffect(() => {
    if (status === 'loading') return;

    const loadCart = async () => {
      // 1. Get the local cart
      const localCartString = localStorage.getItem('appleHomeCart');
      const localCart: CartItem[] = localCartString ? JSON.parse(localCartString) : [];

      if (status === 'authenticated') {
        // Authenticated: Fetch DB Cart
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const dbCartData = await res.json();
            let dbCart: CartItem[] = dbCartData.items?.map((item: any) => ({
              _id: item.productId.toString(), // Convert ObjectIDs to strings for the frontend
              cartItemId: item._id?.toString(),
              model: item.model,
              price: item.price,
              imageUrl: item.imageUrl,
              quantity: item.quantity,
              selectedColor: item.selectedColor,
              selectedStorage: item.selectedStorage
            })) || [];

            // If there are items in local storage, we should merge them into the DB cart and clear local
            if (localCart.length > 0) {
              const mergedCart = [...dbCart];
              localCart.forEach(localItem => {
                const existingIndex = mergedCart.findIndex(
                  dbItem => dbItem._id === localItem._id && 
                            dbItem.selectedColor === localItem.selectedColor && 
                            dbItem.selectedStorage === localItem.selectedStorage
                );
                if (existingIndex > -1) {
                  mergedCart[existingIndex].quantity += localItem.quantity;
                } else {
                  mergedCart.push(localItem);
                }
              });
              
              setCart(mergedCart);
              localStorage.removeItem('appleHomeCart');
              
              // Save the merged cart to the DB
              await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: mergedCart.map(i => ({...i, productId: i._id})) })
              });
              showToast('Your carts were merged successfully.', 'success');
            } else {
              setCart(dbCart);
            }
          }
        } catch (error) {
          console.error('Failed to load DB cart', error);
        }
      } else if (status === 'unauthenticated') {
        // Unauthenticated: Only use local cart
        setCart(localCart);
      }
      setIsLoaded(true);
    };

    loadCart();
  }, [status]); // Only re-run when auth status definitively changes

  // Helper to persist changes
  const persistCart = async (newCart: CartItem[]) => {
    setCart(newCart);
    if (status === 'authenticated') {
      try {
        await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: newCart.map(i => ({...i, productId: i._id})) })
        });
      } catch (error) {
        console.error('Failed to sync cart to DB', error);
      }
    } else {
      localStorage.setItem('appleHomeCart', JSON.stringify(newCart));
    }
  };

  const addToCart = (newItem: CartItem) => {
    const newCart = [...cart];
    const existingIndex = newCart.findIndex(
      (item) => item._id === newItem._id && 
                item.selectedColor === newItem.selectedColor && 
                item.selectedStorage === newItem.selectedStorage
    );

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += newItem.quantity;
    } else {
      newCart.push({ ...newItem, cartItemId: Math.random().toString(36).substring(7) }); // Give frontend ID for unique mapping if needed
    }

    persistCart(newCart);
    showToast(`${newItem.model} added to cart!`, 'success');
  };

  const removeFromCart = (idToRemove: string) => {
    const newCart = cart.filter(item => (item.cartItemId || item._id) !== idToRemove);
    persistCart(newCart);
    showToast('Item removed from cart', 'info');
  };

  const updateQuantity = (idToUpdate: string, delta: number) => {
    const newCart = cart.map(item => {
      const identifier = item.cartItemId || item._id;
      return identifier === idToUpdate
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item;
    });
    persistCart(newCart);
  };

  const clearCart = () => {
    persistCart([]);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, updateQuantity, clearCart, isLoaded }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
