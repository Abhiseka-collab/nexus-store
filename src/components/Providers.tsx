'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { StoreProvider } from '@/context/StoreContext';
import { CartProvider } from '@/context/CartContext';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ThemeProvider>
      <StoreProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </StoreProvider>
    </ThemeProvider>
  );
};
