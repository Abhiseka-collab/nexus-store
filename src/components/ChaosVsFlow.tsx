'use client';

import React from 'react';
import { X, Check, Sparkles, ArrowRight, Layers, Flame, Shield, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

const CHAOS_POINTS = [
  {
    title: 'Fragmented Across 6+ Apps',
    desc: 'Notion for notes, Todoist for tasks, Habitify for streaks, Excel for finance — endless tool-switching fatigue.',
  },
  {
    title: 'Expensive Recurring SaaS Subscriptions',
    desc: 'Paying $10 to $25 every single month for bloated web apps you barely use 20% of.',
  },
  {
    title: 'Slow Web Loading & Network Latency',
    desc: 'Spinning wheels and sluggish sync whenever your internet drops or servers experience downtime.',
  },
  {
    title: 'Your Personal Data on Third-Party Cloud',
    desc: 'Your private reflections, habits, and financial logs stored on corporate database servers.',
  },
  {
    title: 'Broken Streaks & Complex Databases',
    desc: 'Brittle relational databases that break when you try to customize or export your information.',
  },
];

const FLOW_POINTS = [
  {
    title: 'Single Unified Command Deck',
    desc: 'Habits, Daily Journal, 20-Goal Framework, Deep Work, and Projects connected in 1 master spreadsheet.',
  },
  {
    title: 'One-Time Purchase, Zero Subscriptions',
    desc: 'Buy once, keep forever. Free lifetime updates and zero recurring credit card charges.',
  },
  {
    title: 'Instant 0.1s Local Load Speed',
    desc: 'Opens instantly on desktop or mobile. Works 100% smoothly completely offline on flights or trains.',
  },
  {
    title: '100% Private, Local & Secure',
    desc: 'Zero telemetry, zero trackers, zero cloud leaks. Your data stays strictly on your machine.',
  },
  {
    title: 'Automated Native Excel / Sheets Formulas',
    desc: 'Built with rock-solid formulas (=COUNTIF, =INDEX, =MATCH) that never glitch or require maintenance.',
  },
];

export const ChaosVsFlow: React.FC = () => {
  const { products, getProductPrice } = useStore();
  const { addToCart, openCheckout } = useCart();

  const flagshipProduct = products[0];
  const priceInfo = flagshipProduct ? getProductPrice(flagshipProduct) : null;

  const handleBuy = () => {
    if (flagshipProduct) {
      addToCart(flagshipProduct);
      openCheckout();
    }
  };

  return (
    <section className="py-20 bg-zinc-950 text-white relative overflow-hidden border-b border-zinc-800">
      {/* Background Ambient Light */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>The Productivity Paradigm Shift</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Stop Renting Your Life OS.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Own It Forever.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Why high-output founders and creators are switching away from bloated SaaS subscriptions to native spreadsheets.
          </p>
        </div>

        {/* Comparison Split Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Card Left: The Chaos */}
          <div className="rounded-3xl bg-zinc-900/60 border border-rose-500/20 p-6 sm:p-8 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block font-mono">
                  The Old Way
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  The SaaS Chaos
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center font-bold">
                ✕
              </div>
            </div>

            <div className="space-y-4">
              {CHAOS_POINTS.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                  <div className="w-5 h-5 rounded-md bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">{pt.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 text-center">
              <span className="text-xs text-rose-400 font-mono font-medium">
                Average cost: ~$180 to $300 every single year
              </span>
            </div>
          </div>

          {/* Card Right: The Flow */}
          <div className="rounded-3xl bg-gradient-to-b from-indigo-950/40 via-zinc-900/90 to-zinc-950 border border-emerald-500/40 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            {/* Ambient accent banner */}
            <div className="absolute top-0 right-0 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-wider py-1 px-4 rounded-bl-xl shadow-md">
              Recommended
            </div>

            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block font-mono">
                  The NEXUS Way
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  The 16-in-1 Flow State
                </h3>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold">
                ✓
              </div>
            </div>

            <div className="space-y-4">
              {FLOW_POINTS.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/20 shadow-xs">
                  <div className="w-5 h-5 rounded-md bg-emerald-500 text-black flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{pt.title}</h4>
                    <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price & Buy Action */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-zinc-400 font-mono block">One-Time Payment • Own It Forever</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    {priceInfo?.formattedPrice || '₹489 / $13.30'}
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold">with code LAUNCH30</span>
                </div>
              </div>

              <button
                onClick={handleBuy}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <span>Switch to Flow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
