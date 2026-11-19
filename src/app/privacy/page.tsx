import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | NEXUS',
  description: 'NEXUS Privacy Policy. Learn how we handle your data, payments, and 100% offline file delivery.',
};

export default function PrivacyPage() {
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
            <Shield className="w-3.5 h-3.5" />
            <span>Privacy-First Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: November 19, 2026 • Effective Date: November 19, 2026
          </p>
        </div>

        <div className="prose dark:prose-invert prose-sm max-w-none space-y-8 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">1. Overview & Core Philosophy</h2>
            <p>
              At <strong>NEXUS</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we prioritize user privacy above all else. Our flagship spreadsheet products (including the <em>Personal Growth System</em>) are built to function <strong>100% offline</strong> directly on your local device. We do not track, upload, or inspect your personal habits, finances, journal entries, or goal frameworks.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">2. Information We Collect</h2>
            <p>When you purchase digital assets from NEXUS, we collect only the minimal data required to fulfill your order:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Contact Information:</strong> Your email address and optional name, used exclusively to deliver your download link, send purchase receipts, and provide customer support.</li>
              <li><strong>Transaction Identifiers:</strong> Razorpay payment and order IDs generated during checkout for bookkeeping, refunds, and fraud prevention.</li>
              <li><strong>Technical Logs:</strong> Standard web analytics (referrer source, country-level geography) to monitor website performance and prevent unauthorized automated abuse.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">3. Payment Security & Processing</h2>
            <p>
              We do not store or have access to your full credit card numbers, CVVs, or UPI PINs. All financial transactions are processed securely through <strong>Razorpay Software Private Limited</strong>, a PCI-DSS Level 1 certified payment aggregator compliant with RBI regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">4. Your Offline Spreadsheet Data</h2>
            <p>
              Unlike cloud-hosted SaaS tools (Notion, Todoist, etc.), the <strong>.xlsx master spreadsheets</strong> you download run entirely locally in your copy of Microsoft Excel, Google Sheets, or Apple Numbers. Your journal entries, streak milestones, and task backlogs remain strictly on your machine.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">5. Third-Party Sharing</h2>
            <p>
              We will never sell, rent, or monetize your personal information to third-party data brokers or advertisers. Data is shared strictly with operational providers required to deliver the service (e.g. Razorpay for payments, Vercel for web hosting).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">6. Contact & Data Deletion</h2>
            <p>
              If you wish to request the deletion of your purchase record or have questions regarding this Privacy Policy, please email our support desk at{' '}
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
