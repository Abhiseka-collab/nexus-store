import React from 'react';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, CheckCircle2, Shield } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cancellation & Refund Policy | NEXUS',
  description: 'NEXUS 30-Day Money-Back Guarantee and Cancellation Policy. Learn how refunds are processed.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>

        <div className="space-y-4 mb-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Customer Satisfaction Guarantee</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Cancellation & Refund Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: November 19, 2026 • Effective Date: November 19, 2026
          </p>
        </div>

        <div className="prose dark:prose-invert prose-sm max-w-none space-y-8 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">1. 30-Day Full Refund Guarantee</h2>
            <p>
              We want you to be 100% satisfied with your digital purchase from <strong>NEXUS</strong>. Even though our products are downloadable digital goods (such as the <em>Personal Growth System</em> spreadsheet), we offer a full <strong>30-day money-back guarantee</strong>.
            </p>
            <p className="mt-2">
              If the spreadsheet template does not work with your version of Microsoft Excel or Google Sheets, or if you are unsatisfied with the system for any reason within 30 days of purchase, you are entitled to a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">2. How to Request a Refund</h2>
            <p>To request a refund, follow these simple steps:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1.5">
              <li>Send an email to{' '}
                <a href="mailto:solution00000@outlook.com" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">
                  solution00000@outlook.com
                </a>{' '}
                from the email address used during purchase.
              </li>
              <li>Include your <strong>Order ID</strong> (found in your email receipt or on-screen confirmation) or payment reference number.</li>
              <li>A brief reason for your return (optional, but helpful for us to improve the product).</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">3. Refund Processing & Timelines</h2>
            <p>
              Once your refund request is received, it will be reviewed and processed within <strong>24 to 48 hours</strong>.
            </p>
            <p className="mt-2">
              Refunds are credited directly back to the original source of payment through Razorpay:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>UPI (Google Pay, PhonePe, Paytm):</strong> Typically credited within 2 to 24 hours.</li>
              <li><strong>Credit / Debit Cards:</strong> Typically reflects on your bank statement within 5 to 7 business days, depending on your card issuer.</li>
              <li><strong>NetBanking:</strong> Processed within 2 to 4 business days.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">4. Order Cancellations</h2>
            <p>
              Since all digital downloads are fulfilled immediately and automatically upon payment authorization, orders cannot be cancelled before delivery. However, our 30-day money-back guarantee covers you completely after receipt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">5. Need Help With Your Files?</h2>
            <p>
              If you experienced a technical issue opening your <code>.xlsx</code> file or importing into Google Sheets, our support team can help you resolve it immediately without needing to refund. Email{' '}
              <a href="mailto:solution00000@outlook.com" className="text-indigo-600 dark:text-indigo-400 font-semibold underline">
                solution00000@outlook.com
              </a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <p>© 2026 NEXUS Store. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
