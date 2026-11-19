'use client';

import React, { useState } from 'react';
import {
  FileSpreadsheet,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  Download,
  Sparkles,
  ArrowRight,
  Package,
  Check,
  Layers,
  Zap,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

const UNBOXING_ITEMS = [
  {
    id: 'xlsx-file',
    title: 'Personal Growth System (.xlsx)',
    category: 'Core Asset • 214 KB',
    badge: '16 Master Sheets',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    icon: FileSpreadsheet,
    iconColor: 'text-emerald-400 bg-emerald-500/10',
    description:
      'The complete production-grade Life OS spreadsheet. Pre-configured with native formulas, automated habit streak engine, 20-goal tracker, and zero external macros.',
    specs: ['214 KB .xlsx file', '16 Interconnected Tabs', '0 Macros (100% Safe)', 'Instant 0.1s Local Load'],
  },
  {
    id: 'pdf-guide',
    title: 'Quickstart Habit Protocol (.pdf)',
    category: 'Implementation Guide • 1.8 MB',
    badge: 'Step-by-Step',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    icon: BookOpen,
    iconColor: 'text-indigo-400 bg-indigo-500/10',
    description:
      '12-page tactical walkthrough guide. Shows you how to architect your morning routine, conduct Sunday reviews, and set up your system in under 3 minutes.',
    specs: ['12-Page Illustrated PDF', 'Sunday Review Blueprint', 'Habit Stacking Matrix', 'Mobile & iPad Optimized'],
  },
  {
    id: 'compatibility-pass',
    title: 'Universal Software Compatibility Pass',
    category: 'Multi-Platform • Excel & Sheets',
    badge: 'Universal Format',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    icon: CheckCircle2,
    iconColor: 'text-amber-400 bg-amber-500/10',
    description:
      'Engineered to function identically on Microsoft Excel (Desktop/Web/Mac/Windows), Google Sheets, Apple Numbers, and the official Excel mobile app.',
    specs: ['100% Formula Parity', 'Google Sheets 1-Click Import', 'Mac Numbers Compatible', 'iOS & Android Ready'],
  },
  {
    id: 'lifetime-license',
    title: 'Commercial Lifetime License & Updates',
    category: 'Legal Rights • Zero Subscriptions',
    badge: 'Forever Access',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    icon: ShieldCheck,
    iconColor: 'text-purple-400 bg-purple-500/10',
    description:
      'Full single-user lifetime license. Own the master template forever with free access to all future annual revisions, new tabs, and AI prompt expansions.',
    specs: ['No Monthly Subscription', 'Use for Personal & Client Work', 'Free Lifetime Updates', 'Direct Creator Email Support'],
  },
];

export const UnboxingCard: React.FC = () => {
  const [activeItem, setActiveItem] = useState(UNBOXING_ITEMS[0].id);
  const { products, getProductPrice, currency } = useStore();
  const { addToCart, openCheckout } = useCart();

  const flagshipProduct = products[0];
  const priceInfo = flagshipProduct ? getProductPrice(flagshipProduct) : null;
  const formattedPrice = priceInfo?.formattedPrice || (currency === 'INR' ? '₹10' : '$1');

  const handleUnboxPurchase = () => {
    if (flagshipProduct) {
      addToCart(flagshipProduct);
      openCheckout();
    }
  };

  return (
    <section id="unboxing" className="py-20 bg-zinc-950 text-white relative overflow-hidden border-b border-zinc-800">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-96 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-4 backdrop-blur-sm">
            <Package className="w-3.5 h-3.5 text-indigo-400" />
            <span>Digital Delivery Manifest • Zero Mystery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            What&apos;s Inside Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Download Package?
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            The exact files, setup blueprints, and master assets that land in your downloads folder within 5 seconds of checkout.
          </p>
        </div>

        {/* Master Unboxing Box Container */}
        <div className="rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-2xl p-6 sm:p-10 backdrop-blur-xl max-w-5xl mx-auto">
          
          {/* Top Unboxing Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-zinc-800 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Instant Fulfillment Archive (.zip & direct .xlsx)</h3>
                <p className="text-xs text-zinc-400">Delivered via immediate on-screen download + automated backup email link</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-semibold">
                ● 4 Items Included
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">Total Size: 2.1 MB</span>
            </div>
          </div>

          {/* 4 Interactive Item Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {UNBOXING_ITEMS.map((item) => {
              const Icon = item.icon;
              const isSelected = activeItem === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-indigo-950/40 via-zinc-900 to-zinc-900/90 border-indigo-500/60 shadow-lg shadow-indigo-500/10 -translate-y-0.5'
                      : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.iconColor}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-zinc-400 block">{item.category}</span>
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 grid grid-cols-2 gap-1.5 text-[11px] text-zinc-300 font-mono">
                    {item.specs.map((spec, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Action Strip */}
          <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs text-zinc-400 block">Complete 4-Asset Master Bundle:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white" suppressHydrationWarning>
                  {formattedPrice}
                </span>
                <span className="text-xs text-zinc-500 line-through">
                  {currency === 'INR' ? '₹99' : '$10'}
                </span>
                <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800/60">
                  Save 90%
                </span>
              </div>
            </div>

            <button
              onClick={handleUnboxPurchase}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Unbox Everything Now ({formattedPrice})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
