'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Heart, Send, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="text-base font-bold text-zinc-900 dark:text-white">
                NEXUS
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Curated, production-grade digital assets, habit operating systems, and spreadsheet engines built for high-output builders.
            </p>
            <div className="flex items-center gap-2 text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Razorpay Certified 256-Bit SSL Store</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Explore Catalog
            </h4>
            <ul className="space-y-2">
              <li><a href="/#products" className="hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-indigo-600 dark:text-indigo-400">16-in-1 Personal Growth System</a></li>
              <li><a href="/#spreadsheet-tour" className="hover:text-indigo-600 dark:hover:text-indigo-400">Interactive Spreadsheet Tour</a></li>
              <li><a href="/#unboxing" className="hover:text-indigo-600 dark:hover:text-indigo-400">What&apos;s In The Download Box</a></li>
              <li><a href="/#roi-calculator" className="hover:text-indigo-600 dark:hover:text-indigo-400">Time & Money ROI Calculator</a></li>
              <li><a href="/#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">Productivity System FAQ</a></li>
            </ul>
          </div>

          {/* Legal / Trust Policy Links (Required by Razorpay) */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Legal & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Terms of Service & License
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-indigo-600 dark:text-indigo-400">
                  Contact Us & Support Desk
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Discount Box */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Creator Weekly
            </h4>
            <p className="text-zinc-500 mb-3 text-[11px] leading-relaxed">
              Get notified of new drops and receive free weekly design assets & prompt templates.
            </p>

            {subscribed ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium text-xs">
                🎉 You are subscribed! Check your inbox for free gifts.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center justify-center transition-colors shadow-sm"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>© 2026 NEXUS DIGITAL. All rights reserved.</span>
            {/* Discrete Admin Link */}
            <Link
              href="/admin"
              className="text-zinc-300 dark:text-zinc-700 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
              title="Store Owner Portal"
              aria-label="Admin"
            >
              <Lock className="w-2.5 h-2.5" />
            </Link>
          </div>

          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for independent creators & developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
