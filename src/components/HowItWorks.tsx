'use client';

import React from 'react';
import { MousePointerClick, ShieldCheck, DownloadCloud, Sparkles } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    title: 'Select Your Digital Asset',
    desc: 'Browse our curated catalog of production-ready templates, design systems, guides, or code boilerplates. Preview specs and included files before buying.',
    icon: MousePointerClick,
  },
  {
    step: '02',
    title: '1-Click Encrypted Checkout',
    desc: 'Complete payment securely via Apple Pay, Google Pay, or Credit Card. All checkouts are processed with 256-bit bank grade encryption.',
    icon: ShieldCheck,
  },
  {
    step: '03',
    title: 'Instant File Delivery',
    desc: 'No waiting. You are redirected immediately to your download dashboard, plus we dispatch an automated email with lifetime backup links.',
    icon: DownloadCloud,
  },
  {
    step: '04',
    title: 'Free Lifetime Updates',
    desc: 'Whenever assets receive updates, new Figma components, or Next.js version bumps, re-download the latest release at zero extra cost.',
    icon: Sparkles,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-zinc-50/60 dark:bg-zinc-950/60 border-y border-zinc-200/60 dark:border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Frictionless Delivery
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mt-2">
            How Digital Purchases Work
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Built from the ground up for zero friction, instant access, and lifelong reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black font-mono text-zinc-300 dark:text-zinc-700">
                      {step.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
