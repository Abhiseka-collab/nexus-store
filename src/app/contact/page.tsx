import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Clock, MessageSquare, Shield, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | NEXUS Support',
  description: 'Contact NEXUS Digital Store support for customer inquiries, file assistance, and licensing questions.',
};

export default function ContactPage() {
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Assistance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Contact Us
          </h1>
          <p className="text-sm text-zinc-500">
            Have questions about our spreadsheets, licensing, or need file delivery support? We are here to help.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
              Official Email Support
            </h3>
            <p className="text-xs text-zinc-500 mb-3">
              For order inquiries, download link resends, and feedback:
            </p>
            <a
              href="mailto:solution00000@outlook.com"
              className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              solution00000@outlook.com
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-1">
              Response SLA
            </h3>
            <p className="text-xs text-zinc-500 mb-2">
              We monitor incoming emails 7 days a week:
            </p>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
              ● Typically replied within 4 to 12 hours
            </span>
          </div>
        </div>

        {/* Common Help Questions */}
        <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <span>Frequent Inquiries</span>
          </h3>

          <div className="space-y-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            <div>
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                &ldquo;I purchased on mobile but want to open the file on my PC?&rdquo;
              </strong>
              <span>
                Your receipt email contains a persistent download link, or you can forward your order confirmation to our email and we will send a direct file link immediately.
              </span>
            </div>

            <div>
              <strong className="text-zinc-900 dark:text-white block mb-0.5">
                &ldquo;Does this work on Apple Numbers or Google Sheets?&rdquo;
              </strong>
              <span>
                Yes, the master template is formatted natively for Microsoft Excel (.xlsx) and imports smoothly with full formula parity into Google Sheets and Apple Numbers.
              </span>
            </div>
          </div>
        </div>

        {/* Legal & Entity Details */}
        <div className="mt-10 p-5 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 text-xs text-zinc-500 space-y-1">
          <p className="font-bold text-zinc-700 dark:text-zinc-300">NEXUS Digital Store</p>
          <p>Operated by independent digital creators &bull; Serving customers globally</p>
          <p>Jurisdiction: India &bull; Razorpay Certified Merchant Account</p>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
          <p>© 2026 NEXUS Store. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
