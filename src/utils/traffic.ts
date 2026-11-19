import { TrafficEvent, AnalyticsSummary, TimePoint } from '@/types/store';
import { Order } from '@/types/product';

// Safe baseline timestamp for SSR hydration consistency
const SSR_BASE_TIME = 1773993600000;

export function generateSeedTraffic(baseTime = SSR_BASE_TIME): TrafficEvent[] {
  const events: TrafficEvent[] = [];
  const now = typeof window !== 'undefined' ? Date.now() : baseTime;
  const dayMs = 24 * 60 * 60 * 1000;
  const referrers: TrafficEvent['referrer'][] = [
    'Google Search',
    'X / Twitter',
    'Direct',
    'Instagram',
    'YouTube',
    'Reddit',
  ];
  const devices: TrafficEvent['device'][] = ['Desktop', 'Mobile', 'Mobile', 'Tablet'];

  for (let d = 29; d >= 0; d--) {
    const dayTimestamp = now - d * dayMs;
    const dateObj = new Date(dayTimestamp);
    const dateStr = dateObj.toISOString().slice(0, 10);
    const dayFactor = d === 0 ? 35 : Math.floor(45 + Math.sin(d) * 25 + (30 - d) * 1.5);

    for (let i = 0; i < dayFactor; i++) {
      const isUnique = Math.random() > 0.35;
      const ref = referrers[Math.floor(Math.random() * referrers.length)];
      const dev = devices[Math.floor(Math.random() * devices.length)];

      events.push({
        id: `vis-${dayTimestamp}-${i}`,
        timestamp: dayTimestamp + Math.floor(Math.random() * dayMs),
        dateStr,
        isUnique,
        referrer: ref,
        device: dev,
      });
    }
  }

  return events;
}

export function computeAnalytics(
  events: TrafficEvent[],
  orders: Order[],
  timeframe: 'day' | 'week' | 'month'
): AnalyticsSummary {
  const now = typeof window !== 'undefined' ? Date.now() : SSR_BASE_TIME;
  const dayMs = 24 * 60 * 60 * 1000;

  let cutoff = now - dayMs;
  if (timeframe === 'week') cutoff = now - 7 * dayMs;
  if (timeframe === 'month') cutoff = now - 30 * dayMs;

  const activeEvents = events.filter((e) => e.timestamp >= cutoff);
  const totalVisits = activeEvents.length;
  const uniqueVisitors = activeEvents.filter((e) => e.isUnique).length;

  const baselineOrders = Math.floor(totalVisits * 0.038);
  const realOrdersCount = orders.length;
  const totalOrders = Math.max(1, baselineOrders + realOrdersCount);

  const realOrdersRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const baselineRevenue = baselineOrders * 44;
  const totalRevenue = Math.round((realOrdersRevenue + baselineRevenue) * 100) / 100;

  const conversionRate = totalVisits > 0 ? Math.round((totalOrders / totalVisits) * 1000) / 10 : 0;
  const avgOrderValue = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;

  const timeline: TimePoint[] = [];

  if (timeframe === 'day') {
    const slots = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];
    slots.forEach((label, idx) => {
      const slotVisits = Math.max(2, Math.round((totalVisits / 8) + (idx % 3 === 0 ? 4 : -2)));
      const slotOrders = Math.max(0, Math.round(slotVisits * 0.04));
      timeline.push({
        label,
        visits: slotVisits,
        orders: slotOrders,
        revenue: slotOrders * avgOrderValue,
      });
    });
  } else if (timeframe === 'week') {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    days.forEach((label, idx) => {
      const dayVisits = Math.max(12, Math.round((totalVisits / 7) + (idx > 3 ? 15 : -8)));
      const dayOrders = Math.max(0, Math.round(dayVisits * 0.04));
      timeline.push({
        label,
        visits: dayVisits,
        orders: dayOrders,
        revenue: dayOrders * avgOrderValue,
      });
    });
  } else {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    weeks.forEach((label, idx) => {
      const weekVisits = Math.max(60, Math.round((totalVisits / 4) + (idx * 25 - 15)));
      const weekOrders = Math.max(1, Math.round(weekVisits * 0.04));
      timeline.push({
        label,
        visits: weekVisits,
        orders: weekOrders,
        revenue: weekOrders * avgOrderValue,
      });
    });
  }

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

  return {
    totalVisits,
    uniqueVisitors,
    totalOrders,
    totalRevenue,
    conversionRate,
    avgOrderValue,
    timeline,
    referrers: referrers.length > 0 ? referrers : [
      { name: 'Google Search', count: 42, percentage: 38 },
      { name: 'X / Twitter', count: 32, percentage: 29 },
      { name: 'Direct', count: 21, percentage: 19 },
      { name: 'Instagram', count: 15, percentage: 14 },
    ],
  };
}
