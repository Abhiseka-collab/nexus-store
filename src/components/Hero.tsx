'use client';

import React from 'react';
import {
  ArrowDown,
  Sparkles,
  Download,
  CheckCircle2,
  Shield,
  RefreshCw,
  Flame,
  Zap,
  Lock,
  Layers,
  FileSpreadsheet,
  Monitor,
  Laptop,
  Smartphone,
  Check,
  TrendingUp,
  Percent,
  Clock,
  Target
} from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-200/60 dark:border-zinc-800/60">
      {/* Background Aurora Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[520px] bg-gradient-to-b from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-24 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-36 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Curated Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/70 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-semibold mb-6 animate-fade-in shadow-xs backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-indigo-500 animate-spin-slow" />
          <span>Curated Digital Products for High-Leverage Creators</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          Supercharge your workflow with{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            premium digital assets.
          </span>
        </h1>

        {/* Subhead */}
        <p className="mt-6 text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Complete 16-in-1 life operating systems, habit trackers, and high-performance digital tools. Built for ruthless clarity, ready in seconds.
        </p>

        {/* Trust Highlights */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/80 dark:border-emerald-800/70 shadow-xs">
            ⚡ Instant Excel (.xlsx) Download
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/70 shadow-xs">
            🔒 100% Private & Offline
          </span>
          <span className="hidden sm:inline text-zinc-300 dark:text-zinc-700">•</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 font-semibold border border-zinc-200 dark:border-zinc-700/80 shadow-xs">
            🔄 Free Lifetime Updates
          </span>
        </div>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#products"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
          >
            <span>Explore All Products</span>
            <ArrowDown className="w-4 h-4" />
          </a>
          <a
            href="#spreadsheet-tour"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white hover:bg-zinc-50 dark:bg-zinc-900/90 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-semibold text-sm border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Peek Inside 16-in-1 System →</span>
          </a>
        </div>

        {/* 3D Glassmorphic Showcase Mockup with Floating Badges */}
        <div className="mt-14 relative max-w-4xl mx-auto">
          {/* Ambient Glow behind card */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/25 to-pink-500/15 rounded-3xl blur-2xl -z-10" />

          {/* Floating Pill: Instant XLSX */}
          <div className="hidden sm:flex absolute -top-4 -left-4 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 shadow-xl text-xs font-semibold animate-float">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>⚡ Instant .XLSX Delivery (214 KB)</span>
          </div>

          {/* Floating Pill: Streak Engine */}
          <div className="hidden sm:flex absolute -top-4 -right-4 z-20 items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 backdrop-blur-md border border-amber-500/40 text-amber-300 shadow-xl text-xs font-semibold animate-float-delayed">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-flame-pulse" />
            <span>42-Day Streak Engine Active</span>
          </div>

          {/* Window Container */}
          <div className="rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800/90 shadow-2xl overflow-hidden text-left transition-all">
            {/* Window Titlebar */}
            <div className="bg-zinc-900/95 px-4 py-3 border-b border-zinc-800/90 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 text-xs font-mono text-zinc-300 font-medium hidden sm:inline">
                  Personal_Growth_System_2026.xlsx — Executive Command Deck
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                  v2.4 Production Ready
                </span>
              </div>
            </div>

            {/* Formula Bar */}
            <div className="bg-zinc-900/50 px-4 py-2 border-b border-zinc-800/60 flex items-center gap-3 text-xs font-mono">
              <span className="font-bold text-indigo-400 shrink-0">fx</span>
              <div className="h-3 w-px bg-zinc-800" />
              <span className="text-zinc-400 truncate">
                =IF(AND(HABITS_DONE&gt;=5, TASKS_DONE&gt;=2), &quot;🔥 Peak Flow State&quot;, &quot;Focus Mode Active&quot;)
              </span>
            </div>

            {/* Preview Sheet Grid */}
            <div className="p-4 sm:p-6 bg-gradient-to-b from-zinc-950 to-zinc-900/40 space-y-4">
              {/* Metric Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-medium block">Habit Consistency</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl font-black text-amber-400">42 Days</span>
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full w-[88%]" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-medium block">Weekly Adherence</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl font-black text-emerald-400">94.2%</span>
                    <Percent className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full w-[94%]" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-medium block">Deep Work Logged</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl font-black text-purple-400">34.5 hrs</span>
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-400 h-full rounded-full w-[85%]" />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-zinc-900/80 border border-zinc-800">
                  <span className="text-[10px] text-zinc-400 font-medium block">Active Q1 Goals</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xl font-black text-indigo-400">4 / 4 Tracked</span>
                    <Target className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full w-[78%]" />
                  </div>
                </div>
              </div>

              {/* Sample Interconnected Row */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-black">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-zinc-200 font-medium truncate">
                    Finish & export Personal Growth System master template
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-indigo-300">P1 Urgent</span>
                  <span>Category: Craft & Impact</span>
                </div>
              </div>
            </div>

            {/* Bottom System Bar */}
            <div className="bg-zinc-950 px-4 py-2.5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 font-mono gap-2">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-zinc-300">16 Interconnected Sheets</span>
                <span className="text-zinc-600">•</span>
                <span>Hub, Habits, Goals, Projects, Backlog, AI Prompts</span>
              </div>
              <a
                href="#spreadsheet-tour"
                className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 font-sans font-semibold text-xs"
              >
                <span>Interactive Live Demo</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Ecosystem Compatibility Strip */}
        <div className="mt-10 max-w-3xl mx-auto pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <p className="text-xs uppercase font-bold tracking-wider text-zinc-500 dark:text-zinc-400 mb-4">
            Engineered for 100% Compatibility Across Your Favorite Tools
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 font-bold text-xs">
                XL
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">MS Excel</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Windows & Mac</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0 font-bold text-xs">
                GS
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">Google Sheets</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">100% Formula Parity</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center shrink-0">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">Apple Numbers</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">Mac & iPad Native</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/70 dark:border-zinc-800/80 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-zinc-900 dark:text-white">Mobile Apps</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">iOS & Android Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Prop Badges */}
        <div className="mt-12 pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-indigo-500/40 transition-colors">
            <Download className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Instant Download</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Get files immediately upon checkout</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-indigo-500/40 transition-colors">
            <RefreshCw className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Lifetime Updates</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Free access to future revisions</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-emerald-500/40 transition-colors">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-zinc-900 dark:text-white">Commercial License</div>
              <div className="text-[11px] text-zinc-500 dark:text-zinc-400">Use for client & commercial work</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 hover:border-indigo-500/40 transition-colors">
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