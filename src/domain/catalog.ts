import { slugify } from "@/lib/format";
import {
  ACCESSORY_IMAGES,
  IMG,
  JACKET_IMAGES,
  SHIRT_IMAGES,
  SHOE_IMAGES,
  SUIT_IMAGES,
  TROUSER_IMAGES,
} from "./images";
import type { Category, Product } from "./types";

const BRANDS = [
  "Arcadia Leather",
  "Maison Vale",
  "Atelier Noir",
  "Calder & Sons",
  "Holborn Cloth",
  "Vesper Atelier",
  "Sable & Co.",
  "Lumen Horology",
];

const CRAFT = [
  "Hand-finished in Florence",
  "Cut in Naples, assembled in Jaipur",
  "Goodyear welted in Northampton",
  "Half-canvassed in a small Milanese atelier",
  "Vegetable-tanned in Tuscany",
  "Woven in Como, tailored in Delhi",
];

const SHOE_SIZES = ["7", "8", "9", "10", "11"];
const APPAREL_SIZES = ["S", "M", "L", "XL"];
const TROUSER_SIZES = ["30", "32", "34", "36", "38"];
const OS = ["OS"];

function inventory(sizes: string[], qty = 5): Record<string, number> {
  return Object.fromEntries(sizes.map((size, i) => [size, i === 0 ? 2 : qty]));
}

function pick<T>(list: T[], index: number) {
  return list[index % list.length];
}

function makeProduct(
  partial: Omit<Product, "id" | "inventory"> & { sizes: string[]; stock?: number },
): Product {
  return {
    ...partial,
    id: slugify(partial.name),
    inventory: inventory(partial.sizes, partial.stock ?? 5),
  };
}

const HERO: Product[] = [
  makeProduct({
    name: "Burgundy Penny Loafer",
    category: "shoes",
    brand: "Arcadia Leather",
    price: 6499,
    images: [IMG.loafer, IMG.derby],
    colors: ["Burgundy"],
    materials: ["Leather", "Calfskin"],
    sizes: SHOE_SIZES,
    fit: "Slim",
    style: ["Vintage", "Understated", "Tailored"],
    occasion: ["Date night", "Dinner", "Weekend"],
    description:
      "Full-grain calfskin with a quiet oxblood burnish. A vintage-inspired loafer that warms black tailoring without becoming theatrical.",
    craftsmanship: "Goodyear welted in Northampton",
    tags: ["vintage", "loafer", "muted", "leather", "date", "understated", "demo-top"],
    stock: 4,
  }),
  makeProduct({
    name: "Espresso Suede Chelsea",
    category: "shoes",
    brand: "Arcadia Leather",
    price: 7290,
    images: [IMG.chelsea, IMG.boots],
    colors: ["Espresso"],
    materials: ["Suede", "Leather"],
    sizes: SHOE_SIZES,
    fit: "Slim",
    style: ["Vintage", "Relaxed tailoring"],
    occasion: ["Date night", "Weekend", "Travel"],
    description:
      "Soft espresso suede with a discreet elastic gusset. Alternative texture for evenings that want depth rather than polish.",
    craftsmanship: "Hand-finished in Florence",
    tags: ["vintage", "chelsea", "suede", "muted", "date"],
  }),
  makeProduct({
    name: "Polished Black Oxford",
    category: "shoes",
    brand: "Calder & Sons",
    price: 8990,
    images: [IMG.oxford, IMG.derby],
    colors: ["Black"],
    materials: ["Leather"],
    sizes: SHOE_SIZES,
    fit: "Structured",
    style: ["Formal", "Boardroom"],
    occasion: ["Business", "Ceremony"],
    description:
      "A severe, high-shine Oxford. Impeccable for the boardroom; too official for a vintage date.",
    craftsmanship: "Goodyear welted in Northampton",
    tags: ["oxford", "formal", "boardroom", "leather"],
  }),
  makeProduct({
    name: "Midnight Wool Suit",
    category: "suits",
    brand: "Maison Vale",
    price: 48500,
    images: [IMG.suit, IMG.suit2],
    colors: ["Black", "Midnight"],
    materials: ["Wool"],
    sizes: APPAREL_SIZES,
    fit: "Tailored",
    style: ["Tailored", "Structured", "Minimal"],
    occasion: ["Date night", "Dinner", "Business casual"],
    description:
      "Italian Super 150s wool, half-canvassed. The private client's black canvas — severe until warmth is introduced elsewhere.",
    craftsmanship: "Half-canvassed in a small Milanese atelier",
    tags: ["suit", "black-tailoring", "anchor", "wool"],
  }),
  makeProduct({
    name: "Silk-Blend Cream Shirt",
    category: "shirts",
    brand: "Vesper Atelier",
    price: 4200,
    images: [IMG.cream, IMG.shirt],
    colors: ["Cream"],
    materials: ["Silk", "Cotton"],
    sizes: APPAREL_SIZES,
    fit: "Relaxed tailoring",
    style: ["Understated", "Vintage", "Minimal"],
    occasion: ["Date night", "Dinner", "Weekend"],
    description:
      "Replaces stark white. The silk blend catches low light and softens the contrast against black tailoring.",
    craftsmanship: "Woven in Como, tailored in Delhi",
    tags: ["cream", "muted", "date", "complete-the-look"],
  }),
  makeProduct({
    name: "Minimal Gold Watch",
    category: "accessories",
    brand: "Lumen Horology",
    price: 18500,
    images: [IMG.watch, IMG.watch2],
    colors: ["Gold", "Ivory"],
    materials: ["Gold", "Leather"],
    sizes: OS,
    fit: "Fine",
    style: ["Minimal", "Understated"],
    occasion: ["Date night", "Dinner", "Travel"],
    description:
      "A thin case and an unhurried dial. Metallic warmth, not a statement piece.",
    craftsmanship: "Hand-finished in Florence",
    tags: ["watch", "gold-accent", "complete-the-look"],
  }),
  makeProduct({
    name: "Dark Brown Belt",
    category: "accessories",
    brand: "Sable & Co.",
    price: 2800,
    images: [IMG.belt, IMG.bag],
    colors: ["Dark brown"],
    materials: ["Leather"],
    sizes: ["85", "90", "95", "100"],
    fit: "Classic",
    style: ["Understated", "Vintage"],
    occasion: ["Dinner", "Business casual", "Weekend"],
    description:
      "Vegetable-tanned leather with a quiet brass buckle. The uncredited line that finishes an outfit.",
    craftsmanship: "Vegetable-tanned in Tuscany",
    tags: ["belt", "leather", "complete-the-look"],
  }),
];

