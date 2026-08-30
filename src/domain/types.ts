export type Category =
  | "shoes"
  | "shirts"
  | "trousers"
  | "jackets"
  | "suits"
  | "accessories";

export type Product = {
  id: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  images: string[];
  colors: string[];
  materials: string[];
  sizes: string[];
  fit: string;
  style: string[];
  occasion: string[];
  description: string;
  craftsmanship: string;
  inventory: Record<string, number>;
  tags: string[];
};

export type StyleProfile = {
  identity: string;
  preferredColors: string[];
  preferredSilhouettes: string[];
  preferredMaterials: string[];
  occasions: string[];
  budgetMin: number;
  budgetMax: number;
  fitPreferences: string[];
  previousLikes: string[];
  previousPurchases: string[];
  evolution: { year: string; note: string; intensity: number }[];
};

export type SearchQuery = {
  text?: string;
  category?: Category;
  materials?: string[];
  styles?: string[];
  occasions?: string[];
  colors?: string[];
  excludeBright?: boolean;
  maxPrice?: number;
  ids?: string[];
};

export type ParsedIntent = {
  text: string;
  category?: Category;
  occasions: string[];
  styles: string[];
  materials: string[];
  pairing: string[];
  understated: boolean;
  excludeBright: boolean;
};

export type Recommendation = {
  product: Product;
  match: number;
  reasons: string[];
  verdict?: string;
};

export type CartItem = {
  productId: string;
  size: string;
  quantity: number;
};

export type Confirmation =
  | {
      kind: "add_to_cart";
      productId: string;
      name: string;
      size: string;
      price: number;
    }
  | {
      kind: "add_to_wardrobe";
      productId: string;
      name: string;
    }
  | {
      kind: "apply_coupon";
      code: string;
      label: string;
    }
  | {
      kind: "place_order";
      total: number;
    }
  | {
      kind: "cancel_order";
      orderId: string;
    }
  | {
      kind: "change_address";
      address: string;
    }
  | {
      kind: "payment";
      total: number;
    };

export type AgentActivity = {
  id: string;
  tool: string;
  detail: string;
  at: number;
};

export type OutfitPiece = {
  role: string;
  product: Product;
  note: string;
};

export type Coupon = {
  code: string;
  label: string;
  description: string;
};

export type CompareRow = {
  key: string;
  label: string;
  values: Record<string, string>;
};

export type AppState = {
  profile: StyleProfile;
  cart: CartItem[];
  wardrobe: string[];
  collectionQuery: SearchQuery;
  collectionResults: Product[];
  recommendations: Recommendation[];
  compareIds: string[];
  pendingConfirmation: Confirmation | null;
  agentActivity: AgentActivity[];
  appliedCoupon: string | null;
  lastIntent: string;
  stylistMessages: StylistMessage[];
};

export type StylistMessage = {
  id: string;
  role: "client" | "stylist";
  text: string;
  productIds?: string[];
};
