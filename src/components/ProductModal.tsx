'use client';

import React, { useState } from 'react';
import { X, Star, CheckCircle, Shield, Download, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SafeImage } from '@/components/SafeImage';

export const ProductModal: React.FC = () => {
  const { viewingProduct, setViewingProduct, addToCart, openCheckout } = useCart();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!viewingProduct) return null;

  const activeImage = selectedImage || viewingProduct.thumbnail;

  const handleBuyNow = () => {
    addToCart(viewingProduct);
    setViewingProduct(null);
    openCheckout();
  };

  const handleAddToCart = () => {
    addToCart(viewingProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setViewingProduct(null)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close product modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Media Column */}
          <div className="p-6 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200/80 dark:border-zinc-800/80">
            <div>
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 shadow-inner">
                <SafeImage
                  src={activeImage}
                  alt={viewingProduct.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Gallery Thumbnails */}
              {viewingProduct.gallery.length > 1 && (
                <div className="flex gap-2.5 mt-3">
                  {viewingProduct.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-video w-20 rounded-lg overflow-hidden border-2 transition-all ${
                        activeImage === img
                          ? 'border-indigo-600 scale-95 shadow-md'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <SafeImage src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Spec Box */}
            <div className="mt-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>File Format:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{viewingProduct.fileFormat}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Download Size:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{viewingProduct.fileSize}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Release Version:</span>
                <span className="font-semibold text-zinc-900 dark:text-white">{viewingProduct.version}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Delivery:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Instant Download</span>
              </div>
            </div>
          </div>

          {/* Right: Content & Purchase Column */}
          <div className="p-6 md:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {viewingProduct.category}
                </span>
                <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-medium">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{viewingProduct.rating}</span>
                  <span>({viewingProduct.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title & Tagline */}
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white leading-tight">
                {viewingProduct.title}
              </h2>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {viewingProduct.longDescription}
              </p>

              {/* Features list */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
                  Key Features
                </h4>
                <ul className="space-y-2 text-xs text-zinc-700 dark:text-zinc-300">
                  {viewingProduct.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What is inside */}
              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2.5">
                  What&apos;s Included In The Download
                </h4>
                <div className="space-y-1.5">
                  {viewingProduct.includedFiles.map((file, i) => (
                    <div
                      key={i}
                      className="text-xs flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-zinc-800 dark:text-zinc-200"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="font-mono text-[11px]">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Price & CTA section */}
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 block">Total Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-zinc-900 dark:text-white">
                      ${viewingProduct.price}
                    </span>
                    {viewingProduct.originalPrice && (
                      <span className="text-sm text-zinc-400 line-through">
                        ${viewingProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  <Shield className="w-4 h-4" />
                  <span>30-Day Money Back</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 px-4 rounded-xl border border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 text-zinc-800 dark:text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
                >
                  <span>Instant Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
