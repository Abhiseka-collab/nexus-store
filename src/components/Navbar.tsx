'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ShieldCheck, Zap, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

export const Navbar: React.FC = () => {
  const { itemCount, toggleCart } = useCart();
  const { settings, currency, setCurrency } = useStore();

  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white text-xs sm:text-sm font-medium py-2 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 animate-pulse" />
        <span>{settings.announcementText}</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/85 dark:bg-zinc-950/85 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                {settings.storeName}
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600 dark:text-zinc-300">
            <a href="/#products" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Products
            </a>
            <a href="/#spreadsheet-tour" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5">
              <span>Spreadsheet Tour</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800">16 Tabs</span>
            </a>
            <a href="/#features" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Features
            </a>
            <a href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              FAQ
            </a>
          </nav>

          {/* Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Currency Switcher */}
            <div className="flex items-center p-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                  currency === 'USD'
                    ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title="Switch to US Dollar ($)"
              >
                <span>🇺🇸</span>
                <span className="font-mono text-[11px]">$ USD</span>
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                  currency === 'INR'
                    ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title="Switch to Indian Rupee (₹ UPI)"
              >
                <span>🇮🇳</span>
                <span className="font-mono text-[11px]">₹ INR</span>
              </button>
            </div>

            {/* Admin Portal Link */}
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 transition-all"
              title="Admin Portal (Owner Access)"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-500" />
              <span className="font-semibold hidden sm:inline">Admin</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instant Download</span>
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => toggleCart(true)}
              className="relative flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-900 px-4 py-2 rounded-xl font-medium text-sm transition-all shadow-sm hover:shadow active:scale-95"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">Cart</span>
              {itemCount > 0 && (
                <span className="bg-indigo-600 text-white dark:bg-indigo-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
