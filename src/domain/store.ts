import { COUPONS, cartTotal, setCartQuantity, suggestedCompanion, upsertCart } from "./cart";
import { HERO_IDS, PRODUCTS } from "./catalog";
import { compareProducts } from "./compare";
import { checkInventory, checkSizeAvailability } from "./inventory";
import { buildOutfit } from "./outfit";
import { DEFAULT_PROFILE, intentToQuery, parseIntent } from "./profile";
import { getRecommendations } from "./recommendations";
import { getProductDetails, mergeQuery, searchProducts } from "./search";
import type {
  AppState,
  SearchQuery,
  StyleProfile,
} from "./types";

let state: AppState = createInitialState();
const listeners = new Set<() => void>();

function createInitialState(): AppState {
  const collectionQuery: SearchQuery = {};
  return {
    profile: DEFAULT_PROFILE,
    cart: [],
    wardrobe: [...DEFAULT_PROFILE.previousLikes],
    collectionQuery,
    collectionResults: searchProducts(collectionQuery),
    recommendations: [],
    compareIds: [],
    pendingConfirmation: null,
    agentActivity: [],
    appliedCoupon: null,
    lastIntent: "",
    stylistMessages: [],
  };
}

export function getState() {
  return state;
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setState(patch: Partial<AppState> | ((current: AppState) => Partial<AppState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((listener) => listener());
}

function activity(tool: string, detail: string) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    tool,
    detail,
    at: Date.now(),
  };
  setState({ agentActivity: [entry, ...state.agentActivity].slice(0, 10) });
}

export function getUserStyleProfile() {
  activity("getUserStyleProfile", `Identity: ${state.profile.identity}`);
  return state.profile;
}

export function resetCollection(query: SearchQuery = {}) {
  const results = searchProducts(query);
  activity("searchProducts", `${results.length} pieces in the current edit`);
  setState({ collectionQuery: query, collectionResults: results });
  return results;
}

export function searchProductsTool(query: SearchQuery = {}) {
  const merged = mergeQuery(state.collectionQuery, query);
  const results = searchProducts(merged);
  activity("searchProducts", `${results.length} pieces in the current edit`);
  setState({ collectionQuery: merged, collectionResults: results });
  return results;
}

export function getProductDetailsTool(id: string) {
  const product = getProductDetails(id);
  activity("getProductDetails", product.name);
  return product;
}

export function getRecommendationsTool(intent?: string, limit = 3) {
  const text = intent ?? state.lastIntent;
  const recs = getRecommendations(state.profile, text, limit);
  activity("getRecommendations", `${recs.length} pieces ranked for this brief`);
  setState({
    lastIntent: text,
    recommendations: recs,
    collectionResults: recs.map((r) => r.product),
    collectionQuery: intentToQuery(parseIntent(text)),
  });
  return recs;
}

export function compareProductsTool(ids?: string[]) {
  const compareIds = ids?.length ? ids : state.compareIds;
  const result = compareProducts(compareIds, state.profile, state.lastIntent);
  activity("compareProducts", `Verdict: ${result.products.find((p) => p.id === result.winnerId)?.name}`);
  setState({ compareIds });
  return result;
}

export function checkInventoryTool(productId: string) {
  const result = checkInventory(productId);
  activity("checkInventory", `${result.name}: ${result.available ? "in atelier" : "waitlist"}`);
  return result;
}

export function checkSizeAvailabilityTool(productId: string, size: string) {
  const result = checkSizeAvailability(productId, size);
  activity(
    "checkSizeAvailability",
    `${result.name} size ${size}: ${result.available ? "available" : "not in size"}`,
  );
  return result;
}

export function buildOutfitTool(anchorId?: string) {
  const outfit = buildOutfit(anchorId);
  activity("buildOutfit", `${outfit.pieces.length} pieces composed`);
  return outfit;
}

export function addToWishlist(productId: string) {
  const product = getProductDetails(productId);
  setState({
    pendingConfirmation: { kind: "add_to_wardrobe", productId, name: product.name },
  });
  activity("addToWishlist", `Confirmation required for ${product.name}`);
  return { status: "pending_confirmation" as const, productId, name: product.name };
}

export function addToCart(productId: string, size?: string) {
  const product = getProductDetails(productId);
  const resolved = size ?? Object.keys(product.inventory)[0];
  setState({
    pendingConfirmation: {
      kind: "add_to_cart",
      productId,
      name: product.name,
      size: resolved,
      price: product.price,
    },
  });
  activity("addToCart", `Confirmation required for ${product.name}`);
  return {
    status: "pending_confirmation" as const,
    productId,
    name: product.name,
    size: resolved,
    price: product.price,
  };
}

