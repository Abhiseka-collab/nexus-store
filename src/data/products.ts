import { Product } from '@/types/product';

export const PRODUCTS: Product[] = [];

export const PROMO_CODES: Record<string, number> = {
  'LAUNCH30': 0.30, // 30% off
  'CREATOR10': 0.10, // 10% off
  'SOLO20': 0.20, // 20% off
};
