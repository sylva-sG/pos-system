// src/utils/reporting.js
// Pure aggregators for dashboards and reports.
// All functions accept plain arrays and return plain objects.
// No React, no side effects — easy to unit test.

import { isToday, isWithinDays, toDateKey } from "./dates.js";

/**
 * Total revenue (in KSh) of an array of sales.
 * Each sale is expected to have totalKsh OR items with price+quantity.
 */
export function totalRevenue(sales) {
  if (!Array.isArray(sales)) return 0;
  return sales.reduce((sum, s) => sum + saleTotal(s), 0);
}

/**
 * Total item count across an array of sales.
 */
export function totalItems(sales) {
  if (!Array.isArray(sales)) return 0;
  return sales.reduce((sum, s) => {
    const items = Array.isArray(s.items) ? s.items : [];
    return sum + items.reduce((n, i) => n + (Number(i.quantity) || 0), 0);
  }, 0);
}

/**
 * Revenue for sales that occurred today (local time).
 */
export function salesToday(sales) {
  if (!Array.isArray(sales)) return { count: 0, revenue: 0, items: 0 };
  const filtered = sales.filter((s) => isToday(s.createdAt));
  return {
    count: filtered.length,
    revenue: totalRevenue(filtered),
    items: totalItems(filtered),
  };
}

/**
 * Revenue within the last N days.
 */
export function salesWithin(sales, days) {
  if (!Array.isArray(sales)) return { count: 0, revenue: 0, items: 0 };
  const filtered = sales.filter((s) => isWithinDays(s.createdAt, days));
  return {
    count: filtered.length,
    revenue: totalRevenue(filtered),
    items: totalItems(filtered),
  };
}

/**
 * Group sales by calendar day.
 * @returns {Array<{ date: string, count: number, revenue: number }>}
 *          sorted ascending by date.
 */
export function salesByDay(sales) {
  if (!Array.isArray(sales)) return [];
  const map = new Map();
  for (const s of sales) {
    const key = toDateKey(s.createdAt);
    if (!key) continue;
    const entry = map.get(key) || { date: key, count: 0, revenue: 0 };
    entry.count += 1;
    entry.revenue += saleTotal(s);
    map.set(key, entry);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Top selling products by quantity sold.
 * @returns {Array<{ productId, title, quantity, revenue }>}
 */
export function topProducts(sales, limit = 5) {
  if (!Array.isArray(sales)) return [];
  const map = new Map();

  for (const s of sales) {
    const items = Array.isArray(s.items) ? s.items : [];
    for (const item of items) {
      const id = item.id;
      const qty = Number(item.quantity) || 0;
      const unitKsh = Number.isFinite(item.unitKsh)
        ? item.unitKsh
        : 0; // caller should provide unitKsh or we can't compute revenue
      const entry = map.get(id) || {
        productId: id,
        title: item.title ?? "Unknown",
        quantity: 0,
        revenue: 0,
      };
      entry.quantity += qty;
      entry.revenue += unitKsh * qty;
      map.set(id, entry);
    }
  }

  return [...map.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, limit);
}

/**
 * Revenue grouped by product category.
 * Requires the caller to pass `products` (the catalogue) so we can map id → category.
 * @returns {Array<{ category: string, revenue: number, quantity: number }>}
 */
export function revenueByCategory(sales, products) {
  if (!Array.isArray(sales) || !Array.isArray(products)) return [];
  const catByProduct = new Map(products.map((p) => [p.id, p.category ?? "Uncategorized"]));
  const map = new Map();

  for (const s of sales) {
    const items = Array.isArray(s.items) ? s.items : [];
    for (const item of items) {
      const category = catByProduct.get(item.id) ?? "Uncategorized";
      const qty = Number(item.quantity) || 0;
      const unitKsh = Number.isFinite(item.unitKsh) ? item.unitKsh : 0;
      const entry = map.get(category) || { category, revenue: 0, quantity: 0 };
      entry.revenue += unitKsh * qty;
      entry.quantity += qty;
      map.set(category, entry);
    }
  }

  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

/**
 * Build a dashboard summary object in one call.
 */
export function dashboardSummary(sales) {
  return {
    today: salesToday(sales),
    week: salesWithin(sales, 7),
    month: salesWithin(sales, 30),
    allTime: {
      count: Array.isArray(sales) ? sales.length : 0,
      revenue: totalRevenue(sales),
      items: totalItems(sales),
    },
  };
}

// Internal: get the total of a single sale in KSh.
function saleTotal(sale) {
  if (!sale) return 0;
  if (Number.isFinite(sale.totalKsh)) return sale.totalKsh;
  const items = Array.isArray(sale.items) ? sale.items : [];
  return items.reduce((sum, i) => {
    const unitKsh = Number.isFinite(i.unitKsh) ? i.unitKsh : 0;
    const qty = Number(i.quantity) || 0;
    return sum + unitKsh * qty;
  }, 0);
}
