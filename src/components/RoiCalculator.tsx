'use client';

import React, { useState } from 'react';
import { Clock, TrendingUp, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, DollarSign } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { useCart } from '@/context/CartContext';

export const RoiCalculator: React.FC = () => {
  const { currency, products, getProductPrice } = useStore();
  const { addToCart, openCheckout } = useCart();

  const [weeklyHours, setWeeklyHours] = useState(5);
  const [monthlySaaSUsd, setMonthlySaaSUsd] = useState(25);
  const [monthlySaaSInr, setMonthlySaaSInr] = useState(1999);

  const flagshipProduct = products[0];
  const priceInfo = flagshipProduct ? getProductPrice(flagshipProduct) : null;

  const currentMonthlySaaS = currency === 'INR' ? monthlySaaSInr : monthlySaaSUsd;
  const annualSaaSCost = currentMonthlySaaS * 12;
  const annualHoursSaved = Math.round(weeklyHours * 52 * 0.65); // 65% efficiency reclaimed

  const formattedAnnualCost =
    currency === 'INR'
      ? `₹${annualSaaSCost.toLocaleString('en-IN')}`
      : `$${annualSaaSCost.toLocaleString('en-US')}`;

  const formattedFiveYearCost =
    currency === 'INR'
      ? `₹${(annualSaaSCost * 5).toLocaleString('en-IN')}`
      : `$${(annualSaaSCost * 5).toLocaleString('en-US')}`;

  const handleInstantBuy = () => {
    if (flagshipProduct) {
      addToCart(flagshipProduct);
      openCheckout();
    }
  };

  return (
    <section id="roi-calculator" className="py-20 relative overflow-hidden bg-zinc-950 text-white border-b border-zinc-800/80">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive Value Calculator • Know Your Numbers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Calculate How Much Time & Money You{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Reclaim Each Year.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Drag the sliders below to see the compounding leverage of replacing bloated monthly SaaS subscriptions with a lightning-fast, 100% offline master spreadsheet.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          
          {/* Controls Column (7 Cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-zinc-900/80 border border-zinc-800 p-6 sm:p-8 backdrop-blur-xl space-y-8 shadow-xl">
            {/* Slider 1: Hours */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-400" />
                  <span>Weekly hours lost to planning & tool-switching:</span>
                </label>
                <span className="text-lg font-black font-mono text-indigo-400 px-3 py-1 rounded-xl bg-indigo-950/80 border border-indigo-800/60">
                  {weeklyHours} hrs/wk
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={1}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-2">
                <span>1 hr (Light)</span>
                <span>5 hrs (Average Founder)</span>
                <span>15 hrs (Heavy Clutter)</span>
              </div>
            </div>

            {/* Slider 2: Monthly SaaS Subscriptions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Monthly spend on productivity apps (Notion, Todoist, etc.):</span>
                </label>
                <span className="text-lg font-black font-mono text-emerald-400 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-800/60">
                  {currency === 'INR' ? `₹${monthlySaaSInr}/mo` : `$${monthlySaaSUsd}/mo`}
                </span>
              </div>

              {currency === 'INR' ? (
                <input
                  type="range"
                  min={0}
                  max={6000}
                  step={200}
                  value={monthlySaaSInr}
                  onChange={(e) => setMonthlySaaSInr(Number(e.target.value))}
                  className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              ) : (
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={monthlySaaSUsd}
                  onChange={(e) => setMonthlySaaSUsd(Number(e.target.value))}
                  className="w-full h-2.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              )}

              <div className="flex justify-between text-[11px] text-zinc-500 font-mono mt-2">
                <span>{currency === 'INR' ? '₹0/mo' : '$0/mo'}</span>
                <span>{currency === 'INR' ? '₹2,000/mo' : '$25/mo'}</span>
                <span>{currency === 'INR' ? '₹6,000+/mo' : '$80+/mo'}</span>
              </div>
            </div>

            {/* Real-world benefits strip */}
            <div className="pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero monthly fees forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Opens in 0.1s without web lag</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Offline & strictly private</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Universal .xlsx (Excel & Sheets)</span>
              </div>
            </div>
          </div>

          {/* Results Column (5 Cols) */}
          <div className="lg:col-span-5 rounded-3xl bg-gradient-to-br from-indigo-950/70 via-zinc-900 to-zinc-950 border border-indigo-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 block mb-1">
              Your Annual Compounding Gain
            </span>
            <div className="mt-4 space-y-4">
              {/* Stat 1: Hours */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-xs text-zinc-400 block font-medium">Reclaimed Deep Work Time</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{annualHoursSaved}</span>
                  <span className="text-sm font-semibold text-emerald-400">Hours / Year</span>
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Equivalent to ~{Math.round(annualHoursSaved / 8)} full 8-hour workdays reclaimed
                </span>
              </div>

              {/* Stat 2: Money Saved */}
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-xs text-zinc-400 block font-medium">Recurring SaaS Fees Saved</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400">{formattedAnnualCost}</span>
                  <span className="text-sm font-semibold text-zinc-400">/ Year</span>
                </div>
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  5-year recurring cost avoided: <strong className="text-zinc-300">{formattedFiveYearCost}</strong>
                </span>
              </div>

              {/* Stat 3: One-time investment */}
              <div className="pt-2 flex items-center justify-between text-xs text-zinc-300">
                <span>One-Time System Investment:</span>
                <span className="font-mono font-bold text-base text-white">
                  {priceInfo?.formattedPrice || (currency === 'INR' ? '₹489' : '$13.30')}
                </span>
              </div>
            </div>

            {/* Action CTA */}
            <button
              onClick={handleInstantBuy}
              className="mt-6 w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <span>Get 16-in-1 System with Code LAUNCH30</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-[10px] text-zinc-500 mt-2">
              Instant .XLSX download • 30-day money-back guarantee
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
