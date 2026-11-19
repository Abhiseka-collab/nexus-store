'use client';

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Flame,
  CalendarCheck,
  CalendarDays,
  Target,
  FolderGit2,
  CheckSquare,
  Bot,
  BookOpen,
  Wallet,
  Dumbbell,
  Lightbulb,
  Compass,
  FileSpreadsheet,
  Check,
  Copy,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Shield,
  Layers,
  Clock,
  TrendingUp,
  Percent
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';

type TabId =
  | 'hub'
  | 'journal'
  | 'habits'
  | 'goals'
  | 'planner'
  | 'projects'
  | 'tasks'
  | 'ai-prompts';

interface TabSpec {
  id: TabId;
  name: string;
  category: 'Dashboards' | 'Execution' | 'Life & AI';
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  tagline: string;
  description: string;
  formulaCallout: string;
}

const TABS: TabSpec[] = [
  {
    id: 'hub',
    name: 'OS Hub',
    category: 'Dashboards',
    badge: 'Executive Command Center',
    icon: LayoutDashboard,
    tagline: 'Your morning cockpit. Links today’s habits, top priorities, and streak stats.',
    description: 'The central command deck of your Life OS. Automatically syncs with your Daily Journal and Habit Tracker to show your real-time streak, weekly milestone pace, and today’s Big 3 focus tasks in one distraction-free dashboard.',
    formulaCallout: '=IF(AND(HABITS_DONE>=5, TASKS_DONE>=2), "🔥 Peak Flow State", "Focus Mode Active")',
  },
  {
    id: 'journal',
    name: 'Daily Journal',
    category: 'Dashboards',
    badge: '2,000+ Days Logging',
    icon: CalendarCheck,
    tagline: 'Morning intentions, deep work tracker, energy score, and evening reflection.',
    description: 'Designed for high performers who want structured clarity in 3 minutes a day. Log morning priorities, track deep work hours, rate daily energy (1–10), and capture daily wins with zero clutter.',
    formulaCallout: '=AVERAGEIFS(DailyLog!E:E, DailyLog!A:A, ">="&TODAY()-7)',
  },
  {
    id: 'habits',
    name: 'Habit Tracker',
    category: 'Dashboards',
    badge: 'Automated Streak Engine',
    icon: Flame,
    tagline: 'Month-by-month consistency grid with auto-calculated streak badges.',
    description: '31-day visual heatmap matrix across your 7 high-leverage habits. Calculates your monthly completion percentage, longest active streak, and overall life momentum without slow web app loading times.',
    formulaCallout: '=COUNTIF(HabitMatrix!D5:AH5, "✓") / 31 * 100 & "% Adherence"',
  },
  {
    id: 'goals',
    name: '20-Goal Framework',
    category: 'Execution',
    badge: '4 Pillars of Life',
    icon: Target,
    tagline: 'Yearly themes linked to 20 measurable goals with progress bar visuals.',
    description: 'Structure your ambition across Health, Wealth, Craft, and Impact. Every goal is broken down into quantifiable key results with dynamic ASCII progress bars that update as you log milestones.',
    formulaCallout: '=REPT("█", INT(Goal_Progress*10)) & REPT("░", 10-INT(Goal_Progress*10))',
  },
  {
    id: 'planner',
    name: 'Weekly Planner',
    category: 'Dashboards',
    badge: '5-Minute Sunday Protocol',
    icon: CalendarDays,
    tagline: 'Audit the past 7 days and architect your upcoming week before Monday starts.',
    description: 'Eliminate Monday morning overwhelm. Review your habit consistency, score your energy across the week, set your 3 non-negotiable weekly objectives, and time-block focus blocks.',
    formulaCallout: '=SUMIFS(DeepWorkHours, WeekNumber, THIS_WEEK)',
  },
  {
    id: 'projects',
    name: 'Active Projects',
    category: 'Execution',
    badge: 'Multi-Project Roadmaps',
    icon: FolderGit2,
    tagline: 'Track active product launches, client deliverables, and personal roadmaps.',
    description: 'Bird’s-eye view of everything you are shipping. Features status tags (Planning, In Progress, Review, Shipped), target ship dates, and automatically rolled-up task completion percentages.',
    formulaCallout: '=COUNTIFS(Tasks!ProjectID, ID, Tasks!Status, "Done") / COUNTIF(Tasks!ProjectID, ID)',
  },
  {
    id: 'tasks',
    name: 'Tasks Backlog',
    category: 'Execution',
    badge: '300+ Task Capacity',
    icon: CheckSquare,
    tagline: 'Eisenhower priority matrix with urgency filters and completion tracking.',
    description: 'Sort tasks by Priority (P1 Urgent to P3 Someday), assign deadlines, and link each task directly to an overarching goal. Features quick-filter dropdowns that keep your today view clean.',
    formulaCallout: '=FILTER(Backlog, (Priority="P1") * (Status<>"Done"))',
  },
  {
    id: 'ai-prompts',
    name: 'AI Prompt Builder',
    category: 'Life & AI',
    badge: 'ChatGPT & Claude Ready',
    icon: Bot,
    tagline: 'Pre-engineered strategy prompts for weekly audits and goal troubleshooting.',
    description: 'Unlock a digital mentor inside your workflow. Paste your weekly spreadsheet stats directly into these structured prompts to receive custom coaching from ChatGPT, Claude, or DeepSeek.',
    formulaCallout: 'Prompt Engine v2.0: Optimized for Claude 3.5 Sonnet & GPT-4o',
  },
];