type Silhouette = {
  base: string;
  category: Category;
  materials: string[];
  fit: string;
  styles: string[];
  occasions: string[];
  tags: string[];
  sizes: string[];
  price: number;
  images: string[];
};

const SILHOUETTES: Silhouette[] = [
  { base: "Penny Loafer", category: "shoes", materials: ["Leather"], fit: "Slim", styles: ["Vintage", "Understated"], occasions: ["Date night", "Dinner"], tags: ["loafer", "vintage", "leather"], sizes: SHOE_SIZES, price: 6200, images: SHOE_IMAGES },
  { base: "Chelsea Boot", category: "shoes", materials: ["Suede", "Leather"], fit: "Slim", styles: ["Vintage", "Relaxed tailoring"], occasions: ["Weekend", "Travel"], tags: ["chelsea", "suede"], sizes: SHOE_SIZES, price: 7100, images: SHOE_IMAGES },
  { base: "Cap-Toe Derby", category: "shoes", materials: ["Leather"], fit: "Structured", styles: ["Tailored"], occasions: ["Dinner", "Business casual"], tags: ["derby", "leather"], sizes: SHOE_SIZES, price: 7800, images: SHOE_IMAGES },
  { base: "Suede Driver", category: "shoes", materials: ["Suede"], fit: "Relaxed", styles: ["Casual", "Weekend"], occasions: ["Weekend", "Travel"], tags: ["driver", "casual", "suede"], sizes: SHOE_SIZES, price: 5400, images: SHOE_IMAGES },
  { base: "Monk Strap", category: "shoes", materials: ["Leather"], fit: "Structured", styles: ["Vintage", "Tailored"], occasions: ["Dinner", "Date night"], tags: ["monk", "leather", "vintage"], sizes: SHOE_SIZES, price: 8400, images: SHOE_IMAGES },
  { base: "Poplin Shirt", category: "shirts", materials: ["Cotton"], fit: "Tailored", styles: ["Tailored", "Minimal"], occasions: ["Business casual", "Dinner"], tags: ["shirt", "cotton"], sizes: APPAREL_SIZES, price: 3800, images: SHIRT_IMAGES },
  { base: "Linen Camp Collar", category: "shirts", materials: ["Linen"], fit: "Relaxed", styles: ["Casual", "Travel"], occasions: ["Weekend", "Travel"], tags: ["linen", "casual"], sizes: APPAREL_SIZES, price: 3600, images: SHIRT_IMAGES },
  { base: "Oxford Cloth Shirt", category: "shirts", materials: ["Cotton"], fit: "Relaxed tailoring", styles: ["Business casual"], occasions: ["Business casual", "Weekend"], tags: ["oxford-cloth", "cotton"], sizes: APPAREL_SIZES, price: 3400, images: SHIRT_IMAGES },
  { base: "Silk Evening Shirt", category: "shirts", materials: ["Silk"], fit: "Tailored", styles: ["Vintage", "Understated"], occasions: ["Date night", "Dinner"], tags: ["silk", "date"], sizes: APPAREL_SIZES, price: 5600, images: SHIRT_IMAGES },
  { base: "Wool Trouser", category: "trousers", materials: ["Wool"], fit: "Tailored", styles: ["Tailored", "Structured"], occasions: ["Dinner", "Business casual"], tags: ["wool", "tailored"], sizes: TROUSER_SIZES, price: 7200, images: TROUSER_IMAGES },
  { base: "Linen Trouser", category: "trousers", materials: ["Linen"], fit: "Relaxed", styles: ["Casual", "Travel"], occasions: ["Weekend", "Travel"], tags: ["linen", "casual"], sizes: TROUSER_SIZES, price: 4900, images: TROUSER_IMAGES },
  { base: "Pleated Flannel", category: "trousers", materials: ["Wool"], fit: "Relaxed tailoring", styles: ["Vintage", "Tailored"], occasions: ["Dinner", "Date night"], tags: ["flannel", "vintage"], sizes: TROUSER_SIZES, price: 6800, images: TROUSER_IMAGES },
  { base: "Straight Denim", category: "trousers", materials: ["Cotton"], fit: "Straight", styles: ["Casual", "Weekend"], occasions: ["Weekend"], tags: ["denim", "casual"], sizes: TROUSER_SIZES, price: 4500, images: TROUSER_IMAGES },
  { base: "Unstructured Blazer", category: "jackets", materials: ["Wool", "Linen"], fit: "Relaxed tailoring", styles: ["Relaxed tailoring", "Minimal"], occasions: ["Dinner", "Business casual"], tags: ["blazer"], sizes: APPAREL_SIZES, price: 14500, images: JACKET_IMAGES },
  { base: "Leather Field Jacket", category: "jackets", materials: ["Leather"], fit: "Structured", styles: ["Vintage", "Travel"], occasions: ["Weekend", "Travel"], tags: ["leather", "jacket"], sizes: APPAREL_SIZES, price: 22000, images: JACKET_IMAGES },
  { base: "Cashmere Overcoat", category: "jackets", materials: ["Cashmere", "Wool"], fit: "Structured", styles: ["Minimal", "Tailored"], occasions: ["Dinner", "Travel"], tags: ["coat", "cashmere"], sizes: APPAREL_SIZES, price: 32000, images: JACKET_IMAGES },
  { base: "Suede Harrington", category: "jackets", materials: ["Suede"], fit: "Slim", styles: ["Vintage", "Casual"], occasions: ["Weekend", "Date night"], tags: ["suede", "vintage"], sizes: APPAREL_SIZES, price: 16800, images: JACKET_IMAGES },
  { base: "Single-Breasted Suit", category: "suits", materials: ["Wool"], fit: "Tailored", styles: ["Tailored", "Minimal"], occasions: ["Dinner", "Business casual"], tags: ["suit", "wool"], sizes: APPAREL_SIZES, price: 42000, images: SUIT_IMAGES },
  { base: "Relaxed Linen Suit", category: "suits", materials: ["Linen"], fit: "Relaxed", styles: ["Casual", "Travel"], occasions: ["Weekend", "Travel"], tags: ["linen", "casual", "suit"], sizes: APPAREL_SIZES, price: 28500, images: SUIT_IMAGES },
  { base: "Double-Breasted Dinner Suit", category: "suits", materials: ["Wool"], fit: "Structured", styles: ["Formal", "Vintage"], occasions: ["Dinner", "Ceremony"], tags: ["dinner", "formal"], sizes: APPAREL_SIZES, price: 56000, images: SUIT_IMAGES },
  { base: "Dress Watch", category: "accessories", materials: ["Leather", "Steel"], fit: "Fine", styles: ["Minimal"], occasions: ["Dinner", "Date night"], tags: ["watch"], sizes: OS, price: 14200, images: ACCESSORY_IMAGES },
  { base: "Calfskin Belt", category: "accessories", materials: ["Leather"], fit: "Classic", styles: ["Understated"], occasions: ["Dinner", "Business casual"], tags: ["belt", "leather"], sizes: ["85", "90", "95"], price: 2600, images: ACCESSORY_IMAGES },
  { base: "Structured Tote", category: "accessories", materials: ["Leather"], fit: "Structured", styles: ["Minimal"], occasions: ["Travel", "Business casual"], tags: ["bag", "leather"], sizes: OS, price: 9800, images: ACCESSORY_IMAGES },
  { base: "Silk Pocket Square", category: "accessories", materials: ["Silk"], fit: "Fine", styles: ["Vintage", "Understated"], occasions: ["Date night", "Dinner"], tags: ["accessory", "silk"], sizes: OS, price: 1800, images: ACCESSORY_IMAGES },
];

