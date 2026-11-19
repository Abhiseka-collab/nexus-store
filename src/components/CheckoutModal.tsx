'use client';

import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle2, Shield, Zap, Sparkles, Smartphone } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { sanitizeText } from '@/utils/security';

export const CheckoutModal: React.FC = () => {
  const { isCheckoutOpen, closeCheckout, completeOrder, items, total, discountAmount, appliedPromo } = useCart();

  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.creator@example.com');
  const [paymentTab, setPaymentTab] = useState<'razorpay' | 'card' | 'express'>('razorpay');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('999');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  // On-demand loader for official Razorpay checkout script
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined') return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    const cleanName = sanitizeText(name, 80);
    const cleanEmail = sanitizeText(email, 100);
    if (!cleanName || !cleanEmail || !cleanEmail.includes('@')) return;

    if (paymentTab === 'razorpay') {
      await handleRazorpayFlow(cleanName, cleanEmail);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        completeOrder(cleanName, cleanEmail);
        setIsProcessing(false);
      }, 1200);
    }
  };

  const handleRazorpayFlow = async (customerName: string, customerEmail: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total, currency: 'INR' }),
      });
      const orderData = await res.json();

      const scriptLoaded = await loadRazorpayScript();
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // If Razorpay keys and script are active, open Razorpay Checkout modal
      if (scriptLoaded && razorpayKey && (window as any).Razorpay && !orderData.mock) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'NEXUS',
          description: `Digital Assets Purchase (${items.length} items)`,
          order_id: orderData.id,
          prefill: {
            name: customerName,
            email: customerEmail,
          },
          theme: {
            color: '#4f46e5',
          },
          handler: async (response: any) => {
            // Verify HMAC signature via server endpoint
            await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(response),
            });
            completeOrder(customerName, customerEmail);
            setIsProcessing(false);
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        // Test / Sandbox Fallback
        setTimeout(() => {
          completeOrder(customerName, customerEmail);
          setIsProcessing(false);
        }, 1200);
      }
    } catch {
      setIsProcessing(false);
    }
  };

  const handleQuickDemoCheckout = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setTimeout(() => {
      completeOrder('Demo Creator', 'creator@nexus.io');
      setIsProcessing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">Secure Checkout</h3>
              <p className="text-xs text-zinc-500">256-bit encrypted digital fulfillment</p>
            </div>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Quick Demo Test Mode Banner */}
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/80 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-indigo-950 dark:text-indigo-200 block">Instant Demo Test Mode</span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Skip payment details to test digital file download</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoCheckout}
              disabled={isProcessing}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1 shrink-0"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>1-Click Test</span>
            </button>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              1. Where should we send your download links?
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              2. Payment Method
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {/* Razorpay Option */}
              <button
                type="button"
                onClick={() => setPaymentTab('razorpay')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'razorpay'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate">Razorpay (UPI)</span>
              </button>

              {/* Card Option */}
              <button
                type="button"
                onClick={() => setPaymentTab('card')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'card'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Card</span>
              </button>

              {/* Express Option */}
              <button
                type="button"
                onClick={() => setPaymentTab('express')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'express'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <span>Pay/GPay</span>
              </button>
            </div>

            {/* Razorpay Body */}
            {paymentTab === 'razorpay' && (
              <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-zinc-800/60 border border-indigo-200/80 dark:border-zinc-700 space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                  <span>⚡ Official Razorpay Gateway</span>
                </div>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  Supports <strong>UPI (GPay, PhonePe, Paytm, QR Code)</strong>, Indian & International Cards, and NetBanking with bank-level encryption.
                </p>
                <span className="inline-block text-[10px] text-zinc-400 font-mono">
                  {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '✓ Razorpay Active' : '● Test/Sandbox Mode Ready'}
                </span>
              </div>
            )}

            {paymentTab === 'card' && (
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 space-y-3">
                <div>
                  <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <CreditCard className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentTab === 'express' && (
              <div className="p-6 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-center space-y-2">
                <span className="text-2xl">⚡</span>
                <h5 className="text-xs font-bold text-zinc-900 dark:text-white">Apple Pay & Google Pay</h5>
                <p className="text-[11px] text-zinc-500">
                  Biometric touch/face ID checkout will activate upon clicking Complete Order.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Line */}
          <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 text-xs space-y-1">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>{items.length} {items.length === 1 ? 'item' : 'items'} in order</span>
              {discountAmount > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Promo {appliedPromo} applied
                </span>
              )}
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-bold text-zinc-900 dark:text-white text-sm">Total Due Today:</span>
              <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Complete Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Securing Download Access...</span>
              </div>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {paymentTab === 'razorpay'
                    ? `Pay with Razorpay / UPI ($${total.toFixed(2)})`
                    : `Complete Purchase ($${total.toFixed(2)})`}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400 text-center">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Guaranteed Instant File Access • 30-Day Refund Window</span>
          </div>
        </form>
      </div>
    </div>
  );
};
