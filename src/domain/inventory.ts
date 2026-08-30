import { getProductDetails } from "./search";

export function checkInventory(productId: string) {
  const product = getProductDetails(productId);
  const total = Object.values(product.inventory).reduce((a, b) => a + b, 0);
  return {
    productId,
    name: product.name,
    available: total > 0,
    total,
    bySize: product.inventory,
  };
}

export function checkSizeAvailability(productId: string, size: string) {
  const product = getProductDetails(productId);
  const qty = product.inventory[size] ?? 0;
  return {
    productId,
    name: product.name,
    size,
    available: qty > 0,
    quantity: qty,
  };
}
