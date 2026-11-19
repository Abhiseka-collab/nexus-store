'use client';

import React from 'react';
import { ArrowDown, Star, Sparkles, Download, CheckCircle2, Shield, RefreshCw } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
      {/* Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-medium mb-6 animate-fade-in shadow-xs">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span>Curated Digital Products for Creators & Founders</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          Supercharge your workflow with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            premium digital assets.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Complete 16-in-1 life operating systems, habit trackers, and high-performance digital tools. Ready to download in seconds.
        </p>

        {/* Authentic Trust Highlights */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/60">
            ⚡ Instant Excel (.xlsx) Download
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200 dark:border-indigo-800/60">
            🔒 100% Private & Offline
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700">
            🔄 Free Lifetime Updates
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Explore All Products</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#features"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm border border-zinc-200 dark:border-zinc-800 transition-all flex items-center justify-center gap-2"
          >
            <span>How Delivery Works</span>
          </a>
        </div>

        {/* Value Prop Badges */}
        <div className="mt-14 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
            <Download className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Instant Download</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Get files immediately upon checkout</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
            <RefreshCw className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Lifetime Updates</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Free access to future revisions</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Commercial License</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Use for client & commercial work</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50/50 dark:bg-zinc-900/30">
            <Shield className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">100% Guaranteed</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">30-day money-back policy</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