export const SpreadsheetShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('hub');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [todayTasks, setTodayTasks] = useState([
    { text: 'Finish & export Personal Growth System master template', done: true },
    { text: 'Complete 90-min Deep Work sprint on roadmap milestone', done: true },
    { text: 'Review weekly habit consistency & plan Q2 objectives', done: false },
  ]);

  const { addToCart, openCheckout } = useCart();
  const { products, getProductPrice } = useStore();

  const flagshipProduct = products[0];
  const priceInfo = flagshipProduct ? getProductPrice(flagshipProduct) : null;
  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const toggleTask = (index: number) => {
    setTodayTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

  const handleInstantBuy = () => {
    if (flagshipProduct) {
      addToCart(flagshipProduct);
      openCheckout();
    }
  };

  return (
    <section id="spreadsheet-tour" className="py-20 bg-zinc-900 text-white overflow-hidden relative border-y border-zinc-800">
      
      {/* Background glow accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/60 text-indigo-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Interactive System Tour • 16 Master Spreadsheets</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Take a Look Inside Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Life Operating System.
            </span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Explore the actual interconnected sheets, automated streak formulas, and executive command deck built into <strong>Personal Growth System (.xlsx)</strong>.
          </p>
        </div>

        {/* Tab Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                <span>{tab.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        {/* Master Window Simulation */}
        <div className="rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* Mock Window Titlebar */}
          <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-3 text-xs font-mono text-zinc-400 hidden sm:inline">
                Personal_Growth_System_2026.xlsx — {currentTab.name}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-emerald-400 font-semibold border border-zinc-700">
                ● 100% Offline & Private
              </span>
              <span className="hidden md:inline text-zinc-500">|</span>
              <span className="hidden md:inline text-zinc-400">Microsoft Excel + Google Sheets Ready</span>
            </div>
          </div>

          {/* Formula Bar Simulation */}
          <div className="bg-zinc-950 px-4 py-2 border-b border-zinc-800/70 flex items-center gap-3 text-xs font-mono">
            <span className="font-bold text-indigo-400 shrink-0">fx</span>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-zinc-400 truncate">
              {currentTab.formulaCallout}
            </span>
          </div>

          {/* Interactive Sheet Content Viewport */}
          <div className="p-6 sm:p-8 min-h-[460px] flex flex-col justify-between">
            
            {/* Tab 1: OS Hub Content */}
            {activeTab === 'hub' && (
              <div className="space-y-6 animate-fade-in">
                {/* Metric Widgets Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/90">
                    <span className="text-[11px] text-zinc-400 block font-medium">Active Habit Streak</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400">42 Days</span>
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                    <span className="text-[10px] text-emerald-400 mt-1 block">Personal best: 58 days</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/90">
                    <span className="text-[11px] text-zinc-400 block font-medium">Weekly Adherence</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400">94.2%</span>
                      <Percent className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-[10px] text-zinc-400 mt-1 block">33 of 35 habits logged</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/90">
                    <span className="text-[11px] text-zinc-400 block font-medium">Q1 Core Goals</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-indigo-400">4 Active</span>
                      <Target className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-[10px] text-indigo-300 mt-1 block">78% milestone pace</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800/90">
                    <span className="text-[11px] text-zinc-400 block font-medium">Deep Work Logged</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl sm:text-3xl font-black text-purple-400">34.5 hrs</span>
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-[10px] text-purple-300 mt-1 block">Target: 30 hrs/wk</span>
                  </div>
                </div>

                {/* Today Command Center Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>Today&apos;s Big 3 Priority Outcomes</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                          Live Sync
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Interactive preview: click checkboxes to test completion calculation.
                      </p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-3 py-1 rounded-lg">
                      {todayTasks.filter((t) => t.done).length} / {todayTasks.length} Completed
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {todayTasks.map((task, i) => (
                      <div
                        key={i}
                        onClick={() => toggleTask(i)}
                        className={`p-3 rounded-xl border transition-all flex items-center gap-3 cursor-pointer ${
                          task.done
                            ? 'bg-emerald-950/20 border-emerald-800/60 text-zinc-300'
                            : 'bg-zinc-800/40 border-zinc-700/60 text-white hover:border-zinc-600'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            task.done
                              ? 'bg-emerald-500 text-black'
                              : 'border-2 border-zinc-600'
                          }`}
                        >
                          {task.done && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className={`text-xs ${task.done ? 'line-through text-zinc-400' : 'font-medium'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Daily Journal */}
            {activeTab === 'journal' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Daily Entry Log (Row #847 of 2,000)
                    </span>
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                      Energy Score: 9 / 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase">Morning Intention</span>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        &ldquo;Protect 4 unbroken hours of uninterrupted flow state on the digital assets engine. Zero notification checks before noon.&rdquo;
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1">
                      <span className="text-[11px] font-bold text-zinc-400 uppercase">Evening Win & Gratitude</span>
                      <p className="text-xs text-zinc-200 leading-relaxed">
                        &ldquo;Shipped complete life OS release with automated formulas. Maintained clean nutrition and evening mobility protocol.&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
                    <span>Deep Work: <strong>4.5 Hours</strong></span>
                    <span>Sleep: <strong>7.8 Hours</strong></span>
                    <span>Workout: <strong>Upper Hypertrophy ✓</strong></span>
                    <span>Daily Flow Score: <strong className="text-emerald-400">96%</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Habit Tracker */}
            {activeTab === 'habits' && (
              <div className="space-y-5 animate-fade-in">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-x-auto">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-400" />
                      <span>31-Day Habit Streak Consistency Matrix</span>
                    </h4>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      Average Monthly Adherence: 89.4%
                    </span>
                  </div>

                  <table className="w-full text-xs font-mono border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-zinc-800 text-zinc-400 text-left">
                        <th className="py-2 pr-4 font-semibold">Core Habit</th>
                        <th className="py-2 px-2 text-center">W1</th>
                        <th className="py-2 px-2 text-center">W2</th>
                        <th className="py-2 px-2 text-center">W3</th>
                        <th className="py-2 px-2 text-center">W4</th>
                        <th className="py-2 px-3 text-right">Streak</th>
                        <th className="py-2 pl-3 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {[
                        { name: 'Deep Work (4h+)', w1: '●●●●●', w2: '●●●●●', w3: '●●●●○', w4: '●●●●●', streak: '26d', score: '96%' },
                        { name: 'Strength / Cardio Session', w1: '●●●●○', w2: '●●●●●', w3: '●●●●○', w4: '●●●●○', streak: '14d', score: '88%' },
                        { name: '7.5h Restful Sleep', w1: '●●●●●', w2: '●●●●●', w3: '●●●●●', w4: '●●●●○', streak: '22d', score: '94%' },
                        { name: '20 Pages Non-Fiction', w1: '●●●●○', w2: '●●●●○', w3: '●●●●●', w4: '●●●●●', streak: '18d', score: '90%' },
                        { name: 'Clean Nutrition (No Sugar)', w1: '●●●●●', w2: '●●●●○', w3: '●●●●●', w4: '●●●●●', streak: '19d', score: '92%' },
                        { name: 'Daily Reflection & Journal', w1: '●●●●●', w2: '●●●●●', w3: '●●●●●', w4: '●●●●●', streak: '42d', score: '100%' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/30">
                          <td className="py-2.5 pr-4 font-medium text-white">{row.name}</td>
                          <td className="py-2.5 px-2 text-center text-emerald-400">{row.w1}</td>
                          <td className="py-2.5 px-2 text-center text-emerald-400">{row.w2}</td>
                          <td className="py-2.5 px-2 text-center text-emerald-400">{row.w3}</td>
                          <td className="py-2.5 px-2 text-center text-emerald-400">{row.w4}</td>
                          <td className="py-2.5 px-3 text-right font-bold text-amber-400">{row.streak}</td>
                          <td className="py-2.5 pl-3 text-right font-bold text-white">{row.score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 4: 20-Goal Framework */}
            {activeTab === 'goals' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { pillar: 'Health & Vitality', goal: 'Sub-12% bodyfat & 500lb powerlifting total', progress: 85, target: 'Q2 Target' },
                    { pillar: 'Wealth & Autonomy', goal: 'Scale digital assets store to $5,000/mo net profit', progress: 68, target: 'Q3 Target' },
                    { pillar: 'Craft & Engineering', goal: 'Master production Next.js 16 fullstack architectures', progress: 92, target: 'Ongoing' },
                    { pillar: 'Mindset & Impact', goal: 'Read 24 books & publish 12 weekly deep-dive playbooks', progress: 75, target: 'Q4 Target' },
                  ].map((g, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">{g.pillar}</span>
                        <span className="font-mono text-zinc-400 text-[10px] bg-zinc-800 px-2 py-0.5 rounded">{g.target}</span>
                      </div>
                      <h5 className="text-xs font-semibold text-white mb-3 line-clamp-1">{g.goal}</h5>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                          <span>Progress</span>
                          <span className="text-emerald-400 font-bold">{g.progress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                            style={{ width: `${g.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 5: Weekly Planner */}
            {activeTab === 'planner' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                      Sunday Architecture Protocol
                    </span>
                    <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2.5 py-1 rounded-lg">
                      Week #12 Focus
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0">1</span>
                      <div>
                        <strong className="text-white block">Priority Milestone:</strong>
                        <span className="text-zinc-400">Ship Personal Growth System and verify live Razorpay UPI / Card payments.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0">2</span>
                      <div>
                        <strong className="text-white block">Health Non-Negotiable:</strong>
                        <span className="text-zinc-400">4 Gym sessions (Mon/Tue/Thu/Fri) + 8,000 daily steps minimum.</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-start gap-3 text-xs">
                      <span className="w-6 h-6 rounded-lg bg-indigo-900/60 text-indigo-300 flex items-center justify-center font-bold font-mono shrink-0">3</span>
                      <div>
                        <strong className="text-white block">Systems Refinement:</strong>
                        <span className="text-zinc-400">Conduct 10-minute monthly audit & backup store database JSON.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Active Projects */}
            {activeTab === 'projects' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-indigo-400" />
                    <span>Active Product & Life Roadmaps</span>
                  </h4>

                  <div className="space-y-3">
                    {[
                      { name: 'NEXUS Store Launch (Vercel + GitHub)', status: 'Live in Production', badge: 'bg-emerald-950 text-emerald-300 border-emerald-800', progress: 100 },
                      { name: 'Personal Growth System v2.0 Release', status: 'Shipped', badge: 'bg-indigo-950 text-indigo-300 border-indigo-800', progress: 100 },
                      { name: 'SEO & Organic Growth Distribution Engine', status: 'In Progress', badge: 'bg-amber-950 text-amber-300 border-amber-800', progress: 45 },
                    ].map((p, i) => (
                      <div key={i} className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <strong className="text-white block text-sm">{p.name}</strong>
                          <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.badge}`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="sm:text-right font-mono text-zinc-400">
                          <span className="text-emerald-400 font-bold">{p.progress}% Complete</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 7: Tasks Backlog */}
            {activeTab === 'tasks' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-indigo-400" />
                    <span>Eisenhower Backlog Engine (300+ Task Capacity)</span>
                  </h4>

                  <div className="space-y-2 text-xs font-mono">
                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">P1 Urgent</span>
                        <span className="text-white">Verify live UPI payments and customer receipt dispatch</span>
                      </div>
                      <span className="text-zinc-500 text-[11px]">Due Today</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">P2 Important</span>
                        <span className="text-zinc-300">Set up custom domain DNS records on Vercel</span>
                      </div>
                      <span className="text-zinc-500 text-[11px]">Due in 2d</span>
                    </div>

                    <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px] font-bold">P3 Someday</span>
                        <span className="text-zinc-400">Brainstorm Notion workspace companion mirror</span>
                      </div>
                      <span className="text-zinc-500 text-[11px]">Backlog</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 8: AI Prompt Builder */}
            {activeTab === 'ai-prompts' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Bot className="w-4 h-4 text-indigo-400" />
                      <span>Ready-to-Paste AI Coaching Prompts (ChatGPT & Claude)</span>
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono">1-Click Copy</span>
                  </div>

                  {[
                    {
                      id: 'p1',
                      title: 'Sunday Retrospective Mentor Protocol',
                      prompt: 'You are an executive productivity advisor. Here are my weekly stats from my Life OS spreadsheet: [Paste habits adherence %, deep work hours, and top 3 bottlenecks]. Analyze my momentum, identify the #1 friction point, and prescribe 3 concrete adjustments for next week.',
                    },
                    {
                      id: 'p2',
                      title: 'Habit Plateau Breaker',
                      prompt: 'I am struggling to maintain consistency with [Habit Name]. My current streak is broken after 4 days. Using atomic habit principles, diagnose whether the trigger, friction, or reward is failing and suggest a zero-friction implementation intention.',
                    },
                  ].map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80">
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-xs text-indigo-300 font-bold">{item.title}</strong>
                        <button
                          onClick={() => handleCopy(item.prompt, item.id)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-[11px] font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedPrompt === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-zinc-400" />
                              <span>Copy Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-zinc-400 leading-relaxed bg-zinc-900/60 p-2.5 rounded-lg border border-zinc-800/40">
                        {item.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Sheet Tabs Bar (Simulating Excel / Google Sheets bottom tab bar) */}
            <div className="mt-8 pt-4 border-t border-zinc-800/80 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      activeTab === t.id
                        ? 'bg-zinc-800 text-white font-bold border-b-2 border-indigo-500'
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <span>{t.name}</span>
                  </button>
                ))}
              </div>

              {/* Quick Launch CTA */}
              <div className="flex items-center gap-3">
                {priceInfo && (
                  <div className="text-right hidden sm:block">
                    <span className="text-[10px] text-zinc-400 block font-mono">16-Tab Lifetime License</span>
                    <span className="text-sm font-extrabold text-white">
                      {priceInfo.formattedPrice}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleInstantBuy}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Get Personal Growth System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Comparison Pillars */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">100% Private & Offline</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Zero cloud tracking, zero personal data stored on third-party servers. Your reflections, finances, and habits stay strictly on your local device.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Zero Monthly Subscriptions</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Never pay $15/month for bloated productivity SaaS. Buy once, download the .xlsx master file, and own it forever with free lifetime updates.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-zinc-950/70 border border-zinc-800/80">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">Excel & Google Sheets Ready</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Engineered with universal formulas. Works seamlessly on Microsoft Excel (Desktop/Web/Mac/Windows) and imports into Google Sheets in 1 click.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
