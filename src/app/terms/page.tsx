import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | NEXUS',
  description: 'NEXUS Terms of Service. Understand your license rights, commercial usage, and digital delivery terms.',
};

export default function TermsPage() {
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
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Product License</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white">
            Terms of Service
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Last Updated: November 19, 2026 • Effective Date: November 19, 2026
          </p>
        </div>

        <div className="prose dark:prose-invert prose-sm max-w-none space-y-8 text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing the website at <strong>NEXUS</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) or purchasing any digital asset (including spreadsheets, templates, and guides), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">2. Single-User Commercial License</h2>
            <p>
              Upon completing a purchase, you are granted a non-exclusive, perpetual, worldwide single-user license to download, customize, and use the digital product for:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li><strong>Personal Productivity:</strong> Tracking personal habits, daily journals, goals, and health protocols.</li>
              <li><strong>Internal Commercial Work:</strong> Managing personal projects, client roadmaps, and business operations for your own freelance or business activities.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">3. Prohibited Uses (Anti-Piracy)</h2>
            <p>You may <strong>NOT</strong>:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1.5">
              <li>Re-sell, sub-license, redistribute, or share the master <code>.xlsx</code> template or derivative copies on file-sharing sites, torrents, or public repositories.</li>
              <li>Claim original authorship or copyright over the proprietary template architecture or formula engine.</li>
              <li>Bundle the product into a competing digital template marketplace without written authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">4. Digital Delivery & Access</h2>
            <p>
              All products sold on NEXUS are delivered electronically via instantaneous download upon successful payment confirmation. Customers receive an on-screen download token and a backup receipt via email. No physical goods are shipped.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">5. Lifetime Updates</h2>
            <p>
              Your one-time purchase entitles you to free lifetime updates for the product purchased. When new tabs, formulas, or compatibility fixes are released, you may re-download the latest release at zero additional fee.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white mb-2">6. Governing Law & Support</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of India. For any licensing inquiries or contractual questions, contact{' '}
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
