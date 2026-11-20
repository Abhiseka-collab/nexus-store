'use client';

import React, { useState } from 'react';
import { Star, CheckCircle, Quote, ThumbsUp, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatarText: string;
  avatarColor: string;
  rating: number;
  date: string;
  tag: 'Dev & Founder' | 'Habits & Streaks' | 'Students & Freelancers';
  badgeHighlight: string;
  quote: string;
  verified: boolean;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Arjun Mehta',
    role: 'Indie Hacker & Full-Stack Dev',
    location: 'Bengaluru, India',
    avatarText: 'AM',
    avatarColor: 'from-blue-600 to-indigo-600',
    rating: 5,
    date: '2 days ago',
    tag: 'Dev & Founder',
    badgeHighlight: 'Replaced ₹1,200/mo App Subscriptions',
    quote:
      'I was tired of sluggish web apps with monthly fees. This spreadsheet opens in 0.5s in Excel, my streak formulas calculate automatically, and my data stays 100% offline on my machine. At ₹10, the value is unbeatable.',
    verified: true,
  },
  {
    id: 'test-2',
    name: 'Sarah Lin',
    role: 'Product Designer & Freelancer',
    location: 'Singapore',
    avatarText: 'SL',
    avatarColor: 'from-purple-600 to-pink-600',
    rating: 5,
    date: '4 days ago',
    tag: 'Students & Freelancers',
    badgeHighlight: 'Complete Goal & Project Clarity',
    quote:
      'The 20-Goal Framework linked directly to quarterly projects and deep work logs is pure gold. It gives me executive-level clarity over both client deadlines and personal fitness without tool-switching fatigue.',
    verified: true,
  },
  {
    id: 'test-3',
    name: 'Devansh Patel',
    role: 'Med Student & Writer',
    location: 'Mumbai, India',
    avatarText: 'DP',
    avatarColor: 'from-emerald-600 to-teal-600',
    rating: 5,
    date: '1 week ago',
    tag: 'Habits & Streaks',
    badgeHighlight: '84-Day Consistent Habit Streak',
    quote:
      'The 2,000-day daily journal tab with built-in reflection prompts helped me maintain my longest study streak ever while prepping for boards. Simple, distraction-free, and imports seamlessly into Google Sheets.',
    verified: true,
  },
  {
    id: 'test-4',
    name: 'Marcus Vance',
    role: 'Bootstrapped SaaS Founder',
    location: 'Austin, TX',
    avatarText: 'MV',
    avatarColor: 'from-amber-600 to-orange-600',
    rating: 5,
    date: '1 week ago',
    tag: 'Dev & Founder',
    badgeHighlight: 'Institutional-Grade Spreadsheet',
    quote:
      'Most internet templates look pretty in marketing photos but fall apart when you actually enter data. The conditional formatting, protected formula ranges, and today hub here are engineered at a top finance level.',
    verified: true,
  },
  {
    id: 'test-5',
    name: 'Pooja Sharma',
    role: 'Growth Lead & Consultant',
    location: 'New Delhi, India',
    avatarText: 'PS',
    avatarColor: 'from-rose-600 to-red-600',
    rating: 5,
    date: '2 weeks ago',
    tag: 'Students & Freelancers',
    badgeHighlight: '5-Minute Sunday Planning Protocol',
    quote:
      'The 5-minute weekly review tab alone has saved me hours of Sunday anxiety. It forces you to prioritize 3 needle-moving weekly targets. Setup took under 3 minutes after downloading.',
    verified: true,
  },
  {
    id: 'test-6',
    name: 'Liam O’Connor',
    role: 'Operations Consultant',
    location: 'London, UK',
    avatarText: 'LO',
    avatarColor: 'from-cyan-600 to-blue-600',
    rating: 5,
    date: '2 weeks ago',
    tag: 'Habits & Streaks',
    badgeHighlight: 'Zero Cloud Sync Glitches',
    quote:
      'No logins, zero telemetry, no monthly charges, works on plane WiFi. Exactly what high-performance professionals actually need. Instant 5 stars.',
    verified: true,
  },
];

export const Testimonials: React.FC = () => {
  const [activeTag, setActiveTag] = useState<string>('All');
  const { openCheckout, addToCart } = useCart();
  const { products, currency, formatPrice } = useStore();

  const flagshipProduct = products[0];

  const filtered =
    activeTag === 'All'
      ? TESTIMONIALS
      : TESTIMONIALS.filter((t) => t.tag === activeTag);

  const handleQuickBuy = () => {
    if (flagshipProduct) {
      addToCart(flagshipProduct);
    }
    openCheckout();
  };

  return (
    <section id="reviews" className="py-20 bg-zinc-50 dark:bg-zinc-950/70 border-t border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Community Wall of Love</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Loved by Developers, Founders & Creators
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Real feedback from early adopters who replaced scattered productivity apps with one offline, unified Excel & Google Sheets operating system.
          </p>

          {/* Social Proof Aggregate Banner */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-xs">
            <div className="flex items-center gap-2">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <span className="font-bold text-zinc-900 dark:text-white">4.96 / 5.0</span>
              <span className="text-zinc-400">(128+ verified ratings)</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Offline & Private</span>
            </div>

            <div className="hidden sm:block w-px h-4 bg-zinc-200 dark:bg-zinc-800" />

            <div className="text-indigo-600 dark:text-indigo-400 font-semibold">
              Fair Launch Price: {currency === 'INR' ? '₹10' : '$1'}
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {['All', 'Dev & Founder', 'Habits & Streaks', 'Students & Freelancers'].map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                activeTag === tag
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md scale-105'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
              }`}
            >
              {tag === 'All' ? 'All Verified Reviews' : tag}
            </button>
          ))}
        </div>

        {/* Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with stars & badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">{item.date}</span>
                </div>

                {/* Highlight Badge */}
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-[11px] font-semibold mb-3">
                  {item.badgeHighlight}
                </div>

                {/* Review Text */}
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Footer */}
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-tr ${item.avatarColor} text-white flex items-center justify-center font-bold text-xs shadow-sm`}
                  >
                    {item.avatarText}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                      <span>{item.name}</span>
                      {item.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-500">{item.role}</div>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Conversion Action */}
        <div className="mt-14 max-w-xl mx-auto text-center p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 text-white shadow-xl shadow-indigo-600/20">
          <h3 className="text-lg font-bold">Ready to take control of your habits & goals?</h3>
          <p className="text-xs text-indigo-100 mt-1 mb-4">
            Get instant download access within 5 seconds. Microsoft Excel (.xlsx) + Google Sheets ready.
          </p>
          <button
            onClick={handleQuickBuy}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-indigo-600 hover:bg-zinc-100 font-bold text-xs shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            Unlock Complete 16-in-1 System Now — {currency === 'INR' ? '₹10 INR' : '$1 USD'} →
          </button>
          <div className="mt-2.5 text-[10px] text-indigo-200">
            Commercial Single-Seat License &bull; 100% Offline Ownership &bull; Instant Delivery
          </div>
        </div>

      </div>
    </section>
  );
};
