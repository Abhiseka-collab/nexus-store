'use client';

import React, { useState } from 'react';
import { X, Lock, CheckCircle2, Shield, Zap, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { sanitizeText } from '@/utils/security';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    closeCheckout,
    completeOrder,
    items,
    total,
    discountAmount,
    appliedPromo,
    currency,
  } = useCart();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  // Charge amount in INR for Razorpay (minimum ₹1)
  const chargeAmountInr = currency === 'INR' ? Math.max(1, Math.round(total)) : Math.max(1, Math.round(total * 86));

  const formattedTotal = currency === 'INR' ? `₹${total.toLocaleString('en-IN')}` : `$${total.toFixed(total % 1 === 0 ? 0 : 2)}`;

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
    setErrorMessage(null);

    const cleanEmail = sanitizeText(email, 100);
    const cleanName = sanitizeText(name, 80) || cleanEmail.split('@')[0] || 'Valued Creator';

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address so we can send your download link.');
      return;
    }

    await handlePaymentFlow(cleanName, cleanEmail);
  };

  const handlePaymentFlow = async (customerName: string, customerEmail: string) => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Create order on server
      const res = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: chargeAmountInr, currency: 'INR' }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to initialize payment gateway.');
      }

      const orderData = await res.json();
      const scriptLoaded = await loadRazorpayScript();
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // 2. Open official Razorpay modal
      if (scriptLoaded && razorpayKey && (window as any).Razorpay && !orderData.mock) {
        const options = {
          key: razorpayKey,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'NEXUS',
          description: `Instant Digital Download (${items.length} item)`,
          order_id: orderData.id,
          prefill: {
            name: customerName,
            email: customerEmail,
          },
          theme: {
            color: '#4f46e5',
          },
          handler: (response: any) => {
            // SEAMLESS INSTANT UNLOCK:
            // Immediately complete order upon successful payment callback without blocking on verification checks!
            completeOrder(customerName, customerEmail);
            setIsProcessing(false);

            // Silent asynchronous verification log in background (non-blocking)
            if (response?.razorpay_payment_id) {
              fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              }).catch((e) => console.log('Silent verification log:', e));
            }
          },
          modal: {
            ondismiss: () => {
              setIsProcessing(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (resp: any) {
          setIsProcessing(false);
          setErrorMessage(resp?.error?.description || 'Payment was declined or cancelled.');
        });
        rzp.open();
      } else {
        // Instant Sandbox / Local Mode: Unlock files immediately without delay
        setTimeout(() => {
          completeOrder(customerName, customerEmail);
          setIsProcessing(false);
        }, 800);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      // In case of any network glitch with gateway, allow instant access so customer is never stuck
      setErrorMessage(err?.message || 'Unable to connect to payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/65 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-5 sm:p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-200 flex items-center gap-1">
              <Zap className="w-3 h-3 fill-current" />
              1-Click Instant Delivery
            </span>
            <h3 className="text-lg sm:text-xl font-black mt-0.5">
              Unlock Your Master Files
            </h3>
          </div>
          <button
            onClick={closeCheckout}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Product Pill */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                  Personal Growth System (.xlsx)
                </div>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  16 Interconnected Tabs • Lifetime Updates
                </div>
              </div>
            </div>
            <span className="text-base font-black text-zinc-900 dark:text-white shrink-0 ml-2" suppressHydrationWarning>
              {formattedTotal}
            </span>
          </div>

          {/* Email Input */}
          <div>
            <label className="text-xs font-bold text-zinc-900 dark:text-white block mb-1.5">
              Where should we send your backup link?
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <span className="text-[11px] text-zinc-500 mt-1 block">
              Files download immediately on screen upon payment.
            </span>
          </div>

          {/* Optional Name */}
          <div>
            <label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400 block mb-1">
              Your Name (Optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name or handle"
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Price Summary Strip */}
          <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="text-zinc-600 dark:text-zinc-400">Total Due Today:</span>
            <div className="text-right">
              <span className="text-xl font-black text-indigo-600 dark:text-indigo-400" suppressHydrationWarning>
                {formattedTotal}
              </span>
              {currency === 'USD' && (
                <span className="text-[10px] text-zinc-500 block font-mono">
                  (Billed as ₹{chargeAmountInr} INR via UPI/Card)
                </span>
              )}
            </div>
          </div>

          {/* Action Button: 1-Click Pay & Download */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Opening Encrypted Checkout...</span>
              </div>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-white" />
                <span suppressHydrationWarning>
                  Pay {formattedTotal} & Download Instantly
                </span>
              </>
            )}
          </button>

          {/* Instant delivery guarantee */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 text-center pt-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>UPI, Google Pay, PhonePe, Cards • Instant .XLSX Access</span>
          </div>
        </form>
      </div>
    </div>
  );
};
