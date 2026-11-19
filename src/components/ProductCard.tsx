'use client';

import React, { useState, useRef } from 'react';
import { Star, ShoppingBag, Eye, Check, FileSpreadsheet, Zap } from 'lucide-react';
import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useStore } from '@/context/StoreContext';
import { SafeImage } from '@/components/SafeImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setViewingProduct } = useCart();
  const { getProductPrice } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  // Dynamic Cursor Spotlight
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const priceInfo = getProductPrice(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const badgeColor = {
    Bestseller: 'bg-amber-500 text-white shadow-amber-500/25',
    Hot: 'bg-rose-500 text-white shadow-rose-500/25',
    New: 'bg-emerald-500 text-white shadow-emerald-500/25',
    Popular: 'bg-indigo-600 text-white shadow-indigo-600/25',
  }[product.badge || 'Popular'];

  return (
    <div
      ref={cardRef}
      onClick={() => setViewingProduct(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-indigo-400 dark:hover:border-indigo-500/70 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden cursor-pointer"
    >
      {/* Radiant Spotlight Cursor Glow */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl transition-opacity duration-300 z-10 hidden sm:block"
          style={{
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.22), transparent 75%)`,
          }}
        />
      )}

      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <SafeImage
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Ambient Gradient on Thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-20">
          {product.badge && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase ${badgeColor}`}>
              {product.badge}
            </span>
          )}
          {priceInfo.discountPercent && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-zinc-950/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-md">
              Save {priceInfo.discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewingProduct(product);
            }}
            className="flex items-center gap-2 bg-white/95 hover:bg-white text-zinc-900 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl backdrop-blur-sm transition-transform active:scale-95"
          >
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Quick Preview</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-20">
        <div>
          {/* Category & Status */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 tracking-wider uppercase text-[11px]">
              {product.category}
            </span>
            {product.reviewCount > 0 ? (
              <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{product.rating}</span>
                <span className="text-zinc-400">({product.reviewCount})</span>
              </div>
            ) : (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-800/50">
                Verified Asset
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-zinc-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {product.title}
          </h3>

          {/* Tagline / Subtitle */}
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>

          {/* File Spec pill */}
          <div className="mt-3.5 flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 px-3 py-1.5 rounded-lg border border-zinc-200/60 dark:border-zinc-800">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate font-medium">{product.fileFormat}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="shrink-0 font-medium">{product.fileSize}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="shrink-0 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 fill-emerald-500" />
              Instant
            </span>
          </div>

          {/* Promo Callout */}
          <div className="mt-2 text-[11px] text-indigo-600 dark:text-indigo-400 font-medium flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/60 font-mono font-bold text-[10px]">
              LAUNCH30
            </span>
            <span>takes extra 30% off</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-900 dark:text-white" suppressHydrationWarning>
                {priceInfo.formattedPrice}
              </span>
              {priceInfo.formattedOriginalPrice && (
                <span className="text-xs text-zinc-400 line-through" suppressHydrationWarning>
                  {priceInfo.formattedOriginalPrice}
                </span>
              )}
            </div>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">One-time purchase • Lifetime access</span>
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-zinc-900 hover:bg-indigo-600 text-white dark:bg-white dark:hover:bg-indigo-500 dark:text-zinc-900 dark:hover:text-white shadow-zinc-900/10'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};