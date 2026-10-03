// src/utils/ledger.js
// Construct ledger entries for stock changes.
//
// A ledger entry records a single stock movement:
// {
//   id: "LED-...",
//   type: "sale" | "restock" | "adjustment",
//   productId,
//   productTitle,
//   quantity,       // positive number, magnitude of change
//   before,         // stock before the change
//   after,          // stock after the change
//   delta,          // signed: -qty for sale, +qty for restock
//   user,           // who performed it
//   note,           // optional
//   createdAt,      // timestamp (ms)
// }

import { ledgerId } from "./id.js";

/**
 * Build a ledger entry for a SALE.
 * @param {object} args
 * @param {object} args.product  - { id, title, stock }
 * @param {number} args.quantity - quantity sold (positive)
 * @param {string} args.user     - cashier name
 * @param {number} [args.at]     - timestamp (defaults to now)
 */
export function makeSaleEntry({ product, quantity, user, at }) {
  const qty = Math.max(0, Number(quantity) || 0);
  const before = Number(product?.stock) || 0;
  const after = Math.max(0, before - qty);
  return {
    id: ledgerId(),
    type: "sale",
    productId: product?.id,
    productTitle: product?.title ?? "Unknown product",
    quantity: qty,
    before,
    after,
    delta: -qty,
    user: user ?? "—",
    note: "",
    createdAt: at ?? Date.now(),
  };
}

/**
 * Build a ledger entry for a RESTOCK.
 * @param {object} args
 * @param {object} args.product  - { id, title, stock }
 * @param {number} args.quantity - quantity added (positive)
 * @param {string} args.user     - admin name
 * @param {string} [args.note]   - optional note
 * @param {number} [args.at]
 */
export function makeRestockEntry({ product, quantity, user, note, at }) {
  const qty = Math.max(0, Number(quantity) || 0);
  const before = Number(product?.stock) || 0;
  const after = before + qty;
  return {
    id: ledgerId(),
    type: "restock",
    productId: product?.id,
    productTitle: product?.title ?? "Unknown product",
    quantity: qty,
    before,
    after,
    delta: qty,
    user: user ?? "—",
    note: note ?? "",
    createdAt: at ?? Date.now(),
  };
}

/**
 * Build a ledger entry for a manual ADJUSTMENT.
 * Quantity can be signed (positive to add, negative to remove).
 * @param {object} args
 * @param {object} args.product
 * @param {number} args.delta   - signed change
 * @param {string} args.user
 * @param {string} [args.note]
 * @param {number} [args.at]
 */
export function makeAdjustmentEntry({ product, delta, user, note, at }) {
  const d = Number(delta) || 0;
  const before = Number(product?.stock) || 0;
  const after = Math.max(0, before + d);
  return {
    id: ledgerId(),
    type: "adjustment",
    productId: product?.id,
    productTitle: product?.title ?? "Unknown product",
    quantity: Math.abs(d),
    before,
    after,
    delta: d,
    user: user ?? "—",
    note: note ?? "",
    createdAt: at ?? Date.now(),
  };
}

/**
 * Build a batch of sale entries from a completed sale.
 * Returns one entry per line item.
 */
export function makeSaleEntriesForCart({ items, products, user, at }) {
  const productById = new Map(
    (products || []).map((p) => [p.id, p])
  );
  return (items || []).map((item) => {
    const product = productById.get(item.id) || {
      id: item.id,
      title: item.title,
      stock: item.stock ?? 0,
    };
    return makeSaleEntry({
      product,
      quantity: item.quantity,
      user,
      at,
    });
  });
}
