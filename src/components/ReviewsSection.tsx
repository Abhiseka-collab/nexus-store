'use client';

import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Sarah Jenkins',
    role: 'Freelance Product Designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    title: 'Cut my design sprint in half',
    text: 'The Figma SaaS UI Kit is easily the highest-quality design system I have ever purchased. Every variant is clean, auto-layout is flawless, and the tokens make theming a breeze.',
    productBought: 'SaaS UI Kit & Design System',
  },
  {
    name: 'Marcus Chen',
    role: 'Indie Hacker & Solopreneur',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    title: 'Shipped my MVP in one weekend',
    text: 'I bought the Next.js starter kit on a Friday night and had my paid tool launched by Sunday afternoon. Auth and Stripe billing worked out of the box with zero debugging.',
    productBought: 'Micro-SaaS Next.js 15 Starter Kit',
  },
  {
    name: 'Elena Rostova',
    role: 'YouTuber & Course Creator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    stars: 5,
    title: 'My entire business runs on this Notion OS',
    text: 'I was drowning in scattered Google Docs and Trello boards. The Creator Second Brain brought order to my YouTube scripts, sponsorship pipeline, and weekly revenue.',
    productBought: 'Creator Second Brain OS',
  },
];

export const ReviewsSection: React.FC = () => {
  return (
    <section id="reviews" className="py-20 border-b border-zinc-200/60 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Real Creator Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-white mt-2">
            Loved by builders, designers, and solopreneurs
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            See how creators use our templates and codekits to save hundreds of hours of repetitive work.
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, i) => (
            <div
              key={i}
              className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                {/* Rating & Product pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(rev.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full truncate max-w-[140px]">
                    {rev.productBought}
                  </span>
                </div>

                <Quote className="w-7 h-7 text-indigo-200 dark:text-indigo-950 mb-2" />
                
                <h4 className="font-bold text-sm text-zinc-900 dark:text-white mb-1.5">
                  &ldquo;{rev.title}&rdquo;
                </h4>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {rev.text}
                </p>
              </div>

              {/* Author Info */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-zinc-900 dark:text-white">{rev.name}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400 block">{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
