'use client';

import React from 'react';
import { ExternalLink, Video, Sparkles, MessageCircle, ArrowRight } from 'lucide-react';

interface Channel {
  name: string;
  platform: 'YouTube' | 'Instagram' | 'X (Twitter)';
  handle: string;
  description: string;
  badge: string;
  url: string;
  color: string;
  btnText: string;
  iconSvg: React.ReactNode;
}

const CHANNELS: Channel[] = [
  {
    name: 'NEXUS Studio',
    platform: 'YouTube',
    handle: '@nexusdigitalstore',
    description:
      'Step-by-step spreadsheet tutorials, habit streak guides, and deep-dive walkthroughs of the 16-in-1 Personal Growth System.',
    badge: 'Video Masterclasses',
    url: 'https://youtube.com',
    color: 'from-rose-500/20 to-red-500/10 border-red-500/30 text-rose-500',
    btnText: 'Subscribe on YouTube',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    name: 'nexus.growth',
    platform: 'Instagram',
    handle: '@nexus.growth',
    description:
      'Daily habit accountability prompts, productivity reels, streak motivation, and early-bird discount codes for new drops.',
    badge: 'Daily Reels & Tips',
    url: 'https://instagram.com',
    color: 'from-fuchsia-500/20 to-pink-500/10 border-pink-500/30 text-pink-500',
    btnText: 'Follow on Instagram',
    iconSvg: (
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: '@nexus_growth',
    platform: 'X (Twitter)',
    handle: '@nexus_growth',
    description:
      'High-signal productivity breakdowns, build-in-public metrics, Excel automation tips, and direct creator updates.',
    badge: 'Insights & Updates',
    url: 'https://x.com',
    color: 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-400',
    btnText: 'Follow on X',
    iconSvg: (
      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

export const CommunityChannels: React.FC = () => {
  return (
    <section id="community" className="py-20 bg-zinc-900/40 dark:bg-zinc-950/40 border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Official Community Channels</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
            Follow Our Channels for Free Tutorials & Drop Updates
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            Get spreadsheet walkthroughs on YouTube, daily habit prompts on Instagram, and direct creator announcements on X.
          </p>
        </div>

        {/* 3 Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {CHANNELS.map((ch) => (
            <div
              key={ch.platform}
              className={`p-6 rounded-3xl bg-gradient-to-b ${ch.color} bg-white dark:bg-zinc-900 border backdrop-blur-sm shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group`}
            >
              <div>
                {/* Header with Icon and Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    {ch.iconSvg}
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/80 dark:bg-zinc-800/80 font-bold border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300">
                    {ch.badge}
                  </span>
                </div>

                {/* Platform & Name */}
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <span>{ch.platform}</span>
                </h3>
                <span className="text-xs font-mono text-zinc-500 block mb-3">{ch.handle}</span>

                {/* Description */}
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {ch.description}
                </p>
              </div>

              {/* Action Button */}
              <a
                href={ch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 shadow-sm transition-all group-hover:translate-x-0.5"
              >
                <span>{ch.btnText}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          ))}
        </div>

        {/* Video Tour Teaser Bar */}
        <div className="mt-12 max-w-3xl mx-auto p-4 sm:p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white">
                New YouTube Walkthrough: 16 Tabs in 5 Minutes
              </h4>
              <p className="text-[11px] text-zinc-500">
                Watch how the executive hub links your 20 goals to daily habit streaks.
              </p>
            </div>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-sm"
          >
            <span>Watch Demo Video</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};
