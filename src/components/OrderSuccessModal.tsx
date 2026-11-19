'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Key, Mail, Sparkles, X, ExternalLink } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/SafeImage';

export const OrderSuccessModal: React.FC = () => {
  const { isSuccessOpen, closeSuccess, latestOrder } = useCart();

  useEffect(() => {
    if (isSuccessOpen) {
      // Fire celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    }
  }, [isSuccessOpen]);

  if (!isSuccessOpen || !latestOrder) return null;

  // Real file download
  const handleDownload = (productTitle: string, filename: string) => {
    // If delivering real spreadsheet asset
    if (filename.endsWith('.xlsx')) {
      const link = document.createElement('a');
      link.href = `/downloads/${filename}`;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const dummyContent = `=====================================================
NEXUS - PRODUCT DELIVERY & LICENSE
=====================================================

Product: ${productTitle}
Order ID: ${latestOrder.id}
Customer: ${latestOrder.customerName} (${latestOrder.customerEmail})
Purchase Date: ${latestOrder.createdAt}
License Token: ${latestOrder.downloadToken}
License Type: Commercial Single-Seat License

Thank you for your purchase!
Your files and access links are active and permanently backed up.

Support: solution00000@outlook.com

=====================================================
`;
    const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.zip') || filename.endsWith('.pdf') ? filename : `${filename}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeSuccess}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Celebration */}
        <div className="p-8 text-center bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-transparent border-b border-zinc-100 dark:border-zinc-800">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/25 mb-4 animate-scale-in">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Payment Successful
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white">
            Thank you for your order!
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-sm mx-auto">
            Your files are ready to download immediately. A receipt and download backup link have been sent to{' '}
            <strong className="text-zinc-900 dark:text-white">{latestOrder.customerEmail}</strong>.
          </p>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs font-mono text-zinc-600 dark:text-zinc-300">
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            <span>Order Reference: {latestOrder.id}</span>
          </div>
        </div>

        {/* Deliverables List */}
        <div className="p-6 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 flex items-center justify-between">
            <span>Your Digital Downloads ({latestOrder.items.length})</span>
            <span className="text-emerald-600 dark:text-emerald-400 lowercase font-normal text-[11px]">
              Ready for instant download
            </span>
          </h4>

          <div className="space-y-3">
            {latestOrder.items.map(({ product }) => (
              <div
                key={product.id}
                className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SafeImage
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <h5 className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                      {product.title}
                    </h5>
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                      <span>{product.fileFormat}</span>
                      <span>•</span>
                      <span>{product.fileSize}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(product.title, product.sampleDownloadName)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 shrink-0 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Now</span>
                </button>
              </div>
            ))}
          </div>

          {/* Email Notice Card */}
          <div className="p-4 rounded-xl bg-zinc-100/60 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-800 flex items-start gap-3 text-xs text-zinc-600 dark:text-zinc-400">
            <Mail className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-zinc-900 dark:text-white block">
                Lifetime Backup Link
              </span>
              <span>
                You can re-download these files at any time via the link sent to your email. No expiration date.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-zinc-500">
            Questions? Contact <a href="mailto:solution00000@outlook.com" className="text-indigo-600 font-medium">solution00000@outlook.com</a>
          </span>
          <button
            onClick={closeSuccess}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  );
};
