import { Product } from '@/types/product';

/**
 * Hash a password using SHA-256 via Web Crypto API.
 * Never stores plain text credentials in browser storage.
 */
export async function hashPassword(plainText: string): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    // Fallback simple hash for non-browser environments
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = (hash << 5) - hash + plainText.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(plainText);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates and sanitizes image and asset URLs.
 * Rejects javascript:, data:, vbscript: or other potentially malicious URI schemes.
 */
export function sanitizeUrl(url: string, fallback = 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=80'): string {
  if (!url || typeof url !== 'string') return fallback;
  const trimmed = url.trim();

  // Block dangerous schemes
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return fallback;
  }

  // Ensure it starts with http://, https://, or relative /
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/')) {
    return trimmed;
  }

  return fallback;
}

/**
 * Sanitizes plain text input to prevent basic script injection.
 */
export function sanitizeText(text: string, maxLength = 500): string {
  if (!text || typeof text !== 'string') return '';
  return text
    .trim()
    .replace(/[<>]/g, '') // strip HTML brackets
    .slice(0, maxLength);
}

/**
 * Validates and bounds numerical prices.
 * Prevents negative prices, NaN, or Infinity exploits.
 */
export function sanitizePrice(price: any): number {
  const num = Number(price);
  if (isNaN(num) || !isFinite(num) || num < 0) {
    return 0;
  }
  return Math.round(num * 100) / 100;
}

/**
 * Normalizes discount input.
 * Handles both "30" (meaning 30%) and "0.30" (meaning 30%).
 * Strictly bounds discount between 0% and 90% to avoid free-exploits or negative bills.
 */
export function normalizeDiscount(val: any): number {
  let num = Number(val);
  if (isNaN(num) || !isFinite(num) || num <= 0) return 0;
  // If user entered 30 instead of 0.30
  if (num > 1 && num <= 100) {
    num = num / 100;
  }
  // Cap max discount at 90% (0.90) to prevent 100% or greater negative charges
  return Math.min(0.90, Math.max(0, Math.round(num * 100) / 100));
}

/**
 * Validates product objects from external backup files.
 * Rejects corrupt entries or dangerous payloads.
 */
export function validateProductSchema(item: any): Product | null {
  if (!item || typeof item !== 'object') return null;

  const validCategories = ['Spreadsheets & Systems', 'Notion Templates', 'Design & 3D', 'E-Books & Guides', 'Developer Kits'];
  const category = validCategories.includes(item.category) ? item.category : 'Spreadsheets & Systems';

  const title = sanitizeText(item.title || 'Untitled Product', 120);
  if (!title) return null;

  const price = sanitizePrice(item.price);
  const originalPrice = item.originalPrice ? sanitizePrice(item.originalPrice) : undefined;
  const priceInr = item.priceInr ? sanitizePrice(item.priceInr) : undefined;
  const originalPriceInr = item.originalPriceInr ? sanitizePrice(item.originalPriceInr) : undefined;
  const thumbnail = sanitizeUrl(item.thumbnail);

  const features = Array.isArray(item.features)
    ? item.features.map((f: any) => sanitizeText(String(f), 200)).filter(Boolean)
    : ['Instant digital delivery'];

  const includedFiles = Array.isArray(item.includedFiles)
    ? item.includedFiles.map((f: any) => sanitizeText(String(f), 200)).filter(Boolean)
    : ['Product Files (.ZIP)'];

  return {
    id: String(item.id || `prod-${Date.now()}`),
    title,
    slug: sanitizeText(item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 120),
    tagline: sanitizeText(item.tagline || '', 200),
    description: sanitizeText(item.description || item.tagline || '', 500),
    longDescription: sanitizeText(item.longDescription || item.description || '', 2000),
    price,
    originalPrice,
    priceInr,
    originalPriceInr,
    category: category as any,
    badge: ['Bestseller', 'Hot', 'New', 'Popular'].includes(item.badge) ? item.badge : undefined,
    rating: typeof item.rating === 'number' && item.rating >= 1 && item.rating <= 5 ? item.rating : 5.0,
    reviewCount: typeof item.reviewCount === 'number' && item.reviewCount >= 0 ? Math.floor(item.reviewCount) : 1,
    downloadsCount: typeof item.downloadsCount === 'number' && item.downloadsCount >= 0 ? Math.floor(item.downloadsCount) : 0,
    thumbnail,
    gallery: Array.isArray(item.gallery) && item.gallery.length > 0
      ? item.gallery.map((g: any) => sanitizeUrl(String(g)))
      : [thumbnail],
    features,
    includedFiles,
    fileFormat: sanitizeText(item.fileFormat || 'Digital Files (.ZIP)', 60),
    fileSize: sanitizeText(item.fileSize || '10 MB', 30),
    version: sanitizeText(item.version || 'v1.0', 30),
    sampleDownloadName: sanitizeText(item.sampleDownloadName || 'Product_Files.zip', 60),
  };
}
