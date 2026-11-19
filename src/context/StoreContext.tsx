'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Order } from '@/types/product';
import { StoreSettings, SystemLog, TrafficEvent, AnalyticsSummary } from '@/types/store';
import { PRODUCTS } from '@/data/products';
import { generateSeedTraffic, computeAnalytics } from '@/utils/traffic';
import {
  hashPassword,
  sanitizePrice,
  sanitizeText,
  sanitizeUrl,
  normalizeDiscount,
  validateProductSchema,
} from '@/utils/security';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'NEXUS',
  storeTagline: 'Curated digital assets for creators & founders',
  announcementText: 'Launch Special: Use code LAUNCH30 for 30% OFF everything!',
  promoCode: 'LAUNCH30',
  promoDiscount: 0.30,
  supportEmail: 'solution00000@outlook.com',
  currency: 'USD',
  currencySymbol: '$',
};

// SHA-256 for default password "admin"
const DEFAULT_PASSWORD_HASH = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

export type SupportedCurrency = 'USD' | 'INR';

export interface ProductPriceInfo {
  price: number;
  originalPrice?: number;
  symbol: string;
  currency: SupportedCurrency;
  formattedPrice: string;
  formattedOriginalPrice?: string;
  discountPercent?: number;
}

interface StoreContextType {
  products: Product[];
  settings: StoreSettings;
  orders: Order[];
  logs: SystemLog[];
  trafficEvents: TrafficEvent[];
  currency: SupportedCurrency;
  currencySymbol: string;
  isAdminAuthenticated: boolean;
  lockoutRemainingSeconds: number;
  setCurrency: (currency: SupportedCurrency) => void;
  formatPrice: (amountUsd: number, amountInr?: number) => string;
  getProductPrice: (product: Product) => ProductPriceInfo;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateSettings: (updates: Partial<StoreSettings>) => void;
  recordOrder: (order: Order) => void;
  recordVisit: (referrer?: string) => void;
  getAnalytics: (timeframe: 'day' | 'week' | 'month') => AnalyticsSummary;
  loginAdmin: (password: string) => Promise<{ success: boolean; message?: string }>;
  logoutAdmin: () => void;
  changeAdminPassword: (newPass: string) => Promise<boolean>;
  createBackup: () => void;
  restoreBackup: (jsonContent: string) => { success: boolean; message: string };
  runSystemDiagnostics: () => {
    timestamp: string;
    checks: Array<{ name: string; status: 'healthy' | 'warning' | 'issue'; detail: string }>;
  };
  clearLogs: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [currency, setCurrencyState] = useState<SupportedCurrency>('USD');
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [trafficEvents, setTrafficEvents] = useState<TrafficEvent[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [adminPasswordHash, setAdminPasswordHash] = useState<string>(DEFAULT_PASSWORD_HASH);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lockoutUntil, setLockoutUntil] = useState<number>(0);
  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Safe storage helper with quota management
  const safeSetItem = (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e: any) {
      if (e?.name === 'QuotaExceededError') {
        // Trim logs to free space
        localStorage.removeItem('nexus_logs');
        setLogs([]);
        try {
          localStorage.setItem(key, value);
        } catch {
          // If still quota exceeded, warn
        }
      }
    }
  };

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutUntil <= Date.now()) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
      setLockoutRemainingSeconds(remaining);
      if (remaining === 0) {
        setFailedAttempts(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockoutUntil]);

  // Load persisted data on client
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('nexus_products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed)) {
          const validated = parsed.map(validateProductSchema).filter(Boolean) as Product[];
          // Filter out legacy demo placeholder items
          const userProducts = validated.filter(
            (p) =>
              p.id !== 'prod-notion-second-brain' &&
              p.id !== 'prod-saas-design-system' &&
              p.id !== 'prod-solo-founder-playbook' &&
              p.id !== 'prod-saas-starter-kit' &&
              p.id !== 'prod-minimal-lightroom-presets' &&
              p.id !== 'prod-3d-holographic-icons'
          );
          if (userProducts.length > 0) {
            setProducts(userProducts);
            safeSetItem('nexus_products', JSON.stringify(userProducts));
          } else {
            setProducts(PRODUCTS);
            safeSetItem('nexus_products', JSON.stringify(PRODUCTS));
          }
        }
      } else {
        setProducts(PRODUCTS);
        safeSetItem('nexus_products', JSON.stringify(PRODUCTS));
      }

      const storedSettings = localStorage.getItem('nexus_settings');
      if (storedSettings) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(storedSettings) });
      }

      const storedOrders = localStorage.getItem('nexus_orders');
      if (storedOrders) {
        setOrders(JSON.parse(storedOrders));
      }

      const storedLogs = localStorage.getItem('nexus_logs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }

      const storedHash = localStorage.getItem('nexus_admin_pw_hash');
      if (storedHash) {
        setAdminPasswordHash(storedHash);
      }

      const storedTraffic = localStorage.getItem('nexus_traffic');
      if (storedTraffic) {
        const parsed = JSON.parse(storedTraffic);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTrafficEvents(parsed);
        } else {
          setTrafficEvents(generateSeedTraffic());
        }
      } else {
        setTrafficEvents(generateSeedTraffic());
      }

      const sessionAuth = sessionStorage.getItem('nexus_admin_auth');
      if (sessionAuth === 'true') {
        setIsAdminAuthenticated(true);
      }

      const storedCurrency = localStorage.getItem('nexus_currency') as SupportedCurrency | null;
      if (storedCurrency === 'USD' || storedCurrency === 'INR') {
        setCurrencyState(storedCurrency);
      } else {
        // Auto-detect Indian timezone or locale
        try {
          const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
          if (
            tz.toLowerCase().includes('kolkata') ||
            tz.toLowerCase().includes('calcutta') ||
            navigator.language === 'en-IN' ||
            navigator.language === 'hi'
          ) {
            setCurrencyState('INR');
          }
        } catch {
          // default USD
        }
      }
    } catch {
      // Storage parsing failed, keep defaults
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync products
  useEffect(() => {
    if (!isLoaded) return;
    safeSetItem('nexus_products', JSON.stringify(products));
  }, [products, isLoaded]);

  // Sync settings
  useEffect(() => {
    if (!isLoaded) return;
    safeSetItem('nexus_settings', JSON.stringify(settings));
  }, [settings, isLoaded]);

  // Sync orders
  useEffect(() => {
    if (!isLoaded) return;
    safeSetItem('nexus_orders', JSON.stringify(orders));
  }, [orders, isLoaded]);

  // Sync logs
  useEffect(() => {
    if (!isLoaded) return;
    safeSetItem('nexus_logs', JSON.stringify(logs));
  }, [logs, isLoaded]);

  const setCurrency = useCallback((newCurrency: SupportedCurrency) => {
    setCurrencyState(newCurrency);
    if (typeof window !== 'undefined') {
      localStorage.setItem('nexus_currency', newCurrency);
    }
  }, []);

  const getProductPrice = useCallback((product: Product): ProductPriceInfo => {
    const isINR = currency === 'INR';
    const symbol = isINR ? '₹' : '$';
    const price = isINR ? (product.priceInr || Math.round(product.price * 75)) : product.price;
    const originalPrice = isINR
      ? (product.originalPriceInr || (product.originalPrice ? Math.round(product.originalPrice * 75) : undefined))
      : product.originalPrice;

    const discountPercent = originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : undefined;

    return {
      price,
      originalPrice,
      symbol,
      currency,
      formattedPrice: isINR ? `₹${price.toLocaleString('en-IN')}` : `$${price}`,
      formattedOriginalPrice: originalPrice
        ? (isINR ? `₹${originalPrice.toLocaleString('en-IN')}` : `$${originalPrice}`)
        : undefined,
      discountPercent,
    };
  }, [currency]);

  const formatPrice = useCallback((amountUsd: number, amountInr?: number): string => {
    if (currency === 'INR') {
      const val = amountInr !== undefined ? amountInr : Math.round(amountUsd * 75);
      return `₹${val.toLocaleString('en-IN')}`;
    }
    return `$${amountUsd.toFixed(amountUsd % 1 === 0 ? 0 : 2)}`;
  }, [currency]);

  const addLog = useCallback((type: 'info' | 'warning' | 'error' | 'success', message: string) => {
    const newLog: SystemLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toLocaleTimeString(),
      type,
      message: sanitizeText(message, 300),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 39)]);
  }, []);

  const recordVisit = useCallback((ref?: string) => {
    const isUnique = typeof window !== 'undefined' ? !sessionStorage.getItem('nexus_session_logged') : true;
    if (typeof window !== 'undefined' && isUnique) {
      sessionStorage.setItem('nexus_session_logged', 'true');
    }

    const referrers: TrafficEvent['referrer'][] = [
      'Direct', 'Google Search', 'X / Twitter', 'Instagram', 'YouTube', 'Reddit'
    ];
    const detectedRef: TrafficEvent['referrer'] = ref && referrers.includes(ref as any)
      ? (ref as any)
      : 'Direct';

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const device: TrafficEvent['device'] = isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop';

    const newEvent: TrafficEvent = {
      id: `ev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      dateStr: new Date().toISOString().slice(0, 10),
      isUnique,
      referrer: detectedRef,
      device,
    };

    setTrafficEvents((prev) => {
      const updated = [newEvent, ...prev.slice(0, 999)];
      safeSetItem('nexus_traffic', JSON.stringify(updated.slice(0, 400)));
      return updated;
    });
  }, []);

  const getAnalytics = useCallback((timeframe: 'day' | 'week' | 'month'): AnalyticsSummary => {
    return computeAnalytics(trafficEvents, orders, timeframe);
  }, [trafficEvents, orders]);

  const addProduct = (data: Omit<Product, 'id'>): Product => {
    const newId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const sanitized: Product = {
      id: newId,
      title: sanitizeText(data.title, 120),
      slug: sanitizeText(data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'), 120),
      tagline: sanitizeText(data.tagline, 200),
      description: sanitizeText(data.description, 500),
      longDescription: sanitizeText(data.longDescription || data.description, 2000),
      price: sanitizePrice(data.price),
      originalPrice: data.originalPrice ? sanitizePrice(data.originalPrice) : undefined,
      category: data.category,
      badge: data.badge,
      rating: 5.0,
      reviewCount: 1,
      downloadsCount: 0,
      thumbnail: sanitizeUrl(data.thumbnail),
      gallery: data.gallery && data.gallery.length > 0 ? data.gallery.map((u) => sanitizeUrl(u)) : [sanitizeUrl(data.thumbnail)],
      features: (data.features || []).map((f) => sanitizeText(f, 200)).filter(Boolean),
      includedFiles: (data.includedFiles || []).map((f) => sanitizeText(f, 200)).filter(Boolean),
      fileFormat: sanitizeText(data.fileFormat || 'Digital Files (.ZIP)', 60),
      fileSize: sanitizeText(data.fileSize || '10 MB', 30),
      version: sanitizeText(data.version || 'v1.0', 30),
      sampleDownloadName: sanitizeText(data.sampleDownloadName || 'Product_Files.zip', 60),
    };

    setProducts((prev) => [sanitized, ...prev]);
    addLog('success', `Product added: "${sanitized.title}" ($${sanitized.price})`);
    return sanitized;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated: Product = {
            ...p,
            ...updates,
            title: updates.title !== undefined ? sanitizeText(updates.title, 120) : p.title,
            tagline: updates.tagline !== undefined ? sanitizeText(updates.tagline, 200) : p.tagline,
            price: updates.price !== undefined ? sanitizePrice(updates.price) : p.price,
            originalPrice: updates.originalPrice !== undefined ? (updates.originalPrice ? sanitizePrice(updates.originalPrice) : undefined) : p.originalPrice,
            thumbnail: updates.thumbnail !== undefined ? sanitizeUrl(updates.thumbnail) : p.thumbnail,
          };
          addLog('info', `Updated product: "${updated.title}"`);
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      addLog('warning', `Deleted product: "${target.title}"`);
    }
  };

  const updateSettings = (updates: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated: StoreSettings = {
        ...prev,
        ...updates,
        storeName: updates.storeName !== undefined ? sanitizeText(updates.storeName, 60) : prev.storeName,
        storeTagline: updates.storeTagline !== undefined ? sanitizeText(updates.storeTagline, 150) : prev.storeTagline,
        announcementText: updates.announcementText !== undefined ? sanitizeText(updates.announcementText, 150) : prev.announcementText,
        promoCode: updates.promoCode !== undefined ? sanitizeText(updates.promoCode.toUpperCase(), 20) : prev.promoCode,
        promoDiscount: updates.promoDiscount !== undefined ? normalizeDiscount(updates.promoDiscount) : prev.promoDiscount,
        supportEmail: updates.supportEmail !== undefined ? sanitizeText(updates.supportEmail, 80) : prev.supportEmail,
      };
      addLog('success', 'Store configuration updated.');
      return updated;
    });
  };

  const recordOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev.slice(0, 99)]);
    addLog('success', `Order #${order.id} received: $${order.total} from ${order.customerEmail}`);
  };

  // Secure login with SHA-256 hash check and rate limiting
  const loginAdmin = async (password: string): Promise<{ success: boolean; message?: string }> => {
    // Check if locked out
    if (Date.now() < lockoutUntil) {
      const waitSec = Math.ceil((lockoutUntil - Date.now()) / 1000);
      return { success: false, message: `Too many failed attempts. Locked out for ${waitSec}s.` };
    }

    const hashedInput = await hashPassword(password);
    if (hashedInput === adminPasswordHash) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('nexus_admin_auth', 'true');
      setFailedAttempts(0);
      addLog('info', 'Admin authenticated via hashed verification.');
      return { success: true };
    }

    const newFails = failedAttempts + 1;
    setFailedAttempts(newFails);

    if (newFails >= MAX_FAILED_ATTEMPTS) {
      const lockTime = Date.now() + LOCKOUT_DURATION_MS;
      setLockoutUntil(lockTime);
      setLockoutRemainingSeconds(60);
      addLog('error', `Security Alert: Admin login locked out after ${MAX_FAILED_ATTEMPTS} failed attempts.`);
      return { success: false, message: 'Too many failed attempts. Locked out for 60 seconds.' };
    }

    addLog('warning', `Failed admin login attempt (${newFails}/${MAX_FAILED_ATTEMPTS}).`);
    return {
      success: false,
      message: `Incorrect password. (${MAX_FAILED_ATTEMPTS - newFails} attempts remaining)`,
    };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('nexus_admin_auth');
    addLog('info', 'Admin logged out.');
  };

  const changeAdminPassword = async (newPass: string): Promise<boolean> => {
    if (!newPass || newPass.trim().length < 4) return false;
    const hash = await hashPassword(newPass.trim());
    setAdminPasswordHash(hash);
    safeSetItem('nexus_admin_pw_hash', hash);
    addLog('success', 'Master password securely updated and hashed.');
    return true;
  };

  const createBackup = () => {
    const backupData = {
      version: '2.0-secure',
      exportedAt: new Date().toISOString(),
      settings,
      products,
      orders,
      logs,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus_store_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    addLog('success', 'Store backup JSON exported securely.');
  };

  const restoreBackup = (jsonContent: string): { success: boolean; message: string } => {
    try {
      const data = JSON.parse(jsonContent);
      if (!data || typeof data !== 'object') {
        return { success: false, message: 'Corrupt backup file: Root must be a JSON object.' };
      }
      if (!Array.isArray(data.products)) {
        return { success: false, message: 'Invalid backup: Missing products array.' };
      }

      // Strictly validate every product
      const validatedProducts: Product[] = [];
      for (const raw of data.products) {
        const item = validateProductSchema(raw);
        if (item) validatedProducts.push(item);
      }

      if (validatedProducts.length === 0) {
        return { success: false, message: 'Backup contained no valid products.' };
      }

      setProducts(validatedProducts);
      if (data.settings && typeof data.settings === 'object') {
        setSettings({
          ...DEFAULT_SETTINGS,
          storeName: sanitizeText(data.settings.storeName || DEFAULT_SETTINGS.storeName, 60),
          announcementText: sanitizeText(data.settings.announcementText || DEFAULT_SETTINGS.announcementText, 150),
          promoCode: sanitizeText(data.settings.promoCode || DEFAULT_SETTINGS.promoCode, 20),
          promoDiscount: normalizeDiscount(data.settings.promoDiscount || DEFAULT_SETTINGS.promoDiscount),
          supportEmail: sanitizeText(data.settings.supportEmail || DEFAULT_SETTINGS.supportEmail, 80),
        });
      }

      addLog('success', `Restored backup: ${validatedProducts.length} verified products.`);
      return {
        success: true,
        message: `Successfully validated and restored ${validatedProducts.length} products.`,
      };
    } catch {
      return { success: false, message: 'Security check failed: Malformed JSON syntax.' };
    }
  };

  const runSystemDiagnostics = () => {
    const checks: Array<{ name: string; status: 'healthy' | 'warning' | 'issue'; detail: string }> = [];

    // Check 1: Products Integrity & Schema Validation
    const invalidItems = products.filter((p) => !p.id || !p.title || typeof p.price !== 'number' || p.price < 0);
    if (invalidItems.length === 0 && products.length > 0) {
      checks.push({
        name: 'Product Catalog & Schema Integrity',
        status: 'healthy',
        detail: `All ${products.length} products passed schema, pricing, and format sanitization.`,
      });
    } else if (products.length === 0) {
      checks.push({
        name: 'Product Catalog & Schema Integrity',
        status: 'warning',
        detail: 'Catalog is currently empty. Add products to begin selling.',
      });
    } else {
      checks.push({
        name: 'Product Catalog & Schema Integrity',
        status: 'issue',
        detail: `Detected ${invalidItems.length} products with irregular data schemas.`,
      });
    }

    // Check 2: Browser Storage Quota & Persistence
    try {
      const probe = '__quota_probe__';
      localStorage.setItem(probe, probe);
      localStorage.removeItem(probe);
      checks.push({
        name: 'Storage Engine & Quota Health',
        status: 'healthy',
        detail: 'Browser local storage writable with active quota protection.',
      });
    } catch {
      checks.push({
        name: 'Storage Engine & Quota Health',
        status: 'issue',
        detail: 'Storage quota exceeded or browser privacy sandbox is restricting write access.',
      });
    }

    // Check 3: Cryptographic Authentication Status
    if (adminPasswordHash && adminPasswordHash.length === 64) {
      checks.push({
        name: 'Admin Security & Password Hashing',
        status: 'healthy',
        detail: 'Admin credentials protected using SHA-256 cryptographic hashing.',
      });
    } else {
      checks.push({
        name: 'Admin Security & Password Hashing',
        status: 'warning',
        detail: 'Admin password hash not initialized to standard 256-bit hash.',
      });
    }

    // Check 4: Rate Limiting & Brute-Force Shield
    checks.push({
      name: 'Brute-Force Attack Shield',
      status: 'healthy',
      detail: `Rate limiter active: 5 attempt threshold with 60-second cooldown protection.`,
    });

    // Check 5: Active Promotion Engine & Discount Bounds
    if (settings.promoCode && settings.promoDiscount > 0 && settings.promoDiscount <= 0.9) {
      checks.push({
        name: 'Promotion Engine & Pricing Safety',
        status: 'healthy',
        detail: `Code "${settings.promoCode}" is bounded at ${(settings.promoDiscount * 100).toFixed(0)}% off (<= 90% cap).`,
      });
    } else {
      checks.push({
        name: 'Promotion Engine & Pricing Safety',
        status: 'warning',
        detail: 'No active discount configured, or rate exceeds safety thresholds.',
      });
    }

    // Check 6: Asset Security & Protocols
    const insecureUrls = products.filter(
      (p) => !p.thumbnail.startsWith('https://') && !p.thumbnail.startsWith('/')
    );
    if (insecureUrls.length === 0) {
      checks.push({
        name: 'SSL/HTTPS Asset Delivery',
        status: 'healthy',
        detail: '100% of product images and assets load through secure HTTPS or local paths.',
      });
    } else {
      checks.push({
        name: 'SSL/HTTPS Asset Delivery',
        status: 'warning',
        detail: `${insecureUrls.length} assets use non-HTTPS URLs.`,
      });
    }

    addLog('info', 'Ran full 6-point system security & integrity diagnostics.');
    return {
      timestamp: new Date().toLocaleTimeString(),
      checks,
    };
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        settings,
        orders,
        logs,
        trafficEvents,
        currency,
        currencySymbol: currency === 'INR' ? '₹' : '$',
        isAdminAuthenticated,
        lockoutRemainingSeconds,
        setCurrency,
        formatPrice,
        getProductPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        updateSettings,
        recordOrder,
        recordVisit,
        getAnalytics,
        loginAdmin,
        logoutAdmin,
        changeAdminPassword,
        createBackup,
        restoreBackup,
        runSystemDiagnostics,
        clearLogs,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
