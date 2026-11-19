'use client';

import React, { useState } from 'react';
import { X, Lock, CreditCard, CheckCircle2, Shield, Smartphone, AlertCircle, Building2 } from 'lucide-react';
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
    currencySymbol,
  } = useCart();

  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex.creator@example.com');
  const [paymentTab, setPaymentTab] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  // Amount in INR for Razorpay payment processing
  const chargeAmountInr = currency === 'INR' ? Math.round(total) : Math.round(total * 86);

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

    const cleanName = sanitizeText(name, 80);
    const cleanEmail = sanitizeText(email, 100);

    if (!cleanName) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address for file delivery.');
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
        throw new Error(errorData.error || 'Failed to initialize payment gateway order.');
      }

      const orderData = await res.json();
      const scriptLoaded = await loadRazorpayScript();
      const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      // 2. Open official Razorpay modal if key and script are available
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
            // 3. Cryptographically verify signature on server before granting download access
            try {
              const verifyRes = await fetch('/api/razorpay/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(response),
              });

              const verifyData = await verifyRes.json();

              if (verifyRes.ok && verifyData.verified) {
                completeOrder(customerName, customerEmail);
              } else {
                setErrorMessage(verifyData.error || 'Payment signature verification failed. Please contact support.');
              }
            } catch (vErr: any) {
              setErrorMessage('Verification error: unable to validate payment signature with server.');
            } finally {
              setIsProcessing(false);
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
      } else if (orderData.mock) {
        // Safe development sandbox mode only
        setTimeout(() => {
          completeOrder(customerName, customerEmail);
          setIsProcessing(false);
        }, 1200);
      } else {
        throw new Error('Unable to connect to payment processor. Please verify network connection or try again.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err?.message || 'Payment initiation failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
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
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Error Alert */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              1. Delivery Information
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
                  placeholder="Alex Rivera"
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
                  placeholder="alex@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              2. Payment Method (via Razorpay Gateway)
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {/* UPI Option */}
              <button
                type="button"
                onClick={() => setPaymentTab('upi')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'upi'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                <span className="truncate">UPI / GPay</span>
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

              {/* NetBanking / Wallets Option */}
              <button
                type="button"
                onClick={() => setPaymentTab('netbanking')}
                className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  paymentTab === 'netbanking'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">NetBanking</span>
              </button>
            </div>

            {/* Gateway Details Banner */}
            <div className="p-4 rounded-xl bg-indigo-50/40 dark:bg-zinc-800/60 border border-indigo-200/80 dark:border-zinc-700 space-y-2 text-center">
              <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <span>⚡ Official Razorpay Encrypted Gateway</span>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {paymentTab === 'upi' && 'Instant checkout with Google Pay, PhonePe, Paytm, or any UPI App via QR code.'}
                {paymentTab === 'card' && 'Supports all Visa, MasterCard, RuPay, and American Express cards with 3D Secure OTP.'}
                {paymentTab === 'netbanking' && 'Direct secure payment through 50+ Indian and international banking portals.'}
              </p>
              <span className="inline-block text-[10px] text-zinc-400 font-mono">
                {process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ? '✓ Razorpay Active' : '● Test/Sandbox Mode Ready'}
              </span>
            </div>
          </div>

          {/* Order Summary Line */}
          <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/70 text-xs space-y-1">
            <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
              <span>{items.length} {items.length === 1 ? 'item' : 'items'} in order</span>
              {discountAmount > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  Promo {appliedPromo} applied (-{currency === 'INR' ? `₹${discountAmount.toLocaleString('en-IN')}` : `$${discountAmount.toFixed(2)}`})
                </span>
              )}
            </div>
            <div className="flex justify-between items-baseline pt-1">
              <span className="font-bold text-zinc-900 dark:text-white text-sm">Total Due Today:</span>
              <div className="text-right">
                <span className="font-extrabold text-indigo-600 dark:text-indigo-400 text-lg block">
                  {currency === 'INR' ? `₹${total.toLocaleString('en-IN')}` : `$${total.toFixed(2)}`}
                </span>
                {currency === 'USD' && (
                  <span className="text-[10px] text-zinc-500 font-mono">
                    (Charged as ₹{chargeAmountInr.toLocaleString('en-IN')} INR at checkout)
                  </span>
                )}
              </div>
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
                  Pay Securely with Razorpay ({currency === 'INR' ? `₹${total.toLocaleString('en-IN')}` : `$${total.toFixed(2)}`})
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
