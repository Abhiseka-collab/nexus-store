import { Product } from '@/types/product';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-personal-growth-system',
    title: 'Personal Growth System',
    slug: 'personal-growth-system-os',
    tagline: 'The all-in-one Life OS spreadsheet for habits, daily journaling, goals, projects, and weekly reviews.',
    description: 'Take total control of your life, habits, and ambition. Built with 16 interconnected tabs, executive OS hub, automated habit streak tracker, and 2,000+ day journaling capacity.',
    longDescription: 'The Personal Growth System is a comprehensive, production-grade Life Operating System built directly in Microsoft Excel and compatible with Google Sheets. Unlike cluttered web apps with monthly subscriptions, this spreadsheet gives you complete privacy, offline ownership, and an interconnected dashboard that links your yearly themes, 20 high-leverage goals, active projects, tasks, and daily habit reflections together in real time.',
    price: 1,
    originalPrice: 10,
    priceInr: 10,
    originalPriceInr: 99,
    category: 'Spreadsheets & Systems',
    badge: 'New',
    rating: 5.0,
    reviewCount: 0,
    downloadsCount: 0,
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'
    ],
    features: [
      'Executive OS Hub: Today command center with streak tracking & weekly targets',
      '2,000+ Day Automated Daily Journal & Habit Tracker',
      '20-Goal Framework with annual themes linked to Projects & 300+ Tasks',
      '5-Minute Weekly Planner & Structured Monthly Review protocols',
      'Built-in AI Reflection Prompt Builder (ready for ChatGPT & Claude)',
      '100% Private, offline, zero monthly subscription fees (Excel & Google Sheets ready)'
    ],
    includedFiles: [
      'Personal_Growth_System.xlsx (Complete 16-Tab Master Template)',
      'Setup_and_Habit_Guide.pdf (Quickstart Protocol)',
      'Commercial Single-User Lifetime License'
    ],
    fileFormat: 'Microsoft Excel (.XLSX) + Google Sheets',
    fileSize: '214 KB',
    version: 'v2.0 (2026 Edition)',
    sampleDownloadName: 'Personal_Growth_System.xlsx'
  }
];

export const PROMO_CODES: Record<string, number> = {
  'LAUNCH30': 0.30, // 30% off
  'CREATOR10': 0.10, // 10% off
  'SOLO20': 0.20, // 20% off
};
