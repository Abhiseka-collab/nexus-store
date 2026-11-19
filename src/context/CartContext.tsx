'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '@/types/product';
import { PROMO_CODES } from '@/data/products';
import { useStore } from './StoreContext';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  isSuccessOpen: boolean;
  viewingProduct: Product | null;
  appliedPromo: string | null;
  discountRate: number;
  latestOrder: Order | null;
  itemCount: number;
  currency: 'USD' | 'INR';
  currencySymbol: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: (open?: boolean) => void;
  setViewingProduct: (product: Product | null) => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  openCheckout: () => void;
  closeCheckout: () => void;
  closeSuccess: () => void;
  completeOrder: (name: string, email: string) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { recordOrder, settings, currency, currencySymbol } = useStore();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(settings.promoCode || 'LAUNCH30');
  const [discountRate, setDiscountRate] = useState<number>(settings.promoDiscount || 0.30);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Sync initial promo if settings change
  useEffect(() => {
    if (settings.promoCode) {
      setAppliedPromo(settings.promoCode);
      setDiscountRate(settings.promoDiscount);
    }
  }, [settings.promoCode, settings.promoDiscount]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('digital_store_cart');
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('digital_store_cart', JSON.stringify(items));
    } catch {
      // Ignore storage error
    }
  }, [items]);

  const addToCart = (product: Product) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const toggleCart = (open?: boolean) => {
    setIsCartOpen((prev) => (open !== undefined ? open : !prev));
  };

  const applyPromo = (code: string) => {
    const formatted = code.trim().toUpperCase();

    // Check dynamic settings first
    if (settings.promoCode && formatted === settings.promoCode.toUpperCase()) {
      setAppliedPromo(formatted);
      setDiscountRate(settings.promoDiscount);
      return { success: true, message: `Promo code applied! Enjoy ${(settings.promoDiscount * 100)}% off!` };
    }

    if (PROMO_CODES[formatted]) {
      setAppliedPromo(formatted);
      setDiscountRate(PROMO_CODES[formatted]);
      return { success: true, message: `Promo code applied! Enjoy ${(PROMO_CODES[formatted] * 100)}% off!` };
    }
    return { success: false, message: 'Invalid promo code. Try "LAUNCH30" or "SOLO20".' };
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setDiscountRate(0);
  };

  const openCheckout = () => {
    if (items.length === 0) return;
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
  };

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = currency === 'INR'
      ? (item.product.priceInr || Math.round(item.product.price * 75))
      : item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);
  const discountAmount = Math.round(subtotal * discountRate * 100) / 100;
  const total = Math.max(0, Math.round((subtotal - discountAmount) * 100) / 100);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const completeOrder = (customerName: string, customerEmail: string): Order => {
    const order: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName,
      customerEmail,
      items: [...items],
      subtotal,
      discount: discountAmount,
      total,
      currency,
      promoCode: appliedPromo || undefined,
      createdAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      downloadToken: `DL-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
    };

    setLatestOrder(order);
    recordOrder(order); // Saved to Admin order database!
    clearCart();
    setIsCheckoutOpen(false);
    setIsSuccessOpen(true);
    return order;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        isCheckoutOpen,
        isSuccessOpen,
        viewingProduct,
        appliedPromo,
        discountRate,
        latestOrder,
        itemCount,
        currency,
        currencySymbol,
        subtotal,
        discountAmount,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleCart,
        setViewingProduct,
        applyPromo,
        removePromo,
        openCheckout,
        closeCheckout,
        closeSuccess,
        completeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
