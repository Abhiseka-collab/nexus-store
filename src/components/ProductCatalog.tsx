'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ProductCard } from '@/components/ProductCard';

export const ProductCatalog: React.FC = () => {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('All Systems');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category))).filter(Boolean);
    return ['All Systems', ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All Systems' || product.category === selectedCategory;

      const matchesSearch =
        searchQuery === '' ||
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0; // Default featured & newest
    });
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="products" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Storefront Catalog
          </span>
          <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-1">
            Browse Digital Products
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Instant digital access with lifetime updates and commercial licensing included.
          </p>
        </div>

        {/* Sort & Filter Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/80 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-300">
            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-medium text-zinc-900 dark:text-white focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest Releases</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4 mb-10">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search templates, UI kits, boilerplates, guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const count =
              cat === 'All Systems'
                ? products.length
                : products.filter((p) => p.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-sm'
                    : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 dark:bg-zinc-900/20 text-current'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/40 border border-dashed border-zinc-300 dark:border-zinc-800">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
            Ready for your digital drops!
          </h3>
          <p className="mt-1.5 text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            All placeholder products have been removed. Add your first digital asset via the Admin portal.
          </p>
          <a
            href="/admin"
            className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
          >
            <span>+ Enlist Your First Product in Admin</span>
          </a>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-300 dark:border-zinc-800">
          <Sparkles className="w-8 h-8 text-zinc-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-white">
            {searchQuery
              ? `No products found matching "${searchQuery}"`
              : `No products found in category "${selectedCategory}"`}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            Try adjusting your search query or reset your category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Products');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
