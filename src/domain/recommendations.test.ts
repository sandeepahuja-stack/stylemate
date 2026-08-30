import { describe, expect, it, beforeEach } from "vitest";
import { PRODUCTS, HERO_IDS } from "./catalog";
import { DEFAULT_PROFILE } from "./profile";
import { getRecommendations } from "./recommendations";
import { searchProducts } from "./search";
import { compareProducts } from "./compare";
import { checkSizeAvailability } from "./inventory";
import {
  addToCart,
  cancelPending,
  confirmPending,
  getState,
  resetSession,
} from "./store";

describe("catalog", () => {
  it("has at least 100 products across required categories", () => {
    const categories = new Set(PRODUCTS.map((p) => p.category));
    expect(PRODUCTS.length).toBeGreaterThanOrEqual(100);
    for (const category of ["shoes", "shirts", "trousers", "jackets", "suits", "accessories"]) {
      expect(categories.has(category as never)).toBe(true);
    }
    for (const product of PRODUCTS) {
      expect(product.id).toBeTruthy();
      expect(product.images.length).toBeGreaterThan(0);
      expect(product.inventory).toBeTruthy();
    }
  });
});

describe("recommendations T1", () => {
  it("ranks burgundy penny loafer above black oxford for vintage date + black suit", () => {
    const recs = getRecommendations(
      DEFAULT_PROFILE,
      "I want a new shoe for a date. It's a vintage date and I'm going to wear a black suit.",
      8,
    );
    expect(recs[0].product.id).toBe(HERO_IDS.loafer);
    const oxford = recs.find((r) => r.product.id === HERO_IDS.oxford);
    if (oxford) expect(oxford.match).toBeLessThan(recs[0].match);
  });
});

describe("search", () => {
  it("filters leather and excludes bright when asked", () => {
    const leather = searchProducts({ materials: ["Leather"], excludeBright: true });
    expect(leather.every((p) => p.materials.some((m) => /leather/i.test(m)))).toBe(true);
    expect(leather.every((p) => !p.tags.includes("bright"))).toBe(true);
  });
});

describe("compare", () => {
  it("returns a verdict preferring the loafer", () => {
    const result = compareProducts(
      [HERO_IDS.oxford, HERO_IDS.chelsea, HERO_IDS.loafer],
      DEFAULT_PROFILE,
      "vintage date black suit shoes",
    );
    expect(result.winnerId).toBe(HERO_IDS.loafer);
    expect(result.verdict.toLowerCase()).toContain("burgundy");
  });
});

describe("cart confirmation", () => {
  beforeEach(() => resetSession());

  it("does not mutate cart until confirmed", () => {
    addToCart(HERO_IDS.loafer, "9");
    expect(getState().cart).toHaveLength(0);
    expect(getState().pendingConfirmation?.kind).toBe("add_to_cart");
    cancelPending();
    expect(getState().cart).toHaveLength(0);
    addToCart(HERO_IDS.loafer, "9");
    confirmPending();
    expect(getState().cart).toEqual([{ productId: HERO_IDS.loafer, size: "9", quantity: 1 }]);
  });
});

describe("inventory", () => {
  it("reports size availability", () => {
    const result = checkSizeAvailability(HERO_IDS.loafer, "9");
    expect(result.available).toBe(true);
  });
});
