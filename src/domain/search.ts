import { PRODUCTS, getProductById } from "./catalog";
import type { Product, SearchQuery } from "./types";

const BRIGHT = /lime|signal red|electric|neon|bright/i;

export function searchProducts(query: SearchQuery = {}): Product[] {
  return PRODUCTS.filter((product) => matchesQuery(product, query));
}

export function matchesQuery(product: Product, query: SearchQuery): boolean {
  if (query.ids?.length) return query.ids.includes(product.id);
  if (query.category && product.category !== query.category) return false;
  if (query.maxPrice && product.price > query.maxPrice) return false;
  if (query.excludeBright && (product.tags.includes("bright") || BRIGHT.test(product.colors.join(" ")))) {
    return false;
  }
  if (query.materials?.length) {
    const wanted = query.materials.map((m) => m.toLowerCase());
    const has = product.materials.some((m) => wanted.includes(m.toLowerCase()));
    if (!has) return false;
  }
  if (query.styles?.length) {
    const wanted = query.styles.map((s) => s.toLowerCase());
    const has = product.style.some((s) => wanted.some((w) => s.toLowerCase().includes(w)));
    if (!has && !wanted.some((w) => product.tags.join(" ").toLowerCase().includes(w))) return false;
  }
  if (query.occasions?.length) {
    const wanted = query.occasions.map((s) => s.toLowerCase());
    const has = product.occasion.some((o) => wanted.some((w) => o.toLowerCase().includes(w)));
    if (!has) return false;
  }
  if (query.colors?.length) {
    const wanted = query.colors.map((s) => s.toLowerCase());
    const has = product.colors.some((c) => wanted.some((w) => c.toLowerCase().includes(w)));
    if (!has) return false;
  }
  if (query.text) {
    const haystack = `${product.name} ${product.brand} ${product.description} ${product.tags.join(" ")} ${product.materials.join(" ")}`.toLowerCase();
    const tokens = query.text
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 3 && !["with", "that", "this", "have", "want", "something", "wearing"].includes(t));
    if (tokens.length && !tokens.some((t) => haystack.includes(t))) {
      // conversational constraints may not match product text; don't hard-fail if structured filters exist
      if (!query.category && !query.materials?.length && !query.styles?.length) return false;
    }
  }
  return true;
}

export function getProductDetails(id: string) {
  const product = getProductById(id);
  if (!product) throw new Error(`Product not found: ${id}`);
  return product;
}

export function mergeQuery(current: SearchQuery, next: SearchQuery): SearchQuery {
  return {
    ...current,
    ...next,
    materials: next.materials ?? current.materials,
    styles: next.styles ?? current.styles,
    occasions: next.occasions ?? current.occasions,
    colors: next.colors ?? current.colors,
    excludeBright: next.excludeBright ?? current.excludeBright,
  };
}
