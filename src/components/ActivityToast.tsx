'use client';

import React, { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';

interface ActivityItem {
  location: string;
  action: string;
  timeAgo: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    location: 'Bengaluru, India',
    action: 'downloaded 16-in-1 Personal Growth System (.xlsx)',
    timeAgo: '2m ago',
  },
  {
    location: 'San Francisco, USA',
    action: 'applied discount code LAUNCH30',
    timeAgo: '6m ago',
  },
  {
    location: 'London, UK',
    action: 'unlocked 16-in-1 Life OS with lifetime updates',
    timeAgo: '11m ago',
  },
  {
    location: 'Mumbai, India',
    action: 'downloaded Personal Growth System via Razorpay UPI',
    timeAgo: '15m ago',
  },
  {
    location: 'Berlin, Germany',
    action: 'started 42-day habit streak on Google Sheets',
    timeAgo: '22m ago',
  },
];

export const ActivityToast: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || dismissed) return;

    // Show initial toast after 3 seconds
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Rotate toasts every 14 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % ACTIVITIES.length);
        setIsVisible(true);
      }, 600);
    }, 14000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [mounted, dismissed]);

  if (!mounted || dismissed) return null;

  const current = ACTIVITIES[index];

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 transition-all duration-500 transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
      }`}
      suppressHydrationWarning
    >
      <div className="flex items-center gap-3 p-3.5 pr-4 rounded-2xl bg-zinc-900/90 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 shadow-2xl max-w-sm text-left">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 fill-emerald-400" />
        </div>

        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white truncate">
              Someone in {current.location}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono shrink-0">
              {current.timeAgo}
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 truncate mt-0.5">
            {current.action}
          </p>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          title="Dismiss notification"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
