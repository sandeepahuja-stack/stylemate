import type { ParsedIntent, SearchQuery, StyleProfile } from "./types";

export const DEFAULT_PROFILE: StyleProfile = {
  identity: "Modern Vintage Minimalist",
  preferredColors: ["Black", "Burgundy", "Earth tones", "Cream", "Deep navy"],
  preferredSilhouettes: ["Tailored", "Relaxed tailoring", "Slim", "Structured"],
  preferredMaterials: ["Leather", "Wool", "Suede", "Linen", "Cotton"],
  occasions: ["Date night", "Dinner", "Business casual", "Weekend", "Travel"],
  budgetMin: 2000,
  budgetMax: 25000,
  fitPreferences: ["Tailored", "Slim"],
  previousLikes: ["burgundy-penny-loafer", "silk-blend-cream-shirt"],
  previousPurchases: ["midnight-wool-suit"],
  evolution: [
    { year: "2021", note: "Sharp corporate tailoring", intensity: 33 },
    { year: "2022", note: "Softer neutrals", intensity: 50 },
    { year: "2023", note: "Vintage texture", intensity: 66 },
    { year: "2024", note: "Modern vintage minimalist", intensity: 80 },
  ],
};

export function parseIntent(text: string): ParsedIntent {
  const q = text.toLowerCase();
  const occasions: string[] = [];
  const styles: string[] = [];
  const materials: string[] = [];
  const pairing: string[] = [];

  if (/(date|dinner|evening)/.test(q)) occasions.push("Date night", "Dinner");
  if (/(weekend|casual)/.test(q)) occasions.push("Weekend");
  if (/(travel|delhi)/.test(q)) occasions.push("Travel");
  if (/(business|office)/.test(q)) occasions.push("Business casual");

  if (/vintage/.test(q)) styles.push("Vintage");
  if (/(understated|quiet|subtle|minimal)/.test(q)) styles.push("Understated", "Minimal");
  if (/(casual|more casual)/.test(q)) styles.push("Casual");
  if (/(formal|boardroom)/.test(q)) styles.push("Formal");
  if (/(sophisticated|refined)/.test(q)) styles.push("Tailored");

  if (/leather/.test(q)) materials.push("Leather");
  if (/suede/.test(q)) materials.push("Suede");
  if (/wool/.test(q)) materials.push("Wool");
  if (/linen/.test(q)) materials.push("Linen");
  if (/silk/.test(q)) materials.push("Silk");

  if (/black suit/.test(q)) pairing.push("black suit");
  if (/trousers I bought|last month/.test(q)) pairing.push("existing trousers");

  let category: ParsedIntent["category"];
  if (/(shoe|loafer|boot|oxford)/.test(q)) category = "shoes";
  else if (/(shirt|shirting)/.test(q)) category = "shirts";
  else if (/(trouser|pant)/.test(q)) category = "trousers";
  else if (/(jacket|blazer|coat)/.test(q)) category = "jackets";
  else if (/suit/.test(q) && !/black suit/.test(q)) category = "suits";
  else if (/(watch|belt|bag|accessor)/.test(q)) category = "accessories";

  return {
    text,
    category,
    occasions,
    styles,
    materials,
    pairing,
    understated: /(understated|quiet|subtle|not too|nothing too)/.test(q),
    excludeBright: /(nothing too bright|not too bright|muted|understated)/.test(q),
  };
}

export function intentToQuery(intent: ParsedIntent): SearchQuery {
  return {
    text: intent.text,
    category: intent.category,
    materials: intent.materials.length ? intent.materials : undefined,
    styles: intent.styles.length ? intent.styles : undefined,
    occasions: intent.occasions.length ? intent.occasions : undefined,
    excludeBright: intent.excludeBright || undefined,
  };
}
