'use client';

import React, { useEffect } from 'react';
import { useStore } from '@/context/StoreContext';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ProductCatalog } from '@/components/ProductCatalog';
import { HowItWorks } from '@/components/HowItWorks';
import { ReviewsSection } from '@/components/ReviewsSection';
import { FaqSection } from '@/components/FaqSection';
import { Footer } from '@/components/Footer';
import { CartDrawer } from '@/components/CartDrawer';
import { ProductModal } from '@/components/ProductModal';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrderSuccessModal } from '@/components/OrderSuccessModal';

export default function Home() {
  const { recordVisit } = useStore();

  useEffect(() => {
    // Record storefront visitor session
    recordVisit();
  }, [recordVisit]);

  return (
    <div className="min-h-screen bg-zinc-50/40 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        <Hero />
        <ProductCatalog />
        <HowItWorks />
        <ReviewsSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Modals & Drawers */}
      <CartDrawer />
      <ProductModal />
      <CheckoutModal />
      <OrderSuccessModal />
    </div>
  );
}
