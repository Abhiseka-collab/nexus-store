'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQS = [
  {
    q: 'How do I receive my products after purchasing?',
    a: 'Immediately after completing checkout, you are redirected to an instant download page where your files are available right away. We also dispatch an automated email with persistent backup download links so you never lose access.',
  },
  {
    q: 'Can I use these assets for client projects or commercial products?',
    a: 'Yes! All our products include standard commercial rights. You can use the templates, design kits, presets, and boilerplates in unlimited client projects or commercial SaaS products. The only restriction is you cannot resell or redistribute the raw source files directly.',
  },
  {
    q: 'What if I need updates when new versions are released?',
    a: 'All purchases include free lifetime updates. Whenever Notion updates their database features, Figma updates auto-layout, or Next.js releases major upgrades, we update the assets and you can re-download the newest version at zero additional cost.',
  },
  {
    q: 'What is your refund policy?',
    a: 'We stand behind the quality of our work with a 30-day satisfaction guarantee. If an asset is defective or doesn’t match the description, contact our support team and we will either fix it or issue a full refund.',
  },
  {
    q: 'How does payment processing work?',
    a: 'All payments are handled securely through Razorpay, supporting UPI (Google Pay, PhonePe, Paytm, QR Code), Debit/Credit Cards (Visa, MasterCard, RuPay), and NetBanking with 256-bit bank-level SSL encryption. We never store or see your card or banking credentials.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Got Questions?</span>
        </div>
        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-2 text-sm text-zinc-500">
          Everything you need to know about licensing, deliveries, and updates.
        </p>
      </div>

      {/* Accordion */}
      <div className="space-y-3">
        {FAQS.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggle(i)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-zinc-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-zinc-800/60 mt-1 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
