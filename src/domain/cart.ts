import type { CartItem, Coupon } from "./types";
import { getProductDetails } from "./search";
import { HERO_IDS } from "./catalog";

export const COUPONS: Coupon[] = [
  {
    code: "PRIVATE",
    label: "Private client courtesy",
    description: "A discreet atelier courtesy on made-to-order finishing.",
  },
];

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, item) => {
    const product = getProductDetails(item.productId);
    return sum + product.price * item.quantity;
  }, 0);
}

export function suggestedCompanion(items: CartItem[]) {
  const ids = new Set(items.map((i) => i.productId));
  if (ids.has(HERO_IDS.loafer) && !ids.has(HERO_IDS.shirt)) {
    return getProductDetails(HERO_IDS.shirt);
  }
  if (ids.has(HERO_IDS.suit) && !ids.has(HERO_IDS.loafer)) {
    return getProductDetails(HERO_IDS.loafer);
  }
  return null;
}

export function upsertCart(items: CartItem[], productId: string, size: string, quantity = 1): CartItem[] {
  const existing = items.find((i) => i.productId === productId && i.size === size);
  if (existing) {
    return items.map((i) =>
      i.productId === productId && i.size === size ? { ...i, quantity: i.quantity + quantity } : i,
    );
  }
  return [...items, { productId, size, quantity }];
}

export function setCartQuantity(items: CartItem[], productId: string, size: string, quantity: number): CartItem[] {
  if (quantity <= 0) return items.filter((i) => !(i.productId === productId && i.size === size));
  return items.map((i) => (i.productId === productId && i.size === size ? { ...i, quantity } : i));
}
