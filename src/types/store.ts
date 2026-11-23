export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  announcementText: string;
  promoCode: string;
  promoDiscount: number; // e.g. 0.30 for 30%
  supportEmail: string;
  currency: string;
  currencySymbol: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export interface TrafficEvent {
  id: string;
  timestamp: number; // epoch ms
  dateStr: string;   // YYYY-MM-DD
  isUnique: boolean;
  referrer: 'Direct' | 'Google Search' | 'X / Twitter' | 'Instagram' | 'YouTube' | 'Reddit';
  device: 'Desktop' | 'Mobile' | 'Tablet';
}

export interface TimePoint {
  label: string;
  visits: number;
  orders: number;
  revenue: number;
}

export interface FunnelStats {
  visits: number;
  previews: number;
  checkouts: number;
  orders: number;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalOrders: number;
  totalRevenue: number;
  conversionRate: number; // e.g. 3.4%
  avgOrderValue: number;  // e.g. $42.50
  timeline: TimePoint[];
  referrers: Array<{ name: string; count: number; percentage: number }>;
  funnel: {
    visits: number;
    previewClicks: number;
    previewRate: number;
    checkoutOpens: number;
    checkoutRate: number;
    ordersCompleted: number;
    orderRate: number;
  };
}
