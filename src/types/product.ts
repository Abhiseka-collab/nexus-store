export interface Product {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  originalPrice?: number;
  category: 'Notion Templates' | 'Design & 3D' | 'E-Books & Guides' | 'Developer Kits';
  badge?: 'Bestseller' | 'New' | 'Popular' | 'Hot';
  rating: number;
  reviewCount: number;
  downloadsCount: number;
  thumbnail: string;
  gallery: string[];
  features: string[];
  includedFiles: string[];
  fileFormat: string;
  fileSize: string;
  version: string;
  sampleDownloadName: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
  createdAt: string;
  downloadToken: string;
}
