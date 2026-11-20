'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductCatalog } from '@/components/ProductCatalog';
import { SpreadsheetShowcase } from '@/components/SpreadsheetShowcase';
import { UnboxingCard } from '@/components/UnboxingCard';
import { ChaosVsFlow } from '@/components/ChaosVsFlow';
import { RoiCalculator } from '@/components/RoiCalculator';
import { Testimonials } from '@/components/Testimonials';
import { HowItWorks } from '@/components/HowItWorks';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductModal } from '@/components/ProductModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';
import { ActivityToast } from '@/components/ActivityToast';

export default function Home() {
  const { recordVisit } = useStore();

  useEffect(() => {
    // Record storefront visitor session
    recordVisit();
  }, [recordVisit]);

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-300">
      {/* Navigation with Theme & Currency controls */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <ProductCatalog />
        <SpreadsheetShowcase />
        <UnboxingCard />
        <ChaosVsFlow />
        <RoiCalculator />
        <Testimonials />
        <HowItWorks />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Modals, Drawers & Live Social Proof */}
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <OrderSuccessModal />
      <ActivityToast />
    </div>
  );
}