const COLORWAYS = [
  { color: "Burgundy", muted: true, bright: false },
  { color: "Oxblood", muted: true, bright: false },
  { color: "Espresso", muted: true, bright: false },
  { color: "Black", muted: true, bright: false },
  { color: "Cream", muted: true, bright: false },
  { color: "Deep navy", muted: true, bright: false },
  { color: "Camel", muted: true, bright: false },
  { color: "Ivory", muted: true, bright: false },
  { color: "Charcoal", muted: true, bright: false },
  { color: "Forest", muted: true, bright: false },
  { color: "Electric lime", muted: false, bright: true },
  { color: "Signal red", muted: false, bright: true },
];

function buildGenerated(): Product[] {
  const items: Product[] = [];
  let n = 0;
  for (const silhouette of SILHOUETTES) {
    for (const colorway of COLORWAYS) {
      if (silhouette.category === "suits" && colorway.bright) continue;
      if (silhouette.category === "shoes" && colorway.color === "Electric lime") continue;
      const name = `${colorway.color} ${silhouette.base}`;
      if (HERO.some((h) => h.name === name)) continue;
      n += 1;
      const tags = [...silhouette.tags];
      if (colorway.muted) tags.push("muted");
      if (colorway.bright) tags.push("bright");
      if (colorway.color === "Burgundy" || colorway.color === "Oxblood") tags.push("vintage");
      items.push(
        makeProduct({
          name,
          category: silhouette.category,
          brand: pick(BRANDS, n),
          price: silhouette.price + (n % 7) * 150,
          images: [pick(silhouette.images, n), pick(silhouette.images, n + 1)],
          colors: [colorway.color],
          materials: silhouette.materials,
          sizes: silhouette.sizes,
          fit: silhouette.fit,
          style: silhouette.styles,
          occasion: silhouette.occasions,
          description: `${name} from a tightly edited run. ${pick(CRAFT, n)}. Designed for a wardrobe that prefers intention over volume.`,
          craftsmanship: pick(CRAFT, n),
          tags,
        }),
      );
    }
  }
  return items;
}

export const PRODUCTS: Product[] = [...HERO, ...buildGenerated()];

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function getProductById(id: string) {
  return PRODUCT_BY_ID.get(id);
}

export function getProductsByCategory(category: Category) {
  return PRODUCTS.filter((p) => p.category === category);
}

export const HERO_IDS = {
  loafer: slugify("Burgundy Penny Loafer"),
  chelsea: slugify("Espresso Suede Chelsea"),
  oxford: slugify("Polished Black Oxford"),
  suit: slugify("Midnight Wool Suit"),
  shirt: slugify("Silk-Blend Cream Shirt"),
  watch: slugify("Minimal Gold Watch"),
  belt: slugify("Dark Brown Belt"),
} as const;
