'use client';

import React, { useState } from 'react';
import { Zap, ShieldCheck, Heart, Send } from 'lucide-react';

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
                NEXUS DIGITAL
              </span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Curated, production-grade digital assets, boilerplates, and design systems built for high-output builders.
            </p>
            <div className="flex items-center gap-2 text-zinc-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified 256-Bit SSL Store</span>
            </div>
          </div>

          {/* Catalog Links */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Categories
            </h4>
            <ul className="space-y-2">
              <li><a href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Notion Templates</a></li>
              <li><a href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Design Systems & 3D</a></li>
              <li><a href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Solo Founder Playbooks</a></li>
              <li><a href="#products" className="hover:text-indigo-600 dark:hover:text-indigo-400">Developer Starter Kits</a></li>
            </ul>
          </div>

          {/* Legal / Trust Links */}
          <div>
            <h4 className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px] mb-3">
              Guarantees & Policy
            </h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">Commercial License Terms</a></li>
              <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">30-Day Money Back Policy</a></li>
              <li><a href="#faq" className="hover:text-indigo-600 dark:hover:text-indigo-400">Instant Digital Delivery FAQ</a></li>
              <li><a href="mailto:support@nexus-digital.io" className="hover:text-indigo-600 dark:hover:text-indigo-400">Support Desk</a></li>
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
          <div>
            © 2026 NEXUS DIGITAL. All rights reserved.
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
