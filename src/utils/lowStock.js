// src/utils/lowStock.js
// Pure helpers for low-stock detection and status classification.

export const DEFAULT_LOW_STOCK_THRESHOLD = 10;

/**
 * True if the product's stock is at or below the threshold (and above 0).
 * A product with stock 0 is "out", not "low".
 */
export function isLowStock(product, threshold = DEFAULT_LOW_STOCK_THRESHOLD) {
  if (!product) return false;
  const stock = Number(product.stock);
  if (!Number.isFinite(stock)) return false;
  return stock > 0 && stock <= threshold;
}

/**
 * True if the product is completely out of stock.
 */
export function isOutOfStock(product) {
  if (!product) return false;
  const stock = Number(product.stock);
  if (!Number.isFinite(stock)) return false;
  return stock <= 0;
}

/**
 * Classify a product's stock status.
 * @returns {"out" | "low" | "ok"}
 */
export function stockStatus(product, threshold = DEFAULT_LOW_STOCK_THRESHOLD) {
  if (isOutOfStock(product)) return "out";
  if (isLowStock(product, threshold)) return "low";
  return "ok";
}

/**
 * Human-readable label for a stock status.
 */
export function stockLabel(status) {
  switch (status) {
    case "out": return "Out of stock";
    case "low": return "Low stock";
    case "ok":  return "In stock";
    default:    return "Unknown";
  }
}

/**
 * Filter a list of products to only low-stock ones.
 */
export function filterLowStock(products, threshold = DEFAULT_LOW_STOCK_THRESHOLD) {
  if (!Array.isArray(products)) return [];
  return products.filter((p) => isLowStock(p, threshold));
}

/**
 * Count low-stock products in a list.
 */
export function countLowStock(products, threshold = DEFAULT_LOW_STOCK_THRESHOLD) {
  return filterLowStock(products, threshold).length;
}
