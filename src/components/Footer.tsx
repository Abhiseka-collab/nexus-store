'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, ShieldCheck, Heart, Send, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, hp_company: honeypot }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSubscribed(true);
        setSubscribeMessage(data.message || '🎉 You are subscribed! Check your inbox soon.');
        setEmail('');
      } else {
        setErrorMessage(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch {
      setErrorMessage('Network connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
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

            {/* Social Channels */}
            <div className="pt-1 flex items-center gap-2">
              <a
                href="https://www.youtube.com/channel/UCW1WS0KvSlQsmQ4w6FmZu_w"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-rose-500 hover:border-rose-500/40 transition-colors"
                title="Watch Tutorials on YouTube (@__NEXUS)"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              <a
                href="https://www.instagram.com/nexu.s2207"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-pink-500 hover:border-pink-500/40 transition-colors"
                title="Follow on Instagram (@nexu.s2207)"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
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
                {subscribeMessage}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                {/* Honeypot field hidden from real humans */}
                <input
                  type="text"
                  name="hp_company"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold text-xs flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <Send className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-[11px] text-rose-500 dark:text-rose-400">{errorMessage}</p>
                )}
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
