'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

export const MobileStickyBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { openCheckout, addToCart } = useCart();
  const { products, currency } = useStore();

  const flagshipProduct = products[0];

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar after scrolling 350px down
      if (window.scrollY > 350) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  const handleQuickUnlock = () => {
    if (flagshipProduct) {
      addToCart(flagshipProduct);
    }
    openCheckout();
  };

  const currentPrice = currency === 'INR' ? '₹10' : '$1';
  const regularPrice = currency === 'INR' ? '₹99' : '$10';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-zinc-950/95 dark:bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 shadow-2xl animate-fade-in">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-400">
            <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
            <span className="truncate">16-in-1 Personal Growth System</span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-black text-white">{currentPrice}</span>
            <span className="text-[10px] text-zinc-500 line-through">{regularPrice}</span>
            <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60">
              SAVE 90%
            </span>
          </div>
        </div>

        <button
          onClick={handleQuickUnlock}
          className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span>Get Access</span>
        </button>
      </div>
    </div>
  );
};
