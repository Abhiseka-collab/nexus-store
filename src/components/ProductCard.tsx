'use client';

import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, FileText } from 'lucide-react';
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

  const priceInfo = getProductPrice(product);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const badgeColor = {
    Bestseller: 'bg-amber-500 text-white shadow-amber-500/20',
    Hot: 'bg-rose-500 text-white shadow-rose-500/20',
    New: 'bg-emerald-500 text-white shadow-emerald-500/20',
    Popular: 'bg-indigo-600 text-white shadow-indigo-600/20',
  }[product.badge || 'Popular'];

  return (
    <div
      onClick={() => setViewingProduct(product)}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm hover:shadow-xl hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <SafeImage
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {product.badge && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md tracking-wider uppercase ${badgeColor}`}>
              {product.badge}
            </span>
          )}
          {priceInfo.discountPercent && (
            <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-zinc-900/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
              Save {priceInfo.discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewingProduct(product);
            }}
            className="flex items-center gap-2 bg-white/95 hover:bg-white text-zinc-900 px-4 py-2 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-sm transition-transform active:scale-95"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick Preview</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Status */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide uppercase text-[11px]">
              {product.category}
            </span>
            {product.reviewCount > 0 ? (
              <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{product.rating}</span>
                <span className="text-zinc-400">({product.reviewCount})</span>
              </div>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/40">
                Verified Template
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
          <div className="mt-3 flex items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/60 px-2.5 py-1.5 rounded-lg border border-zinc-200/50 dark:border-zinc-800">
            <FileText className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="truncate">{product.fileFormat}</span>
            <span className="text-zinc-300 dark:text-zinc-700">•</span>
            <span className="shrink-0">{product.fileSize}</span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-zinc-900 dark:text-white">
              {priceInfo.formattedPrice}
            </span>
            {priceInfo.formattedOriginalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {priceInfo.formattedOriginalPrice}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm active:scale-95 ${
              justAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-900 hover:bg-indigo-600 text-white dark:bg-white dark:hover:bg-indigo-500 dark:text-zinc-900 dark:hover:text-white'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
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
