'use client';

import React from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <StoreProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </StoreProvider>
  );
};