export function updateCart(productId: string, size: string, quantity: number) {
  const cart = setCartQuantity(state.cart, productId, size, quantity);
  setState({ cart });
  activity("updateCart", `Cart updated (${cart.length} lines)`);
  return cart;
}

export function getAvailableCoupons() {
  activity("getAvailableCoupons", `${COUPONS.length} private courtesy available`);
  return COUPONS;
}

export function applyCoupon(code: string) {
  const coupon = COUPONS.find((c) => c.code.toLowerCase() === code.toLowerCase());
  if (!coupon) throw new Error("No such courtesy");
  setState({
    pendingConfirmation: { kind: "apply_coupon", code: coupon.code, label: coupon.label },
  });
  return { status: "pending_confirmation" as const, ...coupon };
}

export function placeOrder() {
  setState({
    pendingConfirmation: { kind: "place_order", total: cartTotal(state.cart) },
  });
  activity("placeOrder", "High-impact action — waiting for you");
  return { status: "pending_confirmation" as const, kind: "place_order" };
}

export function changeDeliveryAddress(address: string) {
  setState({ pendingConfirmation: { kind: "change_address", address } });
  activity("changeDeliveryAddress", "High-impact action — waiting for you");
  return { status: "pending_confirmation" as const };
}

export function requestPayment() {
  setState({ pendingConfirmation: { kind: "payment", total: cartTotal(state.cart) } });
  activity("payment", "High-impact action — waiting for you");
  return { status: "pending_confirmation" as const };
}

export function cancelPending() {
  setState({ pendingConfirmation: null });
}

export function confirmPending() {
  const pending = state.pendingConfirmation;
  if (!pending) return { status: "idle" as const };

  if (pending.kind === "add_to_cart") {
    setState({
      cart: upsertCart(state.cart, pending.productId, pending.size),
      pendingConfirmation: null,
    });
    activity("confirm", `${pending.name} added to cart`);
    return { status: "added_to_cart" as const, productId: pending.productId };
  }

  if (pending.kind === "add_to_wardrobe") {
    const wardrobe = state.wardrobe.includes(pending.productId)
      ? state.wardrobe
      : [...state.wardrobe, pending.productId];
    setState({ wardrobe, pendingConfirmation: null });
    activity("confirm", `${pending.name} added to wardrobe`);
    return { status: "added_to_wardrobe" as const };
  }

  if (pending.kind === "apply_coupon") {
    setState({ appliedCoupon: pending.code, pendingConfirmation: null });
    return { status: "coupon_applied" as const };
  }

  setState({ pendingConfirmation: null });
  activity("confirm", "Acknowledged. No order was transmitted — this is a private atelier preview.");
  return { status: "acknowledged" as const, kind: pending.kind };
}

export function updateProfile(patch: Partial<StyleProfile>) {
  setState({ profile: { ...state.profile, ...patch } });
}

export function setStylistThread(
  messages: AppState["stylistMessages"],
  extras?: Partial<AppState>,
) {
  setState({ stylistMessages: messages, ...extras });
}

export function cartSuggestion() {
  return suggestedCompanion(state.cart);
}

export function resetSession() {
  state = createInitialState();
  listeners.forEach((listener) => listener());
}

export const DEMO_INTENT =
  "I want a new shoe for a date. It's a vintage date and I'm going to wear a black suit.";

export function runConsult(intent: string) {
  getUserStyleProfile();
  const parsed = parseIntent(intent);
  searchProductsTool(intentToQuery(parsed));
  const recs = getRecommendationsTool(intent, 3);
  const top = recs[0];
  const copy = top
    ? `Understood.\n\nFor a vintage-inspired date look with a black suit, I'd avoid overly formal black Oxfords.\n\nI've selected ${recs.length} options that introduce warmth and character while keeping the overall silhouette refined.`
    : "I need a little more from you — an occasion, a mood, or a piece you already own.";

  setState({
    lastIntent: intent,
    stylistMessages: [
      {
        id: "client-1",
        role: "client",
        text: intent,
      },
      {
        id: "stylist-1",
        role: "stylist",
        text: copy,
        productIds: recs.map((r) => r.product.id),
      },
    ],
  });

  if (top) {
    checkInventoryTool(top.product.id);
    const size = Object.keys(top.product.inventory)[2] ?? Object.keys(top.product.inventory)[0];
    checkSizeAvailabilityTool(top.product.id, size);
  }

  return recs;
}

export { PRODUCTS, HERO_IDS, cartTotal };
