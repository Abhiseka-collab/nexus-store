import { TrafficEvent, AnalyticsSummary, TimePoint, FunnelStats } from '@/types/store';
import { Order } from '@/types/product';

// Safe baseline timestamp for SSR hydration consistency
const SSR_BASE_TIME = 1773993600000;

/**
 * Filter out legacy synthetic seed events.
 * Genuine visits recorded by recordVisit() have IDs starting with 'ev-'.
 */
export function filterRealTrafficEvents(events: unknown[]): TrafficEvent[] {
  if (!Array.isArray(events)) return [];
  return events.filter(
    (e): e is TrafficEvent =>
      typeof e === 'object' &&
      e !== null &&
      'id' in e &&
      typeof (e as any).id === 'string' &&
      (e as any).id.startsWith('ev-') &&
      'timestamp' in e &&
      typeof (e as any).timestamp === 'number'
  );
}

/**
 * Empty baseline generator to replace mock data with clean real analytics.
 * Returns empty array so no synthetic visits deceive the store owner.
 */
export function generateSeedTraffic(): TrafficEvent[] {
  return [];
}

/**
 * Resolves the numeric epoch timestamp of an order.
 */
export function getOrderTimestamp(order: Order): number {
  if (typeof order.timestamp === 'number' && !isNaN(order.timestamp)) {
    return order.timestamp;
  }
  const parsed = Date.parse(order.createdAt);
  return isNaN(parsed) ? Date.now() : parsed;
}

/**
 * Computes 100% genuine analytics strictly from real traffic events and real customer orders.
 * Zero mock baseline revenue, zero fake orders, zero synthetic curve points.
 */
export function computeAnalytics(
  events: TrafficEvent[],
  orders: Order[],
  timeframe: 'day' | 'week' | 'month',
  funnel?: FunnelStats
): AnalyticsSummary {
  const now = typeof window !== 'undefined' ? Date.now() : SSR_BASE_TIME;
  const dayMs = 24 * 60 * 60 * 1000;

  let cutoff = now - dayMs;
  if (timeframe === 'week') cutoff = now - 7 * dayMs;
  if (timeframe === 'month') cutoff = now - 30 * dayMs;

  // Filter ONLY real active events within the timeframe
  const activeEvents = events.filter((e) => e.timestamp >= cutoff);
  const totalVisits = activeEvents.length;
  const uniqueVisitors = activeEvents.filter((e) => e.isUnique).length;

  // Filter ONLY real orders within the timeframe
  const activeOrders = orders.filter((o) => getOrderTimestamp(o) >= cutoff);
  const totalOrders = activeOrders.length;
  const totalRevenue = Math.round(
    activeOrders.reduce((sum, o) => sum + (typeof o.total === 'number' ? o.total : 0), 0) * 100
  ) / 100;

  const conversionRate =
    totalVisits > 0 ? Math.round((totalOrders / totalVisits) * 1000) / 10 : 0;
  const avgOrderValue =
    totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

  // Group real events and orders into real timeline buckets
  const timeline: TimePoint[] = [];

  if (timeframe === 'day') {
    // 8 3-hour slots for the past 24 hours ending at now
    const slotDuration = 3 * 60 * 60 * 1000;
    for (let i = 7; i >= 0; i--) {
      const slotStart = now - (i + 1) * slotDuration;
      const slotEnd = now - i * slotDuration;
      const slotDate = new Date(slotEnd);
      const label = slotDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const slotVisits = activeEvents.filter(
        (e) => e.timestamp >= slotStart && e.timestamp < slotEnd
      ).length;
      const slotOrderItems = activeOrders.filter((o) => {
        const ts = getOrderTimestamp(o);
        return ts >= slotStart && ts < slotEnd;
      });
      const slotRevenue =
        Math.round(slotOrderItems.reduce((sum, o) => sum + o.total, 0) * 100) / 100;

      timeline.push({
        label,
        visits: slotVisits,
        orders: slotOrderItems.length,
        revenue: slotRevenue,
      });
    }
  } else if (timeframe === 'week') {
    // 7 days ending today
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now - i * dayMs);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(dayStart.getTime() + dayMs);
      const label = dayStart.toLocaleDateString('en-US', { weekday: 'short' });

      const dayVisits = activeEvents.filter(
        (e) => e.timestamp >= dayStart.getTime() && e.timestamp < dayEnd.getTime()
      ).length;
      const dayOrderItems = activeOrders.filter((o) => {
        const ts = getOrderTimestamp(o);
        return ts >= dayStart.getTime() && ts < dayEnd.getTime();
      });
      const dayRevenue =
        Math.round(dayOrderItems.reduce((sum, o) => sum + o.total, 0) * 100) / 100;

      timeline.push({
        label,
        visits: dayVisits,
        orders: dayOrderItems.length,
        revenue: dayRevenue,
      });
    }
  } else {
    // 4 weeks (7 days each)
    const weekDuration = 7 * dayMs;
    for (let i = 3; i >= 0; i--) {
      const weekStart = now - (i + 1) * weekDuration;
      const weekEnd = now - i * weekDuration;
      const label = `Week ${4 - i}`;

      const weekVisits = activeEvents.filter(
        (e) => e.timestamp >= weekStart && e.timestamp < weekEnd
      ).length;
      const weekOrderItems = activeOrders.filter((o) => {
        const ts = getOrderTimestamp(o);
        return ts >= weekStart && ts < weekEnd;
      });
      const weekRevenue =
        Math.round(weekOrderItems.reduce((sum, o) => sum + o.total, 0) * 100) / 100;

      timeline.push({
        label,
        visits: weekVisits,
        orders: weekOrderItems.length,
        revenue: weekRevenue,
      });
    }
  }

  // Count genuine referrers
  const refCounts: Record<string, number> = {};
  activeEvents.forEach((e) => {
    refCounts[e.referrer] = (refCounts[e.referrer] || 0) + 1;
  });

  const referrers = Object.entries(refCounts)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const baseVisits = Math.max(totalVisits, funnel?.visits || 0);
  const previews = funnel?.previews || 0;
  const checkouts = funnel?.checkouts || 0;
  const ordersCompleted = Math.max(totalOrders, funnel?.orders || 0);

  return {
    totalVisits,
    uniqueVisitors,
    totalOrders,
    totalRevenue,
    conversionRate,
    avgOrderValue,
    timeline,
    referrers,
    funnel: {
      visits: baseVisits,
      previewClicks: previews,
      previewRate:
        baseVisits > 0 ? Math.min(100, Math.round((previews / baseVisits) * 1000) / 10) : 0,
      checkoutOpens: checkouts,
      checkoutRate:
        baseVisits > 0 ? Math.min(100, Math.round((checkouts / baseVisits) * 1000) / 10) : 0,
      ordersCompleted,
      orderRate:
        baseVisits > 0 ? Math.min(100, Math.round((ordersCompleted / baseVisits) * 1000) / 10) : 0,
    },
  };
}
